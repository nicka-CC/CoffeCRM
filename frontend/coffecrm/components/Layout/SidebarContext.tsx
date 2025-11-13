'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SidebarContextType {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Инициализируем состояние синхронно, читая из localStorage (только на клиенте)
  const getInitial = () => {
    try {
      const saved = localStorage.getItem('sidebarCollapsed');
      return saved !== null ? JSON.parse(saved) as boolean : false;
    } catch (e) {
      return false;
    }
  };

  const [collapsed, setCollapsedState] = useState<boolean>(() => {
    // safe access: if localStorage unavailable, fallback to false
    if (typeof window === 'undefined') return false;
    return getInitial();
  });

  const setCollapsed = (value: boolean) => {
    setCollapsedState(value);
    try {
      localStorage.setItem('sidebarCollapsed', JSON.stringify(value));
    } catch (e) {
      // ignore write errors
    }
  };

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};
