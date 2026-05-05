import { useShelterStore } from './use-shelter-store';

export function usePets() {
  const { pets, addPet, updatePet, deletePet, vaccineSchedules, healthRecords } = useShelterStore();

  return { pets, addPet, updatePet, deletePet, vaccineSchedules, healthRecords };
}
