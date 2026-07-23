"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, CalendarRange, Car, Receipt, Settings } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useApp } from '../context/AppContext';
import { LoginScreen } from './LoginScreen';

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isLoaded, isAuthenticated, isTelegramMiniApp, t } = useApp();
  const pathname = usePathname();

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

  // Telegram Mini App container layout
  if (isTelegramMiniApp) {
    const navItems = [
      { name: t('dashboard'), href: '/', icon: LayoutDashboard },
      { name: t('rentals'), href: '/rentals', icon: CalendarRange },
      { name: t('vehicles'), href: '/vehicles', icon: Car },
      { name: t('expenses'), href: '/expenses', icon: Receipt },
      { name: t('settings'), href: '/settings', icon: Settings },
    ];

    return (
      <div className="flex flex-col h-screen overflow-hidden bg-gray-50/30 dark:bg-zinc-950">
        <main className="flex-1 overflow-y-auto focus:outline-none p-4 pb-20 dark:bg-zinc-900/40">
          {children}
        </main>
        
        {/* Bottom Tab Navigation Bar for Telegram (iPhone Dock Style) */}
        <nav className="fixed bottom-2 left-3 right-3 z-50 glass-dock rounded-2xl flex justify-around items-center h-16 px-2 shrink-0">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center flex-1 h-12 py-1 gap-1 text-[9.5px] font-semibold transition-all duration-200 rounded-xl ${
                  isActive 
                    ? 'text-blue-600 dark:text-blue-400 font-bold bg-blue-500/10 dark:bg-blue-400/15 backdrop-blur-xs scale-105' 
                    : 'text-gray-500 dark:text-zinc-400 hover:text-gray-800 dark:hover:text-zinc-200 active:scale-95'
                }`}
              >
                <Icon className={`h-4.5 w-4.5 transition-transform ${isActive ? 'stroke-[2.5px] text-blue-600 dark:text-blue-400' : 'stroke-[1.8px]'}`} />
                <span className="truncate max-w-[64px]">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    );
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
