export type UserRole = 'user' | 'admin' | 'developer';
export type UserStatus = 'Active' | 'Blocked';
export type PetStatus = 'Available' | 'Adopted' | 'Sick' | 'Fostered' | 'Euthanized';
export type PaymentMethod = 'gcash' | 'paypal' | 'bank_transfer' | 'credit_card';
export type AdoptionStatus = 'Pending' | 'Pending Review' | 'Approved' | 'Rejected';

export type ShelterUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  status: UserStatus;
  phone?: string;
  dateOfBirth?: string;
  address?: string;
  profileImage?: string;
  deleted?: boolean;
};

export type Pet = {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: number;
  gender: 'Male' | 'Female' | 'Unknown';
  description: string;
  imageLabel: string;
  imageUrl?: string;
  status: PetStatus;
  dateReceived: string;
  size: 'Small' | 'Medium' | 'Large';
};

export type Adoption = {
  id: string;
  petId: string;
  petName?: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  message: string;
  documents: string[];
  status: AdoptionStatus;
  createdAt: string;
  updatedAt: string;
  decisionSeenAt?: string | null;
  adminSeenAt?: string | null;
};

export type Donation = {
  id: string;
  userId?: string;
  name: string;
  lastName: string;
  email: string;
  state?: string;
  country?: string;
  zipCode?: string;
  amount: number;
  paymentMethod: PaymentMethod;
  notes: string;
  anonymous: boolean;
  createdAt: string;
  adminSeenAt?: string | null;
};

export type HealthRecord = {
  id: string;
  petId: string;
  diagnosis: string;
  description: string;
  veterinarian: string;
  notes?: string;
  isCritical: boolean;
  reportedDate: string;
};

export type VaccineSchedule = {
  id: string;
  petId: string;
  vaccineType: string;
  vaccinationDate?: string;
  lastGivenDate?: string;
  nextDueDate: string;
  veterinarian?: string;
  notes?: string;
  isCompleted: boolean;
  deleted?: boolean;
};

export type EuthanasiaLog = {
  id: string;
  petId: string;
  reason: string;
  euthanasiaDate: string;
  userId: string;
  veterinarian: string;
  notes?: string;
};
