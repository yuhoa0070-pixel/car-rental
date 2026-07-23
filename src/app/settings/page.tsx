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
  const { settings, updateSettings, t, language } = useApp();

  // Local Form state
  const [businessName, setBusinessName] = useState(settings.businessName);
  const [currency, setCurrency] = useState(settings.currency);
  const [staffNames, setStaffNames] = useState<string[]>(settings.staffNames);
  
  // New Staff Input state
  const [newStaffName, setNewStaffName] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

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
                    onClick={() => {
                      if (staffNames.length <= 1) {
                        alert(
                          language === 'en' 
                            ? "You must retain at least one staff member to register transactions." 
                            : "អ្នកត្រូវតែរក្សាទុកបុគ្គលិកយ៉ាងហោចណាស់ម្នាក់ ដើម្បីចុះឈ្មោះប្រតិបត្តិការ។"
                        );
                        return;
                      }
                      setDeleteTarget(name);
                    }}
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

      {/* Custom Confirmation Modal (iPhone Glassmorphism Style) */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/45 dark:bg-black/60 backdrop-blur-xs transition-opacity" onClick={() => setDeleteTarget(null)} />
          <div className="relative glass-card rounded-3xl shadow-2xl max-w-sm w-full p-6 text-xs text-center animate-in fade-in zoom-in-95 duration-150">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-400 mb-4 border border-red-500/20">
              <Trash2 className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-zinc-100 mb-2">
              {language === 'en' ? 'Confirm Deletion' : 'បញ្ជាក់ការលុប'}
            </h3>
            <p className="text-gray-500 dark:text-zinc-400 font-medium leading-relaxed mb-6 px-2">
              {language === 'en'
                ? `Are you sure you want to delete "${deleteTarget}" from the staff directory?`
                : `តើអ្នកប្រាកដជាចង់លុប "${deleteTarget}" ចេញពីបញ្ជីបុគ្គលិកមែនទេ?`}
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-5 py-2.5 glass-btn-secondary rounded-full font-bold shadow-xs"
              >
                {language === 'en' ? 'Cancel' : 'បោះបង់'}
              </button>
              <button
                onClick={() => {
                  const updated = staffNames.filter(name => name !== deleteTarget);
                  setStaffNames(updated);
                  updateSettings({
                    businessName,
                    currency,
                    staffNames: updated
                  });
                  setDeleteTarget(null);
                }}
                className="px-5 py-2.5 glass-btn-danger rounded-full font-bold shadow-sm"
              >
                {language === 'en' ? 'Confirm' : 'យល់ព្រម'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
