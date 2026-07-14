"use client";

import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useApp } from '../context/AppContext';
import { LoginScreen } from './LoginScreen';

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isLoaded, isAuthenticated } = useApp();

  if (!isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50/50 dark:bg-zinc-950 gap-3">
        <div className="w-5 h-5 border-2 border-black dark:border-white border-t-transparent dark:border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-gray-400 dark:text-zinc-500 font-medium tracking-tight">
          Initializing management system...
        </span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50/30 dark:bg-zinc-950">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header onMenuToggle={() => setIsSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto focus:outline-none p-4 md:p-8 dark:bg-zinc-900/40">
          {children}
        </main>
      </div>
    </div>
  );
};
