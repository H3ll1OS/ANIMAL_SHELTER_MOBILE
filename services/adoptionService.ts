export const adoptionService = {
  list: '/adoptions',
  submitForPet: (petId: string) => `/pets/${petId}/adoptions`,
  approve: (adoptionId: string) => `/adoptions/${adoptionId}/approve`,
  reject: (adoptionId: string) => `/adoptions/${adoptionId}/reject`,
};
