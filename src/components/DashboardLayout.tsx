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
      <div className="flex flex-col h-screen max-w-full overflow-x-hidden bg-gray-50/30 dark:bg-zinc-950">
        <main className="flex-1 overflow-y-auto overflow-x-hidden max-w-full focus:outline-none p-4 pb-24 dark:bg-zinc-900/40">
          {children}
        </main>
        
        {/* Bottom Tab Navigation Bar for Telegram (With Liquid Water Drop Animation) */}
        <nav className="fixed bottom-0 left-0 right-0 z-50 glass-dock flex justify-around items-center h-16 px-1 border-t border-gray-200/80 dark:border-zinc-800/80 shrink-0 max-w-full">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex flex-col items-center justify-center flex-1 h-12 py-1 gap-1 text-[9.5px] font-semibold transition-all duration-300 rounded-2xl max-w-[20%] ${
                  isActive 
                    ? 'text-blue-600 dark:text-blue-400 font-bold bg-gradient-to-b from-blue-500/20 via-sky-400/25 to-blue-600/10 border border-blue-400/40 dark:border-blue-500/30 animate-water-float animate-water-glow' 
                    : 'text-gray-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 active:scale-95'
                }`}
              >
                {/* Liquid Water Ripple Wave on Active Tab */}
                {isActive && <span aria-hidden="true" className="water-ripple" />}
                
                {/* Water Specular Gloss Highlight */}
                {isActive && (
                  <span aria-hidden="true" className="absolute inset-x-2 top-0.5 h-[40%] bg-gradient-to-b from-white/60 via-white/20 to-transparent rounded-t-xl pointer-events-none" />
                )}

                <div className="relative z-10 flex flex-col items-center gap-0.5">
                  <Icon className={`h-4.5 w-4.5 transition-all duration-300 ${isActive ? 'stroke-[2.5px] text-blue-600 dark:text-blue-400 scale-110 drop-shadow-[0_2px_8px_rgba(59,130,246,0.5)]' : 'stroke-[1.8px]'}`} />
                  <span className="truncate w-full text-center px-0.5">{item.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>
    );
  }

  return (
    <div className="flex h-screen max-w-full overflow-hidden bg-gray-50/30 dark:bg-zinc-950">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex flex-col flex-1 min-w-0 max-w-full overflow-hidden">
        <Header onMenuToggle={() => setIsSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto overflow-x-hidden max-w-full focus:outline-none p-4 md:p-8 dark:bg-zinc-900/40">
          {children}
        </main>
      </div>
    </div>
  );
};
