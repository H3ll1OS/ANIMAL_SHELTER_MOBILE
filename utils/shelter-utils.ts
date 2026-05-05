import type { AdoptionStatus, Donation, PaymentMethod, Pet, PetStatus } from '@/types/shelter';
import type { AdminHealthStatus } from '@/types/navigation';

export const demoAccounts = [
  { label: 'Client Demo', email: 'testuser@shelter.com', password: 'password' },
  { label: 'Admin Demo', email: 'admin@shelter.com', password: 'password' },
  { label: 'Developer Demo', email: 'dev@shelter.com', password: 'password' },
];

export function splitFullName(name?: string | null) {
  const parts = (name ?? '').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { firstName: '', lastName: '' };
  if (parts.length === 1) return { firstName: parts[0], lastName: '' };
  return { firstName: parts[0], lastName: parts.slice(1).join(' ') };
}

export function getInitials(name?: string | null) {
  const parts = (name ?? '').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'AS';
  return parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? '').join('');
}

export type PaymentMethodVisual = {
  shortLabel: string;
  note: string;
  badge: string;
  accent: string;
  accentDeep: string;
  soft: string;
  border: string;
};

export const paymentMethodVisuals: Record<PaymentMethod, PaymentMethodVisual> = {
  gcash: {
    shortLabel: 'GCash',
    note: 'Mobile wallet',
    badge: 'Instant',
    accent: '#0057ff',
    accentDeep: '#003bb3',
    soft: '#eef4ff',
    border: '#c9d9ff',
  },
  paypal: {
    shortLabel: 'PayPal',
    note: 'Fast checkout',
    badge: 'Global',
    accent: '#0070ba',
    accentDeep: '#003087',
    soft: '#edf6ff',
    border: '#c9e3ff',
  },
  bank_transfer: {
    shortLabel: 'Bank',
    note: 'Direct transfer',
    badge: 'Verified',
    accent: '#1f7a5c',
    accentDeep: '#175844',
    soft: '#eefbf4',
    border: '#cce8d9',
  },
  credit_card: {
    shortLabel: 'Card',
    note: 'Secure card',
    badge: 'Protected',
    accent: '#7c3aed',
    accentDeep: '#5b21b6',
    soft: '#f4efff',
    border: '#ddd0ff',
  },
};

export function makePetForm(pet?: Pet) {
  return {
    name: pet?.name ?? '',
    species: pet?.species ?? 'Dog',
    breed: pet?.breed ?? '',
    age: pet ? String(pet.age) : '1',
    gender: pet?.gender ?? 'Male',
    description: pet?.description ?? '',
    imageLabel: pet?.imageLabel ?? 'Warm portrait',
    status: pet?.status ?? 'Available',
    dateReceived: pet?.dateReceived ?? '2026-04-16',
    size: pet?.size ?? 'Medium',
  };
}

export function petPayloadFromForm(form: ReturnType<typeof makePetForm>) {
  return {
    name: form.name,
    species: form.species,
    breed: form.breed,
    age: Number(form.age || 0),
    gender: form.gender as Pet['gender'],
    description: form.description,
    imageLabel: form.imageLabel,
    status: form.status as PetStatus,
    dateReceived: form.dateReceived,
    size: form.size as Pet['size'],
  };
}

export function makeHealthForm(record?: { petId: string; diagnosis: string; description: string; veterinarian: string; notes?: string; isCritical: boolean }, defaultPetId = '') {
  return {
    petId: record?.petId ?? defaultPetId,
    diagnosis: record?.diagnosis ?? '',
    description: record?.description ?? '',
    veterinarian: record?.veterinarian ?? '',
    notes: record?.notes ?? '',
    isCritical: record?.isCritical ?? false,
  };
}

export function makeVaccineForm(schedule?: { petId: string; vaccineType: string; nextDueDate: string; lastGivenDate?: string; veterinarian?: string; notes?: string }, defaultPetId = '') {
  return {
    petId: schedule?.petId ?? defaultPetId,
    vaccineType: schedule?.vaccineType ?? 'Rabies',
    nextDueDate: schedule?.nextDueDate ?? '2026-05-01',
    lastGivenDate: schedule?.lastGivenDate ?? '',
    veterinarian: schedule?.veterinarian ?? '',
    notes: schedule?.notes ?? '',
  };
}

export function makeEuthanasiaForm(log?: { petId: string; reason: string; euthanasiaDate: string; veterinarian: string; notes?: string }, defaultPetId = '') {
  return {
    petId: log?.petId ?? defaultPetId,
    reason: log?.reason ?? '',
    euthanasiaDate: log?.euthanasiaDate ?? '2026-04-16',
    veterinarian: log?.veterinarian ?? '',
    notes: log?.notes ?? '',
  };
}

export function getPetAvailabilityCopy(pet: Pet) {
  if (pet.status === 'Available') return 'Ready for meet and greet';
  if (pet.status === 'Sick') return 'Currently under treatment and monitoring';
  if (pet.status === 'Fostered') return 'Currently placed in foster care';
  if (pet.status === 'Adopted') return 'Already matched with an adopter';
  return 'Shelter care profile';
}

export function getPetVaccinationStatus(schedules: { isCompleted: boolean }[]) {
  if (schedules.some((schedule) => schedule.isCompleted)) return 'Up to date';
  if (schedules.length > 0) return 'Scheduled';
  return 'Needs review';
}

export function getPetHealthStatus(records: { diagnosis: string; isCritical: boolean }[]) {
  if (records.some((record) => record.isCritical)) return 'Under treatment';
  if (records.length > 0) return 'Stable';
  return 'Clear';
}

export function isPendingAdoptionStatus(status: AdoptionStatus) {
  return status === 'Pending' || status === 'Pending Review';
}

export function getAdminAdoptionStatusTone(status: AdoptionStatus) {
  if (status === 'Approved') return 'success';
  if (status === 'Rejected') return 'danger';
  return 'pending';
}

export function getAdminAdoptionStatusLabel(status: AdoptionStatus) {
  return isPendingAdoptionStatus(status) ? 'Pending' : status;
}

export function getAdminDonationStatus(donation: Donation): 'Pending' | 'Completed' | 'Failed' {
  if (!donation.adminSeenAt) return 'Pending';
  return 'Completed';
}

export function getAdminDonationStatusTone(donation: Donation) {
  const status = getAdminDonationStatus(donation);
  if (status === 'Completed') return 'success';
  if (status === 'Pending') return 'warning';
  return 'danger';
}

export function getDonationTransactionId(donation: Donation) {
  const refMatch = donation.notes.match(/(?:Ref|Reference Code|Transfer Ref|Transaction Code):\s*([A-Za-z0-9-]+)/i);
  if (refMatch?.[1]) return refMatch[1];
  return donation.id.toUpperCase();
}

export function getAdminHealthStatusPriority(status: AdminHealthStatus) {
  if (status === 'Active Alert') return 0;
  if (status === 'Check-up Due') return 1;
  return 2;
}

export function getAdminHealthStatusTone(status: AdminHealthStatus) {
  if (status === 'Active Alert') return 'danger';
  if (status === 'Check-up Due') return 'warning';
  return 'success';
}

export function getAdminHealthAppetiteLabel(item: { status: AdminHealthStatus; latestRecord?: { description: string; notes?: string | undefined } | null }) {
  const haystack = `${item.latestRecord?.description ?? ''} ${item.latestRecord?.notes ?? ''}`.toLowerCase();
  if (haystack.includes('loss of appetite') || haystack.includes('reduced appetite')) return 'Low';
  if (item.status === 'Active Alert') return 'Monitor';
  if (item.status === 'Check-up Due') return 'Stable';
  return 'Normal';
}

export function getAdminHealthEnergyLabel(item: { status: AdminHealthStatus; latestRecord?: { description: string; notes?: string | undefined } | null }) {
  const haystack = `${item.latestRecord?.description ?? ''} ${item.latestRecord?.notes ?? ''}`.toLowerCase();
  if (haystack.includes('weak') || haystack.includes('fatigue') || haystack.includes('letharg')) return 'Low';
  if (item.status === 'Active Alert') return 'Guarded';
  if (item.status === 'Check-up Due') return 'Moderate';
  return 'Good';
}

export function formatAdminCurrency(value: number) {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    maximumFractionDigits: 0,
  }).format(value || 0);
}

export function formatAdminDate(value: string | Date, options: Intl.DateTimeFormatOptions) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return typeof value === 'string' ? value : '';
  }

  return new Intl.DateTimeFormat('en-US', options).format(date);
}

export function getDateTimestamp(value: string) {
  const timestamp = new Date(value).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
}
