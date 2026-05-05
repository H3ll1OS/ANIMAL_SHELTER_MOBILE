export const donationService = {
  list: '/donations',
  detail: (donationId: string) => `/donations/${donationId}`,
};
