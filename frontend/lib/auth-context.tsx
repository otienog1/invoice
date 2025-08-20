'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Tenant, LoginData, RegisterData, AuthResponse } from '@/types';
import { authApi } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  tenant: Tenant | null;
  isLoading: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  selectTenant: (tenantId: number) => Promise<void>;
  getUserTenants: () => Promise<Tenant[]>;
  switchTenant: (tenantId: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      refreshUser();
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (data: LoginData) => {
    try {
      const response: AuthResponse = await authApi.login(data);
      localStorage.setItem('access_token', response.access_token);
      setUser(response.user);
      setTenant(response.tenant);
    } catch (error) {
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const response: AuthResponse = await authApi.register(data);
      localStorage.setItem('access_token', response.access_token);
      setUser(response.user);
      setTenant(response.tenant);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setUser(null);
    setTenant(null);
  };

  const refreshUser = async () => {
    try {
      setIsLoading(true);
      const profileData = await authApi.getProfile();
      setUser(profileData.user);
      setTenant(profileData.tenant);
    } catch (error) {
      // If refresh fails, logout
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const selectTenant = async (tenantId: number) => {
    try {
      const response = await authApi.selectTenant(tenantId);
      localStorage.setItem('access_token', response.access_token);
      setTenant(response.tenant);
    } catch (error) {
      throw error;
    }
  };

  const getUserTenants = async () => {
    try {
      return await authApi.getUserTenants();
    } catch (error) {
      throw error;
    }
  };

  const switchTenant = async (tenantId: number) => {
    try {
      const response = await authApi.selectTenant(tenantId);
      localStorage.setItem('access_token', response.access_token);
      setTenant(response.tenant);
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    tenant,
    isLoading,
    login,
    register,
    logout,
    refreshUser,
    selectTenant,
    getUserTenants,
    switchTenant,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};