"use client";

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Driver } from '../../types';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  X, 
  User,
  Phone,
  DollarSign,
  AlertTriangle
} from 'lucide-react';

export default function DriversPage() {
  const { 
    drivers, 
    settings, 
    addDriver, 
    editDriver, 
    deleteDriver, 
    t, 
    language 
  } = useApp();

  // Search/Filters state
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [dailyRate, setDailyRate] = useState(15);
  const [status, setStatus] = useState<Driver['status']>('Available');
  const [telegram, setTelegram] = useState('');

  // Helpers to open modals
  const handleOpenAdd = () => {
    setName('');
    setPhone('');
    setDailyRate(15);
    setStatus('Available');
    setTelegram('');
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (driver: Driver) => {
    setSelectedDriver(driver);
    setName(driver.name);
    setPhone(driver.phone);
    setDailyRate(driver.dailyRate);
    setStatus(driver.status);
    setTelegram(driver.telegram || '');
    setIsEditModalOpen(true);
  };

  const handleOpenDelete = (driver: Driver) => {
    setSelectedDriver(driver);
    setIsDeleteConfirmOpen(true);
  };

  // Submit Actions
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || dailyRate <= 0) return;
    
    addDriver({
      name,
      phone,
      dailyRate,
      status,
      telegram: telegram.trim() || undefined
    });
    setIsAddModalOpen(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDriver || !name || !phone || dailyRate <= 0) return;
    
    editDriver(selectedDriver.id, {
      name,
      phone,
      dailyRate,
      status,
      telegram: telegram.trim() || undefined
    });
    setIsEditModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (!selectedDriver) return;
    deleteDriver(selectedDriver.id);
    setIsDeleteConfirmOpen(false);
  };

  // Filter list
  const filteredDrivers = drivers.filter(d => {
    const q = searchQuery.toLowerCase();
    return d.name.toLowerCase().includes(q) || d.phone.includes(q);
  });

  const formatCurrency = (amount: number) => {
    return `${settings.currency}${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">{t('drivers')}</h1>
          <p className="text-xs text-gray-500">{t('noDriversDesc')}</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-4 py-2 glass-btn-primary rounded-full text-xs font-bold transition-all"
        >
          <Plus className="h-3.5 w-3.5" />
          {t('addDriver')}
        </button>
      </div>

      {/* Search and Filter bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>
      </div>

      {/* Drivers Data Table */}
      {filteredDrivers.length > 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-6 py-3">{t('driverName')}</th>
                  <th className="px-6 py-3">{t('driverPhone')}</th>
                  <th className="px-6 py-3">{t('driverDailyRate')}</th>
                  <th className="px-6 py-3">{t('driverStatus')}</th>
                  <th className="px-6 py-3 text-right">{t('actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {filteredDrivers.map((d) => (
                  <tr key={d.id} className="hover:bg-neutral-50/50 transition-colors">
                    {/* Name */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-700">
                          {d.name.charAt(0)}
                        </div>
                        <span className="font-semibold text-gray-900">{d.name}</span>
                      </div>
                    </td>

                    {/* Phone & Telegram */}
                    <td className="px-6 py-4 text-gray-700">
                      <div className="space-y-1">
                        <span className="flex items-center gap-1.5 font-semibold">
                          <Phone className="h-3.5 w-3.5 text-gray-400" />
                          {d.phone}
                        </span>
                        {d.telegram && (
                          <a
                            href={`https://t.me/${d.telegram.replace('@', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] text-blue-600 hover:text-blue-800 hover:underline font-bold bg-blue-50/50 hover:bg-blue-50 border border-blue-100/50 rounded px-1.5 py-0.5"
                          >
                            <svg className="h-3 w-3 fill-current text-blue-500" viewBox="0 0 24 24">
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.11.02-1.89 1.2-5.33 3.52-.5.35-.96.52-1.37.51-.45-.01-1.32-.26-1.97-.47-.79-.26-1.42-.4-1.37-.84.03-.23.35-.46.97-.71 3.79-1.65 6.32-2.74 7.57-3.27 3.6-1.5 4.35-1.76 4.84-1.77.11 0 .35.03.5.16.13.12.17.27.18.38 0 .08-.01.25-.02.32z"/>
                            </svg>
                            @{d.telegram.replace('@', '')}
                          </a>
                        )}
                      </div>
                    </td>

                    {/* Daily Rate */}
                    <td className="px-6 py-4 text-gray-900 font-bold">
                      {formatCurrency(d.dailyRate)}/{language === 'en' ? 'day' : 'ថ្ងៃ'}
                    </td>

                    {/* Status badge */}
                    <td className="px-6 py-4">
                      <span className={`text-[9px] font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider border ${
                        d.status === 'Available' ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50' :
                        d.status === 'Assigned' ? 'bg-blue-50 text-blue-700 border-blue-200/50' :
                        'bg-gray-50 text-gray-500 border-gray-200'
                      }`}>
                        {t(d.status.toLowerCase() as any)}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right whitespace-nowrap space-x-1">
                      <button
                        onClick={() => handleOpenEdit(d)}
                        className="inline-flex items-center p-1.5 border border-gray-200 hover:bg-gray-50 text-gray-500 hover:text-gray-900 rounded-lg shadow-2xs transition-colors"
                        title={t('editVehicle')}
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleOpenDelete(d)}
                        className="inline-flex items-center p-1.5 border border-transparent hover:border-red-100 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
                        title={t('confirmDelete')}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center shadow-xs">
          <div className="inline-flex p-3 bg-gray-50 border border-gray-100 text-gray-400 rounded-xl mb-4">
            <User className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-bold text-gray-900">{t('noDriversRegistered')}</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
            {searchQuery 
              ? t('noRentalsDescSearch')
              : t('noDriversDesc')
            }
          </p>
          {!searchQuery && (
            <button
              onClick={handleOpenAdd}
              className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium shadow-sm transition-all"
            >
              <Plus className="h-3.5 w-3.5" />
              {t('addFirstDriver')}
            </button>
          )}
        </div>
      )}

      {/* Modal: Add Driver */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-gray-900/30 backdrop-blur-xs" onClick={() => setIsAddModalOpen(false)} />
          
          <div className="bg-white border border-gray-200 rounded-xl shadow-lg max-w-md w-full overflow-hidden relative z-10 text-xs font-medium">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <span className="text-xs font-bold text-gray-900">{t('addDriver')}</span>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-750 p-1">
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <form onSubmit={handleAddSubmit} className="p-5 space-y-4">
              <div className="space-y-1">
                <label className="font-semibold text-gray-700">{t('driverName')}</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sophea Sok"
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-700">{t('driverPhone')}</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 012-345-678"
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-700">{t('driverTelegram')}</label>
                <input
                  type="text"
                  value={telegram}
                  onChange={(e) => setTelegram(e.target.value)}
                  placeholder="e.g. soksophea"
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-gray-700">{t('driverDailyRate')} ({settings.currency})</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={dailyRate}
                    onChange={(e) => setDailyRate(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-gray-700">{t('driverStatus')}</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                  >
                    <option value="Available">{t('available')}</option>
                    <option value="Assigned">{t('assigned')}</option>
                    <option value="Off-duty">{t('offDuty')}</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-lg"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
                >
                  {t('saveDriver')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Driver */}
      {isEditModalOpen && selectedDriver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-gray-900/30 backdrop-blur-xs" onClick={() => setIsEditModalOpen(false)} />
          
          <div className="bg-white border border-gray-200 rounded-xl shadow-lg max-w-md w-full overflow-hidden relative z-10 text-xs font-medium">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <span className="text-xs font-bold text-gray-900">{t('editVehicle')}: {selectedDriver.name}</span>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-750 p-1">
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="p-5 space-y-4">
              <div className="space-y-1">
                <label className="font-semibold text-gray-700">{t('driverName')}</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-700">{t('driverPhone')}</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-700">{t('driverTelegram')}</label>
                <input
                  type="text"
                  value={telegram}
                  onChange={(e) => setTelegram(e.target.value)}
                  placeholder="e.g. soksophea"
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-gray-700">{t('driverDailyRate')} ({settings.currency})</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={dailyRate}
                    onChange={(e) => setDailyRate(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-gray-700">{t('driverStatus')}</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                  >
                    <option value="Available">{t('available')}</option>
                    <option value="Assigned">{t('assigned')}</option>
                    <option value="Off-duty">{t('offDuty')}</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-3 py-1.5 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-lg"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
                >
                  {t('saveChanges')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal: Delete */}
      {isDeleteConfirmOpen && selectedDriver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-gray-900/30 backdrop-blur-xs" onClick={() => setIsDeleteConfirmOpen(false)} />
          
          <div className="bg-white border border-gray-200 rounded-xl shadow-lg max-w-sm w-full overflow-hidden relative z-10 text-xs font-semibold">
            <div className="p-5 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 border border-red-100 text-red-600 mb-4">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-bold text-gray-900">{t('deleteDriverTitle')}</h3>
              <p className="text-gray-500 mt-2">
                {t('deleteDriverDesc', { name: selectedDriver.name })}
              </p>
            </div>
            
            <div className="px-5 py-3.5 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="px-3 py-1.5 border border-gray-200 bg-white hover:bg-gray-50 text-gray-750 font-semibold rounded-lg"
              >
                {t('cancel')}
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg"
              >
                {t('confirmDelete')}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
