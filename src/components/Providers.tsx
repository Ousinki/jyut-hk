'use client';

import React, { ReactNode } from 'react';
import { AuthProvider } from '@/context/AuthContext';

export const Providers: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <AuthProvider>{children}</AuthProvider>;
};
