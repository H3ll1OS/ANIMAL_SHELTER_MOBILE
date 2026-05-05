import { useShelterStore } from './use-shelter-store';

export function useAdoptions() {
  const { adoptions, submitAdoption, approveAdoption, rejectAdoption } = useShelterStore();

  return { adoptions, submitAdoption, approveAdoption, rejectAdoption };
}
