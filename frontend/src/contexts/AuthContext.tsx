import { createContext, useMemo, useState, ReactNode } from 'react';
import {
  AuthContextType,
  AuthRequestDto,
  AuthResponseDto,
  MaybeAuthenticatedUser,
  RegisterRequestDto,
} from '../types';
import { authApi } from '../api';
import {
  clearAuthenticatedUser,
  getAuthenticatedUser,
  storeAuthenticatedUser,
} from '../utils/session';

const defaultAuthContext: AuthContextType = {
  authenticatedUser: undefined,
  isAuthenticated: false,
  registerUser: async () => {},
  loginUser: async () => {},
  clearUser: () => {},
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [authenticatedUser, setAuthenticatedUser] =
    useState<MaybeAuthenticatedUser>(getAuthenticatedUser());

  const registerUser = async (newUser: RegisterRequestDto) => {
    try {
      const createdUser: AuthResponseDto = await authApi.register(newUser);

      setAuthenticatedUser(createdUser);
      storeAuthenticatedUser(createdUser);
    } catch (err) {
      console.error('registerUser::error: ', err);
      throw err;
    }
  };

  const loginUser = async (credentials: AuthRequestDto) => {
    try {
      const user: AuthResponseDto = await authApi.login(credentials);

      setAuthenticatedUser(user);
      storeAuthenticatedUser(user);
    } catch (err) {
      console.error('loginUser::error: ', err);
      throw err;
    }
  };

  const clearUser = () => {
    clearAuthenticatedUser();
    setAuthenticatedUser(undefined);
  };

  const authContextValue = useMemo(
    () => ({
      authenticatedUser,
      isAuthenticated: !!authenticatedUser,
      registerUser,
      loginUser,
      clearUser,
    }),
    [authenticatedUser],
  );

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthContextProvider };
