export const petService = {
  list: '/pets',
  detail: (petId: string) => `/pets/${petId}`,
};
