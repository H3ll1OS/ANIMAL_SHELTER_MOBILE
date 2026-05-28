import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AppState, Platform } from 'react-native';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';

import type {
  Adoption,
  Donation,
  EuthanasiaLog,
  HealthRecord,
  PaymentMethod,
  Pet,
  ShelterUser,
  UserRole,
  UserStatus,
  VaccineSchedule,
} from '@/types/shelter';

type LoginPayload = { email: string; password: string };
type RegisterPayload = { name: string; email: string; password: string };
type ProfileImageUpload = { uri: string; name?: string | null; mimeType?: string | null };
type ProfilePayload = { name: string; email: string; phone?: string; address?: string; dateOfBirth?: string; profileImage?: ProfileImageUpload | null };
type AdoptionPayload = {
  petId: string;
  fullName: string;
  email: string;
  phone: string;
  message: string;
  documents: string[];
};
type DonationPayload = {
  name: string;
  lastName: string;
  email: string;
  state?: string;
  country?: string;
  zipCode?: string;
  amount: number;
  paymentMethod: PaymentMethod;
  anonymous: boolean;
  paymentDetailSummary: string;
};
type PetPayload = Omit<Pet, 'id'>;
type HealthPayload = Omit<HealthRecord, 'id' | 'reportedDate'>;
type VaccinePayload = Omit<VaccineSchedule, 'id' | 'isCompleted' | 'deleted'>;
type EuthanasiaPayload = Omit<EuthanasiaLog, 'id' | 'userId'>;

type ShelterStore = {
  currentUser: ShelterUser | null;
  users: ShelterUser[];
  pets: Pet[];
  adoptions: Adoption[];
  donations: Donation[];
  healthRecords: HealthRecord[];
  vaccineSchedules: VaccineSchedule[];
  euthanasiaLogs: EuthanasiaLog[];
  notice: string | null;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  updateProfile: (payload: ProfilePayload) => Promise<void>;
  changePassword: (currentPassword: string, nextPassword: string) => Promise<void>;
  submitAdoption: (payload: AdoptionPayload) => Promise<void>;
  submitDonation: (payload: DonationPayload) => Promise<void>;
  addPet: (payload: PetPayload) => Promise<void>;
  updatePet: (petId: string, payload: PetPayload) => Promise<void>;
  deletePet: (petId: string) => Promise<void>;
  approveAdoption: (adoptionId: string) => Promise<void>;
  rejectAdoption: (adoptionId: string) => Promise<void>;
  clearNotifications: () => Promise<void>;
  addHealthRecord: (payload: HealthPayload) => Promise<void>;
  updateHealthRecord: (recordId: string, payload: HealthPayload) => Promise<void>;
  deleteHealthRecord: (recordId: string) => Promise<void>;
  addVaccineSchedule: (payload: VaccinePayload) => Promise<void>;
  markVaccineComplete: (scheduleId: string) => Promise<void>;
  deleteVaccineSchedule: (scheduleId: string) => Promise<void>;
  addEuthanasiaLog: (payload: EuthanasiaPayload) => Promise<void>;
  updateEuthanasiaLog: (logId: string, payload: EuthanasiaPayload) => Promise<void>;
  deleteEuthanasiaLog: (logId: string) => Promise<void>;
  updateUserRoleStatus: (userId: string, role: UserRole, status: UserStatus) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  deleteDonation: (donationId: string) => Promise<void>;
  dismissNotice: () => void;
};

type BootstrapPayload = {
  user: ApiUser | null;
  users: ApiUser[];
  pets: ApiPet[];
  adoptions: ApiAdoption[];
  donations: ApiDonation[];
  health_records: ApiHealthRecord[];
  vaccine_schedules: ApiVaccineSchedule[];
  euthanasia_logs: ApiEuthanasiaLog[];
};

type ApiUser = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  phone?: string | null;
  date_of_birth?: string | null;
  address?: string | null;
  profile_image?: string | null;
  profile_image_url?: string | null;
  profile_image_updated_at?: number | null;
};

type ApiPet = {
  id: number;
  name: string;
  species: string;
  breed: string | null;
  age: number;
  gender: Pet['gender'];
  description: string | null;
  image_label?: string | null;
  image_path?: string | null;
  status: string;
  image_url?: string | null;
  image_updated_at?: number | null;
  date_received: string | null;
  size: string;
};

type ApiAdoption = {
  id: number;
  pet_id: number;
  pet_name?: string | null;
  user_id: number;
  full_name: string;
  email: string;
  phone: string;
  message: string;
  documents: string[];
  status: string;
  created_at: string;
  updated_at: string;
  decision_seen_at?: string | null;
  admin_seen_at?: string | null;
};

type ApiDonation = {
  id: number;
  user_id?: number | null;
  name: string;
  last_name: string;
  email: string;
  state?: string | null;
  country?: string | null;
  zip_code?: string | null;
  amount: number;
  payment_method: PaymentMethod;
  notes?: string | null;
  anonymous: boolean;
  created_at: string;
  admin_seen_at?: string | null;
};

type ApiHealthRecord = {
  id: number;
  pet_id: number;
  diagnosis: string;
  description: string;
  veterinarian: string;
  notes?: string | null;
  is_critical: boolean;
  reported_date: string;
};

type ApiVaccineSchedule = {
  id: number;
  pet_id: number;
  vaccine_type: string;
  vaccination_date?: string | null;
  last_given_date?: string | null;
  next_due_date: string;
  veterinarian?: string | null;
  notes?: string | null;
  is_completed: boolean;
};

type ApiEuthanasiaLog = {
  id: number;
  pet_id: number;
  reason: string;
  euthanasia_date: string;
  user_id: number;
  veterinarian: string;
  notes?: string | null;
};

const API_PATH = '/Animal_Shelter/public/api/mobile';
const API_BASE_URL = resolveApiBaseUrl();
const AUTH_TOKEN_KEY = 'animal_shelter_api_token';
const LIVE_SYNC_INTERVAL_MS = 5000;
const ShelterContext = createContext<ShelterStore | null>(null);

export function ShelterProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const tokenRef = useRef<string | null>(null);
  const [currentUser, setCurrentUser] = useState<ShelterUser | null>(null);
  const [users, setUsers] = useState<ShelterUser[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [adoptions, setAdoptions] = useState<Adoption[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);
  const [vaccineSchedules, setVaccineSchedules] = useState<VaccineSchedule[]>([]);
  const [euthanasiaLogs, setEuthanasiaLogs] = useState<EuthanasiaLog[]>([]);
  const [notice, setNotice] = useState<string | null>(null);
  const refreshInFlightRef = useRef(false);
  const liveSyncTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const hydrate = useCallback((payload: BootstrapPayload) => {
    const mappedUser = payload.user ? mapUser(payload.user) : null;

    setCurrentUser(mappedUser);
    setUsers(payload.users?.length ? payload.users.map(mapUser) : mappedUser ? [mappedUser] : []);
    setPets(payload.pets.map(mapPet));
    setAdoptions(payload.adoptions.map(mapAdoption));
    setDonations(payload.donations.map(mapDonation));
    setHealthRecords(payload.health_records.map(mapHealthRecord));
    setVaccineSchedules(payload.vaccine_schedules.map(mapVaccineSchedule));
    setEuthanasiaLogs(payload.euthanasia_logs.map(mapEuthanasiaLog));
  }, []);

  const refreshBootstrap = useCallback(async (authToken?: string | null, options?: { silent?: boolean }) => {
    const activeToken = authToken !== undefined ? authToken : tokenRef.current;
    const silent = options?.silent ?? false;

    if (silent && refreshInFlightRef.current) {
      return;
    }

    refreshInFlightRef.current = true;

    try {
      const payload = await api<BootstrapPayload>('/bootstrap', {
        method: 'GET',
        token: activeToken,
      });
      if (activeToken && !payload.user) {
        await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
        tokenRef.current = null;
        setToken(null);
      }
      hydrate(payload);
      if (!silent) {
        setNotice(null);
      }
    } catch (error) {
      if (!silent) {
        setNotice(getApiErrorMessage(error));
      }
    } finally {
      refreshInFlightRef.current = false;
    }
  }, [hydrate]);

  const handleActionError = useCallback((error: unknown): never => {
    const message = getApiErrorMessage(error);
    setNotice(message);
    throw error instanceof Error ? error : new Error(message);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadStoredToken() {
      try {
        const storedToken = await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
        if (!isMounted) {
          return;
        }

        setToken(storedToken);
        tokenRef.current = storedToken;
        await refreshBootstrap(storedToken);
      } catch (error) {
        if (isMounted) {
          setNotice(getStorageErrorMessage(error));
          await refreshBootstrap(null);
        }
      }
    }

    void loadStoredToken();

    return () => {
      isMounted = false;
    };
  }, [refreshBootstrap]);

  useEffect(() => {
    const runLiveSync = () => {
      void refreshBootstrap(undefined, { silent: true });
    };
    const startLiveSync = () => {
      if (liveSyncTimerRef.current) {
        return;
      }
      liveSyncTimerRef.current = setInterval(runLiveSync, LIVE_SYNC_INTERVAL_MS);
    };
    const stopLiveSync = () => {
      if (!liveSyncTimerRef.current) {
        return;
      }
      clearInterval(liveSyncTimerRef.current);
      liveSyncTimerRef.current = null;
    };

    startLiveSync();

    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') {
        runLiveSync();
        startLiveSync();
      } else {
        stopLiveSync();
      }
    });

    return () => {
      subscription.remove();
      stopLiveSync();
    };
  }, [refreshBootstrap]);

  const value = useMemo<ShelterStore>(
    () => ({
      currentUser,
      users,
      pets,
      adoptions,
      donations,
      healthRecords,
      vaccineSchedules,
      euthanasiaLogs,
      notice,
      login: async (payload) => {
        try {
          const result = await api<{ token: string; user: ApiUser }>('/login', {
            method: 'POST',
            body: payload,
          });
          await SecureStore.setItemAsync(AUTH_TOKEN_KEY, result.token);
          setToken(result.token);
          tokenRef.current = result.token;
          setCurrentUser(mapUser(result.user));
          await refreshBootstrap(result.token);
          setNotice(`Signed in as ${result.user.name}.`);
        } catch (error) {
          handleActionError(error);
        }
      },
      logout: async () => {
        if (token) {
          await api('/logout', { method: 'POST', token });
        }
        await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
        setToken(null);
        tokenRef.current = null;
        await refreshBootstrap(null);
        setNotice('Signed out.');
      },
      register: async (payload) => {
        try {
          const result = await api<{ token: string; user: ApiUser }>('/register', {
            method: 'POST',
            body: payload,
          });
          await SecureStore.setItemAsync(AUTH_TOKEN_KEY, result.token);
          setToken(result.token);
          tokenRef.current = result.token;
          setCurrentUser(mapUser(result.user));
          await refreshBootstrap(result.token);
          setNotice(`Account created for ${result.user.name}.`);
        } catch (error) {
          handleActionError(error);
        }
      },
      requestPasswordReset: async (email) => {
        try {
          const result = await api<{ message: string }>('/forgot-password', {
            method: 'POST',
            body: { email },
          });
          setNotice(result.message);
        } catch (error) {
          handleActionError(error);
        }
      },
      updateProfile: async (payload) => {
        try {
          if (payload.profileImage?.uri) {
            const body = new FormData();
            body.append('_method', 'PUT');
            body.append('name', payload.name);
            body.append('email', payload.email);
            body.append('phone', payload.phone ?? '');
            body.append('address', payload.address ?? '');
            body.append('date_of_birth', payload.dateOfBirth ?? '');
            body.append('profile_image', {
              uri: payload.profileImage.uri,
              name: payload.profileImage.name || 'profile-photo.jpg',
              type: payload.profileImage.mimeType || 'image/jpeg',
            } as any);

            await api('/account', {
              method: 'POST',
              token,
              body,
            });
            await refreshBootstrap();
            setNotice('Profile updated successfully.');
            return;
          }

          await api('/account', {
            method: 'PUT',
            token,
            body: {
              name: payload.name,
              email: payload.email,
              phone: payload.phone,
              address: payload.address,
              date_of_birth: payload.dateOfBirth,
            },
          });
          await refreshBootstrap();
          setNotice('Profile updated successfully.');
        } catch (error) {
          handleActionError(error);
        }
      },
      changePassword: async (currentPassword, nextPassword) => {
        const result = await api<{ message: string }>('/account/password', {
          method: 'PUT',
          token,
          body: {
            current_password: currentPassword,
            password: nextPassword,
          },
        });
        setNotice(result.message);
      },
      submitAdoption: async (payload) => {
        await api(`/pets/${payload.petId}/adoptions`, {
          method: 'POST',
          token,
          body: {
            full_name: payload.fullName,
            email: payload.email,
            phone: payload.phone,
            message: payload.message,
            documents: payload.documents,
          },
        });
        await refreshBootstrap();
        setNotice('Adoption application submitted successfully.');
      },
      submitDonation: async (payload) => {
        await api('/donations', {
          method: 'POST',
          token,
          body: {
            name: payload.name,
            last_name: payload.lastName,
            email: payload.email,
            state: payload.state,
            country: payload.country,
            zip_code: payload.zipCode,
            amount: payload.amount,
            payment_method: payload.paymentMethod,
            anonymous: payload.anonymous,
            notes: payload.paymentDetailSummary,
          },
        });
        await refreshBootstrap();
        setNotice('Donation recorded successfully.');
      },
      addPet: async (payload) => {
        await api('/pets', {
          method: 'POST',
          token,
          body: petBody(payload),
        });
        await refreshBootstrap();
        setNotice('Pet created successfully.');
      },
      updatePet: async (petId, payload) => {
        await api(`/pets/${petId}`, {
          method: 'PUT',
          token,
          body: petBody(payload),
        });
        await refreshBootstrap();
        setNotice('Pet updated successfully.');
      },
      deletePet: async (petId) => {
        await api(`/pets/${petId}`, { method: 'DELETE', token });
        await refreshBootstrap();
        setNotice('Pet deleted successfully.');
      },
      approveAdoption: async (adoptionId) => {
        await api(`/adoptions/${adoptionId}/approve`, { method: 'POST', token });
        await refreshBootstrap();
        setNotice('Application approved successfully.');
      },
      rejectAdoption: async (adoptionId) => {
        await api(`/adoptions/${adoptionId}/reject`, { method: 'POST', token });
        await refreshBootstrap();
        setNotice('Application rejected successfully.');
      },
      clearNotifications: async () => {
        await refreshBootstrap();
        setNotice('Notifications refreshed from the API.');
      },
      addHealthRecord: async (payload) => {
        await api('/health-records', {
          method: 'POST',
          token,
          body: {
            pet_id: payload.petId,
            diagnosis: payload.diagnosis,
            description: payload.description,
            veterinarian: payload.veterinarian,
            notes: payload.notes,
            is_critical: payload.isCritical,
          },
        });
        await refreshBootstrap();
        setNotice('Health alert created successfully.');
      },
      updateHealthRecord: async (recordId, payload) => {
        await api(`/health-records/${recordId}`, {
          method: 'PUT',
          token,
          body: {
            pet_id: payload.petId,
            diagnosis: payload.diagnosis,
            description: payload.description,
            veterinarian: payload.veterinarian,
            notes: payload.notes,
            is_critical: payload.isCritical,
          },
        });
        await refreshBootstrap();
        setNotice('Health alert updated successfully.');
      },
      deleteHealthRecord: async (recordId) => {
        await api(`/health-records/${recordId}`, { method: 'DELETE', token });
        await refreshBootstrap();
        setNotice('Health alert deleted successfully.');
      },
      addVaccineSchedule: async (payload) => {
        await api('/vaccine-schedules', {
          method: 'POST',
          token,
          body: {
            pet_id: payload.petId,
            vaccine_type: payload.vaccineType,
            next_due_date: payload.nextDueDate,
            last_given_date: payload.lastGivenDate,
            veterinarian: payload.veterinarian,
            notes: payload.notes,
          },
        });
        await refreshBootstrap();
        setNotice('Vaccination schedule created successfully.');
      },
      markVaccineComplete: async (scheduleId) => {
        await api(`/vaccine-schedules/${scheduleId}/complete`, {
          method: 'POST',
          token,
        });
        await refreshBootstrap();
        setNotice('Vaccination updated successfully.');
      },
      deleteVaccineSchedule: async (scheduleId) => {
        await api(`/vaccine-schedules/${scheduleId}`, { method: 'DELETE', token });
        await refreshBootstrap();
        setNotice('Vaccination schedule deleted successfully.');
      },
      addEuthanasiaLog: async (payload) => {
        await api('/euthanasia-logs', {
          method: 'POST',
          token,
          body: {
            pet_id: payload.petId,
            reason: payload.reason,
            euthanasia_date: payload.euthanasiaDate,
            veterinarian: payload.veterinarian,
            notes: payload.notes,
          },
        });
        await refreshBootstrap();
        setNotice('Euthanasia log created successfully.');
      },
      updateEuthanasiaLog: async (logId, payload) => {
        await api(`/euthanasia-logs/${logId}`, {
          method: 'PUT',
          token,
          body: {
            pet_id: payload.petId,
            reason: payload.reason,
            euthanasia_date: payload.euthanasiaDate,
            veterinarian: payload.veterinarian,
            notes: payload.notes,
          },
        });
        await refreshBootstrap();
        setNotice('Euthanasia log updated successfully.');
      },
      deleteEuthanasiaLog: async (logId) => {
        await api(`/euthanasia-logs/${logId}`, { method: 'DELETE', token });
        await refreshBootstrap();
        setNotice('Euthanasia log deleted successfully.');
      },
      updateUserRoleStatus: async (userId, role, status) => {
        await api(`/users/${userId}/role-status`, {
          method: 'PUT',
          token,
          body: { role, status },
        });
        await refreshBootstrap();
        setNotice('User updated successfully.');
      },
      deleteUser: async (userId) => {
        await api(`/users/${userId}`, { method: 'DELETE', token });
        await refreshBootstrap();
        setNotice('User deleted successfully.');
      },
      deleteDonation: async (donationId) => {
        await api(`/donations/${donationId}`, { method: 'DELETE', token });
        await refreshBootstrap();
        setNotice('Donation deleted successfully.');
      },
      dismissNotice: () => setNotice(null),
    }),
    [adoptions, currentUser, donations, euthanasiaLogs, handleActionError, healthRecords, notice, pets, refreshBootstrap, token, users, vaccineSchedules]
  );

  return <ShelterContext.Provider value={value}>{children}</ShelterContext.Provider>;
}

export function useShelterStore() {
  const value = useContext(ShelterContext);
  if (!value) {
    throw new Error('useShelterStore must be used within ShelterProvider');
  }
  return value;
}

async function api<T = unknown>(
  path: string,
  options: { method: string; token?: string | null; body?: unknown }
): Promise<T> {
  let response: Response;
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: options.method,
      headers: {
        Accept: 'application/json',
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      },
      body: options.body ? (isFormData ? options.body as BodyInit : JSON.stringify(options.body)) : undefined,
    });
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }

  const text = await response.text();
  const data = text ? JSON.parse(text) : {};

  if (!response.ok) {
    throw new Error(normalizeApiError(data, response.status));
  }

  return data as T;
}

function petBody(payload: Omit<Pet, 'id'>) {
  return {
    name: payload.name,
    species: payload.species,
    breed: payload.breed,
    age: payload.age,
    gender: payload.gender,
    description: payload.description,
    image_path: payload.imageLabel,
    status: payload.status,
    date_received: payload.dateReceived,
    size: payload.size.toLowerCase(),
  };
}

function mapUser(user: ApiUser): ShelterUser {
  return {
    id: String(user.id),
    name: user.name,
    email: user.email,
    password: '',
    role: user.role,
    status: user.status,
    phone: user.phone ?? undefined,
    dateOfBirth: user.date_of_birth ?? undefined,
    address: user.address ?? undefined,
    profileImage: makeStorageUrl(user.profile_image, user.profile_image_updated_at) ?? user.profile_image_url ?? undefined,
  };
}

function mapPet(pet: ApiPet): Pet {
  return {
    id: String(pet.id),
    name: pet.name,
    species: pet.species,
    breed: pet.breed ?? 'Mixed Breed',
    age: Number(pet.age ?? 0),
    gender: pet.gender,
    description: pet.description ?? '',
    imageLabel: pet.image_label ?? pet.name,
    imageUrl: makeStorageUrl(pet.image_path, pet.image_updated_at) ?? pet.image_url ?? undefined,
    status: pet.status as Pet['status'],
    dateReceived: pet.date_received ?? '',
    size: normalizeSize(pet.size),
  };
}

function mapAdoption(adoption: ApiAdoption): Adoption {
  return {
    id: String(adoption.id),
    petId: String(adoption.pet_id),
    petName: adoption.pet_name ?? undefined,
    userId: String(adoption.user_id),
    fullName: adoption.full_name,
    email: adoption.email,
    phone: adoption.phone,
    message: adoption.message,
    documents: adoption.documents ?? [],
    status: normalizeAdoptionStatus(adoption.status),
    createdAt: adoption.created_at,
    updatedAt: adoption.updated_at,
    adminSeenAt: adoption.admin_seen_at,
    decisionSeenAt: adoption.decision_seen_at,
  };
}

function mapDonation(donation: ApiDonation): Donation {
  return {
    id: String(donation.id),
    userId: donation.user_id ? String(donation.user_id) : undefined,
    name: donation.name,
    lastName: donation.last_name,
    email: donation.email,
    state: donation.state ?? undefined,
    country: donation.country ?? undefined,
    zipCode: donation.zip_code ?? undefined,
    amount: Number(donation.amount),
    paymentMethod: donation.payment_method,
    notes: donation.notes ?? '',
    anonymous: donation.anonymous,
    createdAt: donation.created_at,
    adminSeenAt: donation.admin_seen_at,
  };
}

function mapHealthRecord(record: ApiHealthRecord): HealthRecord {
  return {
    id: String(record.id),
    petId: String(record.pet_id),
    diagnosis: record.diagnosis,
    description: record.description,
    veterinarian: record.veterinarian,
    notes: record.notes ?? undefined,
    isCritical: record.is_critical,
    reportedDate: record.reported_date,
  };
}

function mapVaccineSchedule(schedule: ApiVaccineSchedule): VaccineSchedule {
  return {
    id: String(schedule.id),
    petId: String(schedule.pet_id),
    vaccineType: schedule.vaccine_type,
    vaccinationDate: schedule.vaccination_date ?? undefined,
    lastGivenDate: schedule.last_given_date ?? undefined,
    nextDueDate: schedule.next_due_date,
    veterinarian: schedule.veterinarian ?? undefined,
    notes: schedule.notes ?? undefined,
    isCompleted: schedule.is_completed,
  };
}

function mapEuthanasiaLog(log: ApiEuthanasiaLog): EuthanasiaLog {
  return {
    id: String(log.id),
    petId: String(log.pet_id),
    reason: log.reason,
    euthanasiaDate: log.euthanasia_date,
    userId: String(log.user_id),
    veterinarian: log.veterinarian,
    notes: log.notes ?? undefined,
  };
}

function normalizeSize(size: string): Pet['size'] {
  const lowered = size.toLowerCase();
  if (lowered === 'small') return 'Small';
  if (lowered === 'large') return 'Large';
  return 'Medium';
}

function normalizeAdoptionStatus(status: string): Adoption['status'] {
  if (status === 'Pending Review') return 'Pending Review';
  if (status === 'Approved') return 'Approved';
  if (status === 'Rejected') return 'Rejected';
  return 'Pending';
}

function resolveApiBaseUrl() {
  const configuredUrl = sanitizeApiBaseUrl(process.env.EXPO_PUBLIC_API_BASE_URL);
  if (configuredUrl) {
    return configuredUrl;
  }

  const webHost = typeof window !== 'undefined' ? window.location.hostname : null;
  const expoHost =
    extractHostname(Constants.expoConfig?.hostUri) ??
    extractHostname(Constants.linkingUri) ??
    webHost ??
    (Platform.OS === 'android' ? '10.0.2.2' : '127.0.0.1');

  return `http://${expoHost}${API_PATH}`;
}

function sanitizeApiBaseUrl(value?: string | null) {
  if (!value) {
    return null;
  }

  return value.replace(/\/+$/, '');
}

function extractHostname(value?: string | null) {
  if (!value) {
    return null;
  }

  const trimmed = value.replace(/^[a-z]+:\/\//i, '').split('/')[0];
  const hostname = trimmed.split(':')[0];
  return hostname || null;
}

function makeStorageUrl(path?: string | null, version?: number | null) {
  if (!path) {
    return null;
  }

  if (/^(https?:|data:|file:|blob:)/i.test(path)) {
    return path;
  }

  const publicBaseUrl = API_BASE_URL.replace(/\/api\/mobile\/?$/i, '');
  const cleanPath = path.replace(/^\/+/, '');
  const suffix = version ? `?v=${version}` : '';

  return `${publicBaseUrl}/storage/${cleanPath}${suffix}`;
}

function getApiErrorMessage(error: unknown) {
  if (error instanceof Error && error.message !== 'Network request failed') {
    return error.message;
  }

  return `Failed to reach the Laravel API at ${API_BASE_URL}. Set EXPO_PUBLIC_API_BASE_URL if the backend runs on another host.`;
}

function getStorageErrorMessage(error: unknown) {
  if (error instanceof Error && error.message.trim()) {
    return `Failed to load saved login: ${error.message}`;
  }

  return 'Failed to load saved login.';
}

function normalizeApiError(data: unknown, status: number) {
  if (data && typeof data === 'object') {
    const payload = data as { message?: unknown; errors?: Record<string, unknown> };
    const fieldMessages = Object.values(payload.errors ?? {})
      .flatMap((value) => (Array.isArray(value) ? value : []))
      .filter((value): value is string => typeof value === 'string');

    if (fieldMessages.length) {
      return fieldMessages.join(' ');
    }

    if (typeof payload.message === 'string' && payload.message.trim()) {
      return payload.message;
    }
  }

  if (status === 422) {
    return 'Please review the form fields and try again.';
  }

  return 'Laravel API request failed.';
}
