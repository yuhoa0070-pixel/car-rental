"use client";

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building,
  UserCheck,
  Plus,
  Trash2
} from 'lucide-react';

export default function SettingsPage() {
  const { settings, updateSettings, t } = useApp();

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
      alert("You must retain at least one staff member to register transactions.");
      return;
    }
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
      </div>
    </div>
  );
}
