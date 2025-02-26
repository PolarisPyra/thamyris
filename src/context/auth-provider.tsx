import React, { createContext, useContext, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { api } from "@/utils";

interface User {
  userId: number;
  username: string;
  exp: number;
  aimeCardId: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean | null;
  isLoading: boolean;
  error: string;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (username: string, password: string, accessCode: string) => Promise<void>;
}

interface ApiResponse {
  message?: string;
  error?: string;
  userId?: number;
  authenticated?: boolean;
  user?: {
    userId: number;
    username: string;
    exp: number;
    aimeCardId: string;
  };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const verifyAuth = async () => {
    try {
      const response = await api.users.verify.$post();
      const data = (await response.json()) as ApiResponse;

      if (!response.ok || response.status === 401) {
        setUser(null);
        setIsAuthenticated(false);
        return false;
      }

      if (data.authenticated && data.user) {
        setUser({
          userId: data.user.userId,
          username: data.user.username,
          exp: data.user.exp ?? 0,
          aimeCardId: data.user.aimeCardId,
        });
        setIsAuthenticated(true);
        return true;
      }

      setUser(null);
      setIsAuthenticated(false);
      return false;
    } catch (err) {
      console.error("Auth verification error:", err);
      setUser(null);
      setIsAuthenticated(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    verifyAuth();
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await api.users.login.$post({
        json: { username, password },
      });

      if (response.ok) {
        const isVerified = await verifyAuth();
        if (isVerified) {
          navigate("/overview");
        } else {
          setError("Authentication failed after login");
        }
      } else {
        const data = (await response.json()) as ApiResponse;
        setError(data.error || "Login failed. Please check your credentials.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (username: string, password: string, accessCode: string) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await api.users.signup.$post({
        json: { username, password, accessCode },
      });

      if (response.ok) {
        const isVerified = await verifyAuth();
        if (isVerified) {
          navigate("/overview");
        } else {
          setError("Authentication failed after signup");
        }
      } else {
        const data = (await response.json()) as ApiResponse;
        setError(data.error || "Signup failed");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      const response = await api.users.logout.$post();
      if (response.ok) {
        setUser(null);
        setIsAuthenticated(false);
        navigate("");
      }
    } catch (err) {
      console.error("Logout error:", err);
      setError(err instanceof Error ? err.message : "Logout failed");
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    signup,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
