"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, 
  CalendarRange, 
  Car, 
  Receipt, 
  Settings as SettingsIcon,
  X,
  ShieldCheck,
  User,
  CarFront,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const { settings, t, logout, language } = useApp();

  const navItems = [
    { name: t('dashboard'), href: '/', icon: LayoutDashboard },
    { name: t('rentals'), href: '/rentals', icon: CalendarRange },
    { name: t('vehicles'), href: '/vehicles', icon: Car },
    { name: t('drivers'), href: '/drivers', icon: User },
    { name: t('expenses'), href: '/expenses', icon: Receipt },
    { name: t('settings'), href: '/settings', icon: SettingsIcon },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-950 border-r border-gray-200 dark:border-zinc-900 w-64">
      {/* Brand header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-zinc-900">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-neutral-950 via-neutral-900 to-neutral-800 text-white shadow-xs border border-neutral-800/80 dark:border-zinc-700/80">
            <CarFront className="h-5 w-5 text-neutral-100" />
          </div>
          <div>
            <span className="font-semibold text-sm text-gray-900 dark:text-zinc-100 tracking-tight block">
              {settings.businessName}
            </span>
            <span className="text-[10px] text-gray-500 dark:text-zinc-400 font-medium tracking-wider uppercase block">
              {t('staffPortal')}
            </span>
          </div>
        </div>
        
        {/* Mobile close button */}
        <button 
          onClick={onClose}
          className="md:hidden text-gray-500 hover:text-gray-900 transition-colors p-1"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname ? (pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))) : false;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => {
                if (isOpen) onClose();
              }}
              className={`flex items-center gap-3 px-3 py-2.5 text-xs font-semibold rounded-lg transition-all border ${
                isActive 
                  ? 'bg-blue-50/60 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border-blue-100/60 dark:border-blue-900/30 shadow-2xs' 
                  : 'text-gray-500 dark:text-zinc-400 hover:bg-gray-50/80 dark:hover:bg-zinc-900/50 hover:text-gray-900 dark:hover:text-zinc-100 border-transparent'
              }`}
            >
              <Icon className={`h-4.5 w-4.5 shrink-0 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-zinc-500'}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Account indicator */}
      <div className="p-4 border-t border-gray-100 dark:border-zinc-900 flex flex-col gap-2 bg-gray-50/20">
        <div className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-zinc-900/50 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-zinc-800 flex items-center justify-center text-xs font-semibold text-gray-700 dark:text-zinc-300">
            S
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold text-gray-900 dark:text-zinc-100 truncate">
              {t('staffMember')}
            </p>
            <p className="text-[9px] text-gray-500 dark:text-zinc-400 truncate flex items-center gap-0.5">
              <ShieldCheck className="h-3 w-3 text-emerald-500 shrink-0 inline" /> {t('adminRole')}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            logout();
            if (isOpen) onClose();
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50/50 dark:hover:bg-red-950/20 hover:text-red-700 rounded-lg transition-all border border-transparent"
        >
          <LogOut className="h-4.5 w-4.5 text-red-500 shrink-0" />
          <span>{language === 'en' ? 'Log Out' : 'ចាកចេញ'}</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (permanently visible on md+) */}
      <div className="hidden md:block h-screen sticky top-0 shrink-0">
        {sidebarContent}
      </div>

      {/* Mobile Drawer (visible on mobile when open) */}
      <div 
        className={`md:hidden fixed inset-0 z-40 flex transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Overlay */}
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-gray-900/30 backdrop-blur-xs transition-opacity" 
        />

        {/* Drawer contents */}
        <div 
          className={`relative flex flex-col max-w-xs w-full bg-white h-full transform transition-transform duration-300 ease-in-out ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {sidebarContent}
        </div>
      </div>
    </>
  );
};
