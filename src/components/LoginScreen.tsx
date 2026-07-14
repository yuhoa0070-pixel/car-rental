"use client";

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Car, Eye, EyeOff, ShieldAlert, Key } from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { login, language } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Artificial delay to simulate secure authentication handshake
    setTimeout(() => {
      const success = login(email, password);
      setLoading(false);
      if (!success) {
        setError(
          language === 'en'
            ? 'Invalid email or password. Please try again.'
            : 'អុីម៉ែល ឬលេខកូដសម្ងាត់មិនត្រឹមត្រូវទេ។ សូមព្យាយាមម្តងទៀត។'
        );
      }
    }, 800);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-50/50 dark:bg-zinc-950 px-4 overflow-hidden">
      {/* Decorative blurred background shapes */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-100/40 dark:bg-blue-950/10 blur-3xl" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-100/30 dark:bg-emerald-950/10 blur-3xl" />
      
      <div className="w-full max-w-md z-10">
        {/* Brand logo & header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-neutral-900 dark:bg-zinc-900 rounded-2xl flex items-center justify-center shadow-md mb-3 border border-neutral-800 dark:border-zinc-800">
            <Car className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-lg font-bold text-gray-900 dark:text-zinc-100 tracking-tight">
            {language === 'en' ? 'Garage Admin Portal' : 'ប្រព័ន្ធគ្រប់គ្រងហ្គារ៉ាសឡាន'}
          </h1>
          <p className="text-xs text-gray-400 dark:text-zinc-500 mt-1 font-semibold">
            {language === 'en' ? 'Sign in to access your dashboard' : 'សូមចូលគណនីដើម្បីគ្រប់គ្រងទិន្នន័យ'}
          </p>
        </div>
 
        {/* Login form card */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 md:p-8 shadow-xl">
          {error && (
            <div className="mb-5 p-3.5 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-xl flex gap-2 text-xs font-semibold text-red-700 dark:text-red-400 animate-in fade-in slide-in-from-top-1 duration-200">
              <ShieldAlert className="h-4 w-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}
 
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold text-gray-700 dark:text-zinc-300">
            {/* Email Field */}
            <div className="space-y-1">
              <label className="font-semibold text-gray-600 dark:text-zinc-400">
                {language === 'en' ? 'Email Address' : 'អាសយដ្ឋានអុីម៉ែល'}
              </label>
              <input
                type="email"
                required
                placeholder="e.g. admin@garage.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all text-gray-900 dark:text-zinc-100"
              />
            </div>
 
            {/* Password Field */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="font-semibold text-gray-600 dark:text-zinc-400">
                  {language === 'en' ? 'Password' : 'លេខកូដសម្ងាត់'}
                </label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-3.5 pr-10 py-2.5 bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all text-gray-900 dark:text-zinc-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300 p-1"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
 
            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 bg-neutral-900 dark:bg-zinc-100 hover:bg-neutral-800 dark:hover:bg-zinc-200 text-white dark:text-black rounded-xl font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 focus:outline-none hover:scale-[1.01] active:scale-[0.99] disabled:opacity-75 disabled:pointer-events-none"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white dark:border-black border-t-transparent dark:border-t-transparent rounded-full animate-spin" />
                  <span>{language === 'en' ? 'Signing in...' : 'កំពុងចូល...'}</span>
                </>
              ) : (
                <span>{language === 'en' ? 'Sign In' : 'ចូលប្រព័ន្ធ'}</span>
              )}
            </button>
          </form>
        </div>
 
        {/* Demo Credentials Box */}
        <div className="mt-6 p-4 bg-neutral-100 dark:bg-zinc-900 border border-neutral-200/50 dark:border-zinc-800 rounded-2xl text-center shadow-3xs flex flex-col items-center">
          <span className="text-[10px] text-gray-400 dark:text-zinc-500 font-bold uppercase tracking-wider flex items-center gap-1 mb-1.5">
            <Key className="h-3 w-3 text-gray-400 dark:text-zinc-500 shrink-0" />
            <span>{language === 'en' ? 'Demo Admin Credentials' : 'គណនីសាកល្បងសម្រាប់តេស្ត'}</span>
          </span>
          <div className="flex gap-4 text-xs font-mono font-bold text-gray-700 dark:text-zinc-300">
            <div>
              <span className="text-gray-400 dark:text-zinc-500 font-semibold uppercase text-[9px] block">Email</span>
              <span>admin@garage.com</span>
            </div>
            <div className="border-r border-neutral-200 dark:border-zinc-800" />
            <div>
              <span className="text-gray-400 dark:text-zinc-500 font-semibold uppercase text-[9px] block">Password</span>
              <span>admin</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
