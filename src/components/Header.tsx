"use client";

import React, { useState, useEffect } from 'react';
import { Menu, Calendar, ChevronDown, Sun, Moon, LogOut } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface HeaderProps {
  onMenuToggle: () => void;
}

const USFlag = () => (
  <svg viewBox="0 0 20 14" className="w-4 h-3 rounded-xs shrink-0 shadow-2xs">
    <rect width="20" height="14" fill="#C8102E"/>
    <rect y="1.07" width="20" height="1.07" fill="#FFF"/>
    <rect y="3.21" width="20" height="1.07" fill="#FFF"/>
    <rect y="5.35" width="20" height="1.07" fill="#FFF"/>
    <rect y="7.5" width="20" height="1.07" fill="#FFF"/>
    <rect y="9.64" width="20" height="1.07" fill="#FFF"/>
    <rect y="11.78" width="20" height="1.07" fill="#FFF"/>
    <rect width="8" height="7.5" fill="#002F6C"/>
    <circle cx="2" cy="2" r="0.4" fill="#FFF"/>
    <circle cx="4" cy="2" r="0.4" fill="#FFF"/>
    <circle cx="6" cy="2" r="0.4" fill="#FFF"/>
    <circle cx="3" cy="3.5" r="0.4" fill="#FFF"/>
    <circle cx="5" cy="3.5" r="0.4" fill="#FFF"/>
    <circle cx="2" cy="5" r="0.4" fill="#FFF"/>
    <circle cx="4" cy="5" r="0.4" fill="#FFF"/>
    <circle cx="6" cy="5" r="0.4" fill="#FFF"/>
  </svg>
);

const KHFlag = () => (
  <svg viewBox="0 0 20 14" className="w-4 h-3 rounded-xs shrink-0 shadow-2xs">
    <rect width="20" height="14" fill="#032A75"/>
    <rect y="3.5" width="20" height="7" fill="#C8102E"/>
    <path d="M10 4.5l-.8 1.5h1.6zm-1.8 1.8l-.6 1.2h2.8l-.6-1.2zm3.6 0l-.6 1.2h2.8l-.6-1.2zM7 9v1.5h6V9H7z" fill="#FFFFFF"/>
  </svg>
);

export const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const { language, setLanguage, t, settings, currentStaff, setCurrentStaff, theme, toggleTheme, logout } = useApp();
  const [mounted, setMounted] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  // Prevent hydration mismatch for locale-dependent dates
  useEffect(() => {
    setMounted(true);
  }, []);

  const getInitials = (name: string) => {
    if (!name) return '??';
    return name.substring(0, 2).toUpperCase();
  };

  // Format today's date in selected locale language
  const getFormattedDate = () => {
    const locale = language === 'en' ? 'en-US' : 'km-KH';
    return new Date().toLocaleDateString(locale, {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-gray-200 dark:border-zinc-900 bg-white dark:bg-zinc-950 px-4 md:px-6 shrink-0">
      {/* Left side */}
      <div className="flex items-center gap-4">
        {/* Mobile menu toggle */}
        <button
          onClick={onMenuToggle}
          className="md:hidden text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-100 transition-colors p-1"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Date display */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500 dark:text-zinc-400 bg-gray-50 dark:bg-zinc-900 px-2.5 py-1.5 rounded-lg border border-gray-100 dark:border-zinc-800">
          <Calendar className="h-3.5 w-3.5 text-gray-400 dark:text-zinc-500" />
          <span>{mounted ? getFormattedDate() : '...'}</span>
        </div>

        {/* Language Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 border border-gray-200 dark:border-zinc-800 rounded-lg bg-gray-50 dark:bg-zinc-900 text-[10px] font-bold text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors shadow-2xs focus:outline-none"
          >
            {language === 'en' ? <USFlag /> : <KHFlag />}
            <span>{language === 'en' ? 'EN' : 'ខ្មែរ'}</span>
            <ChevronDown className="h-3 w-3 text-gray-400 dark:text-zinc-500" />
          </button>

          {isLangDropdownOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsLangDropdownOpen(false)} />
              <div className="absolute right-0 mt-2 w-28 bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl shadow-lg py-1 z-50 text-xs font-semibold text-gray-700 dark:text-zinc-300 animate-in fade-in slide-in-from-top-1 duration-100">
                <button
                  onClick={() => {
                    setLanguage('en');
                    setIsLangDropdownOpen(false);
                  }}
                  className={`w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-zinc-900/50 transition-colors ${
                    language === 'en' ? 'text-blue-600 dark:text-blue-400 font-bold bg-blue-50/10 dark:bg-blue-950/20' : ''
                  }`}
                >
                  <USFlag />
                  <span>English</span>
                </button>
                <button
                  onClick={() => {
                    setLanguage('km');
                    setIsLangDropdownOpen(false);
                  }}
                  className={`w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-zinc-900/50 transition-colors ${
                    language === 'km' ? 'text-blue-600 dark:text-blue-400 font-bold bg-blue-50/10 dark:bg-blue-950/20' : ''
                  }`}
                >
                  <KHFlag />
                  <span>ខ្មែរ</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-1.5 border border-gray-200 dark:border-zinc-800 rounded-lg bg-gray-50 dark:bg-zinc-900 text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-200 transition-colors shadow-2xs focus:outline-none"
          title={theme === 'light' ? (language === 'en' ? 'Dark Mode' : 'មុខងារងងឹត') : (language === 'en' ? 'Light Mode' : 'មុខងារពន្លឺ')}
        >
          {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4 text-amber-500" />}
        </button>

        {/* User initials bubble & switcher */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-7 h-7 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center text-xs font-semibold transition-all hover:scale-105 shrink-0 focus:outline-none"
            title={language === 'en' ? 'Switch Staff Profile' : 'ប្តូរគណនីបុគ្គលិក'}
          >
            {getInitials(currentStaff)}
          </button>
          
          {isDropdownOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
              <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl shadow-lg py-1.5 z-50 text-xs font-semibold text-gray-700 dark:text-zinc-300 animate-in fade-in slide-in-from-top-1 duration-100">
                <div className="px-3 py-1.5 border-b border-gray-100 dark:border-zinc-900 text-[9px] text-gray-400 dark:text-zinc-500 font-bold uppercase tracking-wider">
                  {language === 'en' ? 'Switch Staff' : 'ប្តូរបុគ្គលិក'}
                </div>
                <div className="max-h-48 overflow-y-auto">
                  {settings.staffNames.map((name) => (
                    <button
                      key={name}
                      onClick={() => {
                        setCurrentStaff(name);
                        setIsDropdownOpen(false);
                      }}
                      type="button"
                      className={`w-full px-3 py-2.5 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-zinc-900/50 transition-colors ${
                        currentStaff === name ? 'text-black dark:text-white font-bold bg-neutral-50/50 dark:bg-zinc-900/20' : ''
                      }`}
                    >
                      <span className="truncate">{name}</span>
                      {currentStaff === name && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-xs shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
                <div className="border-t border-gray-100 dark:border-zinc-900 my-1" />
                <button
                  onClick={() => {
                    const msg = language === 'en' 
                      ? 'Are you sure you want to log out?' 
                      : 'តើអ្នកប្រាកដជាចង់ចាកចេញមែនទេ?';
                    if (window.confirm(msg)) {
                      logout();
                      setIsDropdownOpen(false);
                    }
                  }}
                  type="button"
                  className="w-full px-3.5 py-2 text-left flex items-center gap-2 text-red-600 hover:bg-red-50/50 dark:hover:bg-red-950/20 transition-colors font-bold"
                >
                  <LogOut className="h-4 w-4 text-red-550 shrink-0" />
                  <span>{language === 'en' ? 'Log Out' : 'ចាកចេញ'}</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
