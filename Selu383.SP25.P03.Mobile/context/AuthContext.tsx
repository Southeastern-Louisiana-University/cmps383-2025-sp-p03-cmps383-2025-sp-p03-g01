import React, { createContext, useEffect, useState, ReactNode } from "react";
import AuthServices from "@/services/AuthServices";
import AsyncStorage from "@react-native-async-storage/async-storage";

const authServices = new AuthServices();

interface User {
  id: number;
  userName: string;
  roles: string[]; 
}

interface AuthType {
  isAuthenticated: boolean;
  isLoading: boolean;
  signin: (username: string, password: string) => Promise<User | null>;
  signout: () => Promise<void>;
  user: User | null;
  error: string | null;
}

export const AuthContext = createContext<AuthType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      try {
        const userData = await authServices.getCurrentUser();
        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);
          await AsyncStorage.setItem("user", JSON.stringify(userData));
        } else {
          await clearAuthState();
        }
      } catch (error) {
        console.error("Initial auth check failed:", error);
        await clearAuthState();
        setError("Failed to initialize authentication");
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const clearAuthState = async () => {
    await AsyncStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
  };

  const signin = async (username: string, password: string): Promise<User | null> => {
    setIsLoading(true);
    setError(null);

    try {
      await clearAuthState();

      const response = await authServices.login({ username, password });
      const userData = response?.user || response;

      if (!userData) {
        throw new Error("Login succeeded but no user data received");
      }

      await AsyncStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);
      return userData;
    } catch (error: any) {
      console.error("Login failed:", error);
      setError(error.message || "Login failed. Please check your credentials.");
      await clearAuthState();
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const signout = async () => {
    setIsLoading(true);
    try {
      await authServices.logout();
      await clearAuthState();
    } catch (error) {
      console.error("Logout failed:", error);
      setError("Logout failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        signin,
        signout,
        user,
        isLoading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
