import { createContext, useContext } from 'react';
import type React from 'react';
import type { ViewStyle } from 'react-native';

import type { PaymentMethodVisual, makeEuthanasiaForm, makeHealthForm, makePetForm, makeVaccineForm } from '@/utils/shelter-utils';
import type { useShelterStore } from '@/hooks/use-shelter-store';
import type { Adoption, Donation, EuthanasiaLog, HealthRecord, PaymentMethod, Pet, ShelterUser, UserRole, UserStatus, VaccineSchedule } from '@/types/shelter';
import type { AdminHealthStatus, DeveloperSection, PublicSection } from '@/types/navigation';

type AnySetter = {
  (updater: (current: any) => any): void;
  (value: any): void;
};
type AnyRecord = Record<string, any>;
type ShelterStore = ReturnType<typeof useShelterStore>;
type PetForm = ReturnType<typeof makePetForm>;
type HealthForm = ReturnType<typeof makeHealthForm>;
type VaccineForm = ReturnType<typeof makeVaccineForm>;
type EuthanasiaForm = ReturnType<typeof makeEuthanasiaForm>;
type DonationForm = {
  name: string;
  lastName: string;
  email: string;
  state: string;
  country: string;
  zipCode: string;
  amount: string;
  anonymous: boolean;
  paymentMethod: PaymentMethod;
  detailA: string;
  detailB: string;
};
type ProfileForm = { name: string; email: string; phone: string; address: string; dateOfBirth: string; profileImage?: { uri: string; name?: string | null; mimeType?: string | null } | null };
type PasswordForm = { currentPassword: string; nextPassword: string };
type CountTab = { key: string; label: string; count: number };
type ActionItem = AnyRecord;
type AdminHealthQueueItem = {
  pet: Pet;
  status: AdminHealthStatus;
  summary: string;
  note: string;
  records: HealthRecord[];
  schedules: VaccineSchedule[];
  logs: EuthanasiaLog[];
  latestRecord: HealthRecord | null;
  nextDueSchedule: VaccineSchedule | null;
};

export type ShelterAppContextValue = {
  [key: string]: any;
  store: ShelterStore;
  activePublicSection: PublicSection;
  setActivePublicSection: AnySetter;
  activeDeveloperSection: DeveloperSection;
  setActiveDeveloperSection: AnySetter;
  speciesFilter: string;
  setSpeciesFilter: AnySetter;
  favoritePetIds: string[];
  setFavoritePetIds: AnySetter;
  currentUser: ShelterUser | null;
  currentUserAdoptions: Adoption[];
  selectedPet: Pet | null;
  selectedManagedUser: ShelterUser;
  selectedDonation: Donation;
  selectedAdoption: Adoption | null;
  selectedHealthItem: AdminHealthQueueItem;
  selectedHealthLatestRecord: HealthRecord | null;
  selectedHealthNextDueSchedule: VaccineSchedule | null;
  selectedHealthRecords: HealthRecord[];
  selectedHealthSchedules: VaccineSchedule[];
  selectedHealthLogs: EuthanasiaLog[];
  selectedDonorHistory: Donation[];
  selectedPetVaccines: VaccineSchedule[];
  selectedPetHealthRecords: HealthRecord[];
  homePreviewPets: Pet[];
  adoptFilteredPets: Pet[];
  adminFilteredPets: Pet[];
  adminFilteredAdoptions: Adoption[];
  adminFilteredDonations: Donation[];
  adminFilteredHealthQueue: AdminHealthQueueItem[];
  adminOverviewMetrics: readonly ActionItem[];
  adminQuickActions: readonly ActionItem[];
  adminRecentActivities: ActionItem[];
  adminDonationMetrics: readonly ActionItem[];
  adminDonationTabs: readonly CountTab[];
  adminAdoptionTabs: readonly CountTab[];
  adminHealthMetrics: readonly ActionItem[];
  adminHealthTabs: readonly CountTab[];
  petApplicationUploads: AnyRecord[];
  petApplicationForm: AnyRecord;
  petApplicationFieldErrors: AnyRecord;
  isSubmittingDonation: boolean;
  donationForm: DonationForm;
  donationMethodOptions: { method: PaymentMethod }[];
  activeDonationMethodVisual: PaymentMethodVisual;
  profileForm: ProfileForm;
  passwordForm: PasswordForm;
  petForm: PetForm;
  healthForm: HealthForm;
  vaccineForm: VaccineForm;
  euthanasiaForm: EuthanasiaForm;
  userRoleDraft: UserRole;
  setUserRoleDraft: AnySetter;
  userStatusDraft: UserStatus;
  setUserStatusDraft: AnySetter;
  recordWidthStyle: ViewStyle;
  clientSplitFieldStyle: ViewStyle;
  clientFullFieldStyle: ViewStyle;
  homePetCardWidthStyle: ViewStyle;
  adoptPetCardWidthStyle: ViewStyle;
  adminOverviewMetricWidthStyle: ViewStyle;
  adminQuickActionWidthStyle: ViewStyle;
  setPetApplicationForm: AnySetter;
  setPetApplicationError: AnySetter;
  submitClientDonation: () => Promise<void>;
  setDonationForm: AnySetter;
  setIsPaymentMethodMenuOpen: AnySetter;
  setProfileForm: AnySetter;
  setPasswordForm: AnySetter;
  setPetForm: AnySetter;
  setHealthForm: AnySetter;
  setVaccineForm: AnySetter;
  setEuthanasiaForm: AnySetter;
  setNotificationsEnabled: AnySetter;
  setFaceIdEnabled: AnySetter;
  setShowProfileEditor: AnySetter;
  setShowPasswordEditor: AnySetter;
  setSelectedUserId: AnySetter;
};

const ShelterAppContext = createContext<ShelterAppContextValue | null>(null);

export function ShelterAppProvider({ value, children }: { value: ShelterAppContextValue; children: React.ReactNode }) {
  return <ShelterAppContext.Provider value={value}>{children}</ShelterAppContext.Provider>;
}

export function useShelterAppContext() {
  const value = useContext(ShelterAppContext);
  if (!value) {
    throw new Error('useShelterAppContext must be used inside ShelterAppProvider');
  }

  return value;
}
