export type LoginPayload = { email: string; password: string };
export type RegisterPayload = { name: string; email: string; password: string };

export const authService = {
  login: '/login',
  logout: '/logout',
  register: '/register',
  forgotPassword: '/forgot-password',
};
