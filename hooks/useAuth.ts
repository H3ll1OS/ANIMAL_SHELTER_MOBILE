import { useShelterStore } from './use-shelter-store';

export function useAuth() {
  const { currentUser, login, logout, register, requestPasswordReset, updateProfile, changePassword } = useShelterStore();

  return {
    currentUser,
    login,
    logout,
    register,
    requestPasswordReset,
    updateProfile,
    changePassword,
    isAuthenticated: Boolean(currentUser),
  };
}
