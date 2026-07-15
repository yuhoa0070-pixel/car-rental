"use client";

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building,
  UserCheck,
  Plus,
  Trash2,
  Database
} from 'lucide-react';

export default function SettingsPage() {
  const { settings, updateSettings, t, language } = useApp();

  const handleResetDatabase = async () => {
    const confirmReset = window.confirm(
      language === 'en' 
        ? "Are you sure you want to clear all mock data and reset the database to a clean, empty state? This action cannot be undone." 
        : "តើអ្នកប្រាកដជាចង់លុបទិន្នន័យគំរូទាំងអស់ ហើយកំណត់មូលដ្ឋានទិន្នន័យទៅជាសភាពទទេរស្អាតមែនទេ? សកម្មភាពនេះមិនអាចត្រឡប់ក្រោយបានទេ។"
    );
    if (!confirmReset) return;

    try {
      const cleanState = {
        vehicles: [],
        rentals: [],
        expenses: [],
        drivers: [],
        settings: {
          businessName: settings.businessName || "SOMA Car Rentals",
          currency: settings.currency || "$",
          staffNames: settings.staffNames.length > 0 ? settings.staffNames : ["Sokmean"]
        },
        currentStaff: settings.staffNames[0] || "Sokmean",
        language: language || "en"
      };

      const res = await fetch('/api/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanState),
      });

      if (res.ok) {
        localStorage.clear();
        alert(language === 'en' ? "Database successfully reset!" : "មូលដ្ឋានទិន្នន័យត្រូវបានកំណត់ឡើងវិញដោយជោគជ័យ!");
        window.location.reload();
      } else {
        alert("Reset failed: " + res.statusText);
      }
    } catch (err) {
      console.error("Error resetting database:", err);
      alert("Failed to reset database: " + err);
    }
  };

  // Local Form state
  const [businessName, setBusinessName] = useState(settings.businessName);
  const [currency, setCurrency] = useState(settings.currency);
  const [staffNames, setStaffNames] = useState<string[]>(settings.staffNames);
  
  // New Staff Input state
  const [newStaffName, setNewStaffName] = useState('');

  // Submit Business Settings
  const handleSaveBusiness = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      businessName,
      currency,
      staffNames
    });
  };

  // Add staff
  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName.trim()) return;
    if (staffNames.includes(newStaffName.trim())) {
      alert("Staff member already exists!");
      return;
    }
    const updated = [...staffNames, newStaffName.trim()];
    setStaffNames(updated);
    setNewStaffName('');

    // Auto-save settings
    updateSettings({
      businessName,
      currency,
      staffNames: updated
    });
  };

  // Delete staff
  const handleDeleteStaff = (nameToRemove: string) => {
    if (staffNames.length <= 1) {
      alert(
        language === 'en' 
          ? "You must retain at least one staff member to register transactions." 
          : "អ្នកត្រូវតែរក្សាទុកបុគ្គលិកយ៉ាងហោចណាស់ម្នាក់ ដើម្បីចុះឈ្មោះប្រតិបត្តិការ។"
      );
      return;
    }

    const confirmDelete = window.confirm(
      language === 'en'
        ? `Are you sure you want to delete "${nameToRemove}" from the staff directory?`
        : `តើអ្នកប្រាកដជាចង់លុប "${nameToRemove}" ចេញពីបញ្ជីបុគ្គលិកមែនទេ?`
    );
    if (!confirmDelete) return;

    const updated = staffNames.filter(name => name !== nameToRemove);
    setStaffNames(updated);

    // Auto-save settings
    updateSettings({
      businessName,
      currency,
      staffNames: updated
    });
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">{t('settings')}</h1>
        <p className="text-xs text-gray-500">{t('configureBusiness')}</p>
      </div>

      {/* Main Settings Form Panels */}
      <div className="space-y-6 font-medium">
        
        {/* PANEL: Business details */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs">
          <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
            <Building className="h-4.5 w-4.5 text-gray-500" />
            <span className="text-xs font-bold text-gray-900">{t('businessProfile')}</span>
          </div>
          
          <form onSubmit={handleSaveBusiness} className="p-5 space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-gray-700">{t('businessDisplayName')}</label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-gray-700">{t('currencySymbol')}</label>
                <input
                  type="text"
                  required
                  maxLength={3}
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  placeholder="e.g. $, €, KHR"
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black font-semibold"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-xs transition-all"
              >
                {t('saveProfile')}
              </button>
            </div>
          </form>
        </div>

        {/* PANEL: Staff Management */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs">
          <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
            <UserCheck className="h-4.5 w-4.5 text-gray-500" />
            <span className="text-xs font-bold text-gray-900">{t('authorizedStaffDirectory')}</span>
          </div>

          <div className="p-5 space-y-4 text-xs">
            {/* Staff list */}
            <div className="divide-y divide-gray-100 border border-gray-200 rounded-lg overflow-hidden">
              {staffNames.map(name => (
                <div key={name} className="px-4 py-2.5 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                  <span className="font-semibold text-gray-700">{name}</span>
                  <button
                    onClick={() => handleDeleteStaff(name)}
                    className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                    title={t('confirmDelete')}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add new staff inline form */}
            <form onSubmit={handleAddStaff} className="flex gap-2 pt-2">
              <input
                type="text"
                required
                placeholder={t('enterEmployeeName')}
                value={newStaffName}
                onChange={(e) => setNewStaffName(e.target.value)}
                className="flex-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
              />
              <button
                type="submit"
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-xs transition-all shrink-0"
              >
                <Plus className="h-3.5 w-3.5" />
                {t('addStaff')}
              </button>
            </form>
          </div>
        </div>

        {/* PANEL: Reset to Real Data */}
        <div className="bg-white dark:bg-zinc-950 border border-red-200 dark:border-red-950/30 rounded-xl overflow-hidden shadow-xs">
          <div className="px-5 py-4 border-b border-red-100 dark:border-red-950/20 bg-red-50/10 dark:bg-red-950/5 flex items-center gap-2">
            <Database className="h-4.5 w-4.5 text-red-500" />
            <span className="text-xs font-bold text-red-700 dark:text-red-400">
              {language === 'en' ? 'Reset Database (Use Real Data)' : 'កំណត់មូលដ្ឋានទិន្នន័យឡើងវិញ (ប្រើប្រាស់ទិន្នន័យពិត)'}
            </span>
          </div>

          <div className="p-5 space-y-3 text-xs">
            <p className="text-gray-500 dark:text-zinc-400 font-medium">
              {language === 'en' 
                ? "This utility resets the system database, clearing all preset mock vehicles, rentals, and expenses. Proceed only if you want to start with a blank database to input real company data." 
                : "ឧបករណ៍នេះកំណត់មូលដ្ឋានទិន្នន័យឡើងវិញ ដោយលុបយានយន្ត ជួល និងចំណាយគំរូទាំងអស់។ បន្តសកម្មភាពនេះ លុះត្រាតែអ្នកចង់ចាប់ផ្តើមជាមួយមូលដ្ឋានទិន្នន័យទទេរស្អាត ដើម្បីបញ្ចូលទិន្នន័យពិតប្រាកដរបស់ក្រុមហ៊ុន។"}
            </p>
            <div className="pt-2">
              <button
                onClick={handleResetDatabase}
                className="px-4 py-2 bg-red-605 hover:bg-red-700 text-white font-bold rounded-lg shadow-sm transition-all hover:scale-[1.01]"
              >
                {language === 'en' ? 'Clear Mock Data & Reset to Empty' : 'លុបទិន្នន័យគំរូ និង កំណត់ឡើងវិញទៅជាទទេ'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
