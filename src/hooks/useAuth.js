import { useUserStore } from '../store/useUserStore';

const useAuth = () => {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  return isAuthenticated;
};

export default useAuth;
