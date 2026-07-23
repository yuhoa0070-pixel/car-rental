"use client";

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Vehicle } from '../../types';
import { 
  Car, 
  Plus, 
  Trash2, 
  Edit3, 
  Gauge, 
  Fuel, 
  Calendar, 
  History, 
  X, 
  Info,
  DollarSign,
  AlertTriangle,
  FileText,
  Users
} from 'lucide-react';

import { VehicleVisual } from '../../components/VehicleVisual';

export default function VehiclesPage() {
  const { 
    vehicles, 
    rentals, 
    expenses, 
    settings, 
    addVehicle, 
    editVehicle, 
    deleteVehicle,
    t,
    language
  } = useApp();

  // Dialog & Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  // Form Fields
  const [carName, setCarName] = useState('');
  const [plateNumber, setPlateNumber] = useState('');
  const [photo, setPhoto] = useState('');
  const [status, setStatus] = useState<'Available' | 'Rented' | 'Maintenance'>('Available');
  const [currentMileage, setCurrentMileage] = useState<number>(0);
  const [fuelPercentage, setFuelPercentage] = useState<number>(100);
  const [seats, setSeats] = useState<string>('Family Car');
  const [dailyRentalPrice, setDailyRentalPrice] = useState<number>(50);
  const [lastServiceDate, setLastServiceDate] = useState('');

  // Handle client-side image upload and compression (Max width 500px, 0.7 quality JPG)
  const handleImageUpload = (file: File, callback: (base64: string) => void) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 500;
        const MAX_HEIGHT = 350;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
          callback(compressedDataUrl);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Open modals with pre-population
  const handleOpenAdd = () => {
    setCarName('');
    setPlateNumber('');
    setPhoto('');
    setStatus('Available');
    setCurrentMileage(10000);
    setFuelPercentage(100);
    setSeats('Family Car');
    setDailyRentalPrice(45);
    setLastServiceDate(new Date().toISOString().split('T')[0]);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (v: Vehicle) => {
    setSelectedVehicle(v);
    setCarName(v.carName);
    setPlateNumber(v.plateNumber);
    setPhoto(v.photo);
    setStatus(v.status);
    setCurrentMileage(v.currentMileage);
    setFuelPercentage(v.fuelPercentage);
    setSeats(v.seats || 'Family Car');
    setDailyRentalPrice(v.dailyRentalPrice);
    setLastServiceDate(v.lastServiceDate);
    setIsEditModalOpen(true);
  };

  const handleOpenHistory = (v: Vehicle) => {
    setSelectedVehicle(v);
    setIsHistoryDrawerOpen(true);
  };

  const handleOpenDelete = (v: Vehicle) => {
    setSelectedVehicle(v);
    setIsDeleteConfirmOpen(true);
  };

  // Submit Actions
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!carName || !plateNumber) return;
    addVehicle({
      carName,
      plateNumber,
      photo,
      status,
      currentMileage,
      fuelPercentage,
      seats,
      dailyRentalPrice,
      lastServiceDate
    });
    setIsAddModalOpen(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVehicle || !carName || !plateNumber) return;
    editVehicle(selectedVehicle.id, {
      carName,
      plateNumber,
      photo,
      status,
      currentMileage,
      fuelPercentage,
      seats,
      dailyRentalPrice,
      lastServiceDate
    });
    setIsEditModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (!selectedVehicle) return;
    deleteVehicle(selectedVehicle.id);
    setIsDeleteConfirmOpen(false);
    setIsHistoryDrawerOpen(false);
  };

  // Fetch histories for selected vehicle
  const getVehicleRentals = (vehicleId: string) => {
    return rentals.filter(r => r.vehicleId === vehicleId);
  };

  const getVehicleExpenses = (vehicleId: string) => {
    return expenses.filter(e => e.vehicleId === vehicleId);
  };

  const formatCurrency = (amount: number) => {
    return `${settings.currency}${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  };

  // Translate categories
  const translateCategory = (cat: string) => {
    if (cat === 'sedan') return t('sedan');
    if (cat === 'suv') return t('suv');
    if (cat === 'sports') return t('sportsCar');
    if (cat === 'electric') return t('electricEV');
    return cat;
  };

  // Helper to translate expense types
  const translateExpenseType = (type: string) => {
    if (language === 'km') {
      if (type === 'Gasoline') return 'ប្រេងសាំង';
      if (type === 'Repair') return 'ការជួសជុល';
      if (type === 'Insurance') return 'ធានារ៉ាប់រង';
      if (type === 'Car Wash') return 'លាងឡាន';
      if (type === 'Oil Change') return 'ប្តូរប្រេងម៉ាស៊ីន';
      return 'ផ្សេងៗ';
    }
    return type;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">{t('vehicles')}</h1>
          <p className="text-xs text-gray-500">{t('addMonitorFleet')}</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-1.5 px-4 py-2 glass-btn-primary rounded-full text-xs font-bold transition-all w-fit sm:w-auto shrink-0"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>{t('addVehicle')}</span>
        </button>
      </div>

      {/* Fleet Grid */}
      {vehicles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {vehicles.map((v) => {
            const vehicleRentals = getVehicleRentals(v.id);
            const activeContract = vehicleRentals.find(r => r.status === 'Active');
            
            return (
              <div 
                key={v.id} 
                className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs flex flex-col justify-between"
              >
                {/* Visual Header */}
                <div className="bg-neutral-50 h-32 flex items-center justify-center border-b border-gray-100 relative group">
                  <div className="absolute inset-0 bg-linear-to-b from-transparent to-neutral-100/50" />
                  <VehicleVisual type={v.photo} className="h-16 w-20 relative z-10 drop-shadow-xs" />
                  
                  {/* Status Tag */}
                  <span className={`absolute top-3 left-3 text-[9px] font-semibold px-2 py-0.5 rounded-full border ${
                    v.status === 'Available' ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50' :
                    v.status === 'Rented' ? 'bg-blue-50 text-blue-700 border-blue-200/50' :
                    'bg-amber-50 text-amber-700 border-amber-200/50'
                  }`}>
                    {t(v.status.toLowerCase() as any)}
                  </span>

                  {/* Quick Edit button */}
                  <button 
                    onClick={() => handleOpenEdit(v)}
                    className="absolute top-3 right-3 p-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-500 hover:text-gray-900 rounded-lg shadow-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    title={t('editVehicle')}
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Details */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-1">
                      <h3 className="font-semibold text-xs text-gray-900 truncate">{v.carName}</h3>
                      <span className="text-[10px] font-bold text-gray-900 shrink-0">{formatCurrency(v.dailyRentalPrice)}/{language === 'en' ? 'd' : 'ថ្ងៃ'}</span>
                    </div>
                    <p className="text-[10px] text-gray-400 font-mono mt-0.5">{v.plateNumber}</p>
                    
                    {/* Active renter helper if rented */}
                    {v.status === 'Rented' && activeContract && (
                      <p className="text-[9px] text-blue-600 bg-blue-50/50 border border-blue-100 rounded-md p-1 mt-2">
                        {t('rentals')}: {activeContract.customerName}
                      </p>
                    )}

                    {/* Stats List */}
                    <div className="mt-4 grid grid-cols-3 gap-2 text-[10px] text-gray-500 border-t border-gray-100 pt-3 font-semibold">
                      <div className="flex items-center gap-1 shrink-0" title={t('mileage')}>
                        <Car className="h-3.5 w-3.5 text-gray-400" />
                        <span>{v.currentMileage.toLocaleString()} km</span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0" title={t('fuelLevel')}>
                        <Fuel className="h-3.5 w-3.5 text-gray-400" />
                        <span>{v.fuelPercentage}%</span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0" title={t('seats')}>
                        <Users className="h-3.5 w-3.5 text-gray-400" />
                        <span>
                          {v.seats === 'Family Car' ? (language === 'en' ? 'Family Car' : 'ឡានគ្រួសារ') :
                           v.seats === 'Van' ? (language === 'en' ? 'Hiace/Van' : 'វែន/Hiace') :
                           v.seats === 'Bus' ? (language === 'en' ? 'Bus' : 'ឡានក្រុង') :
                           (v.seats || (language === 'en' ? 'Family Car' : 'ឡានគ្រួសារ'))}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleOpenHistory(v)}
                      className="flex-1 flex items-center justify-center gap-1 px-2.5 py-1.5 border border-gray-200 hover:bg-gray-50 text-[10px] font-semibold text-gray-700 rounded-lg transition-all"
                    >
                      <History className="h-3 w-3" />
                      {t('viewLog')}
                    </button>
                    <button
                      onClick={() => handleOpenDelete(v)}
                      className="p-1.5 border border-transparent hover:border-red-100 hover:bg-red-50 text-red-500 hover:text-red-700 rounded-lg transition-all"
                      title={t('confirmDelete')}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center shadow-xs">
          <div className="inline-flex p-3 bg-gray-50 border border-gray-100 text-gray-400 rounded-xl mb-4">
            <Car className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-bold text-gray-900">{t('noVehiclesRegistered')}</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
            {t('noVehiclesDesc')}
          </p>
          <button
            onClick={handleOpenAdd}
            className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium shadow-sm transition-all"
          >
            <Plus className="h-3.5 w-3.5" />
            {t('addFirstVehicle')}
          </button>
        </div>
      )}

      {/* Modal: Add Vehicle */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-gray-900/30 backdrop-blur-xs" onClick={() => setIsAddModalOpen(false)} />
          
          <div className="bg-white border border-gray-200 rounded-xl shadow-lg max-w-md w-full overflow-hidden relative z-10">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <span className="text-xs font-bold text-gray-900">{t('addVehicle')}</span>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-750 p-1">
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <form onSubmit={handleAddSubmit} className="p-5 space-y-4 text-xs font-medium">
              {/* Full Width Vehicle Photo */}
              <div className="space-y-1">
                <label className="font-semibold text-gray-700">{t('vehiclePhotoUrl')}</label>
                
                {/* Large Dropzone & Preview */}
                <div className="border border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center bg-gray-50/50 hover:bg-gray-50 transition-colors relative cursor-pointer group min-h-[140px] w-full">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleImageUpload(file, (base64) => {
                          setPhoto(base64);
                        });
                      }
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer z-20"
                  />
                  {photo && (photo.startsWith('http') || photo.startsWith('data:')) ? (
                    <div className="w-full text-center z-10 relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={photo} alt="Preview" className="h-32 w-full object-cover rounded-lg border border-gray-200" />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPhoto('');
                        }}
                        className="absolute top-2 left-2 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-full z-30 transition-colors shadow-md"
                        title={language === 'en' ? 'Remove Photo' : 'លុបរូបភាព'}
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center space-y-2 text-gray-400 group-hover:text-gray-600 transition-colors">
                      <Plus className="h-5 w-5 mx-auto" />
                      <p className="text-xs font-semibold">
                        {language === 'en' ? 'Click or drag photo here to upload' : 'ចុច ឬអូសរូបថតមកទីនេះដើម្បីបង្ហោះ'}
                      </p>
                      <p className="text-[9px] text-gray-400">PNG, JPG, JPEG (Max 5MB)</p>
                    </div>
                  )}
                </div>

                <div className="mt-2">
                  <input
                    type="text"
                    value={photo && !photo.startsWith('data:') ? photo : ''}
                    onChange={(e) => setPhoto(e.target.value)}
                    placeholder="Or paste web image URL"
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black text-[10px]"
                  />
                </div>
              </div>

              {/* Car Name - Full Width */}
              <div className="space-y-1">
                <label className="font-semibold text-gray-700">{t('carName')}</label>
                <input
                  type="text"
                  required
                  value={carName}
                  onChange={(e) => setCarName(e.target.value)}
                  placeholder="e.g. Toyota Camry Hybrid"
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              {/* Two-Column Grid details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-gray-700">{t('plateNumber')}</label>
                  <input
                    type="text"
                    required
                    value={plateNumber}
                    onChange={(e) => setPlateNumber(e.target.value)}
                    placeholder="e.g. 2AB-1234"
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-gray-700">{t('dailyPrice')} ({settings.currency})</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={dailyRentalPrice}
                    onChange={(e) => setDailyRentalPrice(parseInt(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-gray-700">{t('mileage')}</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={currentMileage}
                    onChange={(e) => setCurrentMileage(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-gray-700">{t('fuelLevel')}</label>
                  <input
                    type="number"
                    required
                    min="0"
                    max="100"
                    value={fuelPercentage}
                    onChange={(e) => setFuelPercentage(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-gray-700">{t('seats')}</label>
                  <select
                    value={seats}
                    onChange={(e) => setSeats(e.target.value)}
                    className="w-full pl-3 pr-10 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black font-semibold text-gray-900"
                  >
                    <option value="Family Car">{language === 'en' ? 'Family Car (1-7 people)' : 'ឡានគ្រួសារ (១-៧ កៅអី)'}</option>
                    <option value="Van">{language === 'en' ? 'Hiace / Van (8-24 people)' : 'ឡានវែន/Hiace (៨-២៤ កៅអី)'}</option>
                    <option value="Bus">{language === 'en' ? 'Bus (25-45 people)' : 'ឡានក្រុង (២៥-៤៥ កៅអី)'}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-gray-700">{t('currentStatus')}</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full pl-3 pr-10 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                  >
                    <option value="Available">{t('available')}</option>
                    <option value="Rented">{t('rented')}</option>
                    <option value="Maintenance">{t('maintenance')}</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-gray-700">{t('lastServiceDate')}</label>
                  <input
                    type="date"
                    required
                    value={lastServiceDate}
                    onChange={(e) => setLastServiceDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                  />
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
                  {t('saveVehicle')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Vehicle */}
      {isEditModalOpen && selectedVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-gray-900/30 backdrop-blur-xs" onClick={() => setIsEditModalOpen(false)} />
          
          <div className="bg-white border border-gray-200 rounded-xl shadow-lg max-w-md w-full overflow-hidden relative z-10">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <span className="text-xs font-bold text-gray-900">{t('editVehicle')}: {selectedVehicle.carName}</span>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-750 p-1">
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="p-5 space-y-4 text-xs font-medium">
              {/* Full Width Vehicle Photo */}
              <div className="space-y-1">
                <label className="font-semibold text-gray-700">{t('vehiclePhotoUrl')}</label>
                
                {/* Large Dropzone & Preview */}
                <div className="border border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center bg-gray-50/50 hover:bg-gray-50 transition-colors relative cursor-pointer group min-h-[140px] w-full">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleImageUpload(file, (base64) => {
                          setPhoto(base64);
                        });
                      }
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer z-20"
                  />
                  {photo && (photo.startsWith('http') || photo.startsWith('data:')) ? (
                    <div className="w-full text-center z-10 relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={photo} alt="Preview" className="h-32 w-full object-cover rounded-lg border border-gray-200" />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPhoto('');
                        }}
                        className="absolute top-2 left-2 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-full z-30 transition-colors shadow-md"
                        title={language === 'en' ? 'Remove Photo' : 'លុបរូបភាព'}
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center space-y-2 text-gray-400 group-hover:text-gray-600 transition-colors">
                      <Plus className="h-5 w-5 mx-auto" />
                      <p className="text-xs font-semibold">
                        {language === 'en' ? 'Click or drag photo here to upload' : 'ចុច ឬអូសរូបថតមកទីនេះដើម្បីបង្ហោះ'}
                      </p>
                      <p className="text-[9px] text-gray-400">PNG, JPG, JPEG (Max 5MB)</p>
                    </div>
                  )}
                </div>

                <div className="mt-2">
                  <input
                    type="text"
                    value={photo && !photo.startsWith('data:') ? photo : ''}
                    onChange={(e) => setPhoto(e.target.value)}
                    placeholder="Or paste web image URL"
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black text-[10px]"
                  />
                </div>
              </div>

              {/* Car Name - Full Width */}
              <div className="space-y-1">
                <label className="font-semibold text-gray-700">{t('carName')}</label>
                <input
                  type="text"
                  required
                  value={carName}
                  onChange={(e) => setCarName(e.target.value)}
                  placeholder="e.g. Toyota Camry Hybrid"
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              {/* Two-Column Grid details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-gray-700">{t('plateNumber')}</label>
                  <input
                    type="text"
                    required
                    value={plateNumber}
                    onChange={(e) => setPlateNumber(e.target.value)}
                    placeholder="e.g. 2AB-1234"
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-gray-700">{t('dailyPrice')} ({settings.currency})</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={dailyRentalPrice}
                    onChange={(e) => setDailyRentalPrice(parseInt(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-gray-700">{t('mileage')}</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={currentMileage}
                    onChange={(e) => setCurrentMileage(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-gray-700">{t('fuelLevel')}</label>
                  <input
                    type="number"
                    required
                    min="0"
                    max="100"
                    value={fuelPercentage}
                    onChange={(e) => setFuelPercentage(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-gray-700">{t('seats')}</label>
                  <select
                    value={seats}
                    onChange={(e) => setSeats(e.target.value)}
                    className="w-full pl-3 pr-10 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black font-semibold text-gray-900"
                  >
                    <option value="Family Car">{language === 'en' ? 'Family Car (1-7 people)' : 'ឡានគ្រួសារ (១-៧ កៅអី)'}</option>
                    <option value="Van">{language === 'en' ? 'Hiace / Van (8-24 people)' : 'ឡានវែន/Hiace (៨-២៤ កៅអី)'}</option>
                    <option value="Bus">{language === 'en' ? 'Bus (25-45 people)' : 'ឡានក្រុង (២៥-៤៥ កៅអី)'}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-gray-700">{t('currentStatus')}</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full pl-3 pr-10 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                  >
                    <option value="Available">{t('available')}</option>
                    <option value="Rented">{t('rented')}</option>
                    <option value="Maintenance">{t('maintenance')}</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-gray-700">{t('lastServiceDate')}</label>
                  <input
                    type="date"
                    required
                    value={lastServiceDate}
                    onChange={(e) => setLastServiceDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                  />
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

      {/* Drawer / Modal: History Log */}
      {isHistoryDrawerOpen && selectedVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-end">
          {/* Overlay */}
          <div 
            onClick={() => setIsHistoryDrawerOpen(false)}
            className="fixed inset-0 bg-gray-900/30 backdrop-blur-xs transition-opacity" 
          />

          {/* Drawer panel */}
          <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between z-10 transition-transform duration-300 ease-in-out">
            
            {/* Drawer Header */}
            <div className="p-5 border-b border-gray-100 bg-neutral-50 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <History className="h-4.5 w-4.5 text-gray-500" />
                <div>
                  <h2 className="text-xs font-bold text-gray-900 tracking-tight">{selectedVehicle.carName} {t('logsAudit')}</h2>
                  <p className="text-[10px] font-mono text-gray-400">{selectedVehicle.plateNumber} • {t('logsAudit')}</p>
                </div>
              </div>
              <button 
                onClick={() => setIsHistoryDrawerOpen(false)}
                className="text-gray-400 hover:text-gray-750 p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              
              {/* Fleet quick info */}
              <div className="grid grid-cols-3 gap-3 bg-gray-50 border border-gray-100 p-3.5 rounded-xl text-center font-medium">
                <div>
                  <span className="text-[9px] font-semibold text-gray-400 block uppercase">{t('mileage')}</span>
                  <span className="text-xs font-bold text-gray-900">{selectedVehicle.currentMileage.toLocaleString()} mi</span>
                </div>
                <div>
                  <span className="text-[9px] font-semibold text-gray-400 block uppercase">{t('fuelLevel')}</span>
                  <span className="text-xs font-bold text-gray-900">{selectedVehicle.fuelPercentage}%</span>
                </div>
                <div>
                  <span className="text-[9px] font-semibold text-gray-400 block uppercase">{t('lastServiceDate')}</span>
                  <span className="text-xs font-bold text-gray-900">{selectedVehicle.lastServiceDate || 'N/A'}</span>
                </div>
              </div>

              {/* SECTION: Rentals history */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-gray-900 border-b border-gray-100 pb-1.5 flex items-center gap-1.5">
                  <FileText className="h-4 w-4 text-blue-500" /> {t('rentalsAudit')} ({getVehicleRentals(selectedVehicle.id).length})
                </h3>

                <div className="space-y-2">
                  {getVehicleRentals(selectedVehicle.id).length > 0 ? (
                    getVehicleRentals(selectedVehicle.id).map(r => (
                      <div key={r.id} className="p-3 bg-white border border-gray-200 rounded-lg text-[11px] space-y-1.5 shadow-2xs">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-gray-900">{r.customerName}</span>
                          <span className={`text-[9px] px-2 py-0.5 rounded-full font-semibold border ${
                            r.status === 'Active' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-gray-50 text-gray-500 border-gray-200'
                          }`}>
                            {language === 'en' ? r.status : t(r.status.toLowerCase() as any)}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-gray-500 font-medium">
                          <p>{t('phone')}: <span className="text-gray-950 font-semibold">{r.customerPhone}</span></p>
                          <p>{t('loggedBy')}: <span className="text-gray-950 font-semibold">{r.staffName}</span></p>
                          <p>{t('term')}: <span className="text-gray-950 font-semibold">{r.startDate} {language === 'en' ? 'to' : 'ដល់'} {r.returnDate}</span></p>
                          <p>{t('deposit')}: <span className="text-gray-950 font-semibold">{formatCurrency(r.deposit)}</span></p>
                          <p>{t('currentMileageOut')}: <span className="text-gray-950 font-semibold">{r.mileageOut.toLocaleString()} mi</span></p>
                          {r.mileageIn && <p>{t('mileageCheckIn')}: <span className="text-gray-950 font-semibold">{r.mileageIn.toLocaleString()} mi</span></p>}
                        </div>
                        {r.notes && (
                          <div className="text-[10px] bg-gray-50 text-gray-500 p-1.5 rounded-md italic">
                            &quot;{r.notes}&quot;
                          </div>
                        )}
                        {r.status === 'Completed' && (
                          <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                            <span className="font-bold text-gray-700">{t('finalTotal')}:</span>
                            <span className="font-bold text-emerald-600">{formatCurrency(r.finalTotal || 0)}</span>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-[10px] text-gray-400 italic py-2">{t('noLeaseHistory')}</p>
                  )}
                </div>
              </div>

              {/* SECTION: Expenses history */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-gray-900 border-b border-gray-100 pb-1.5 flex items-center gap-1.5">
                  <DollarSign className="h-4 w-4 text-red-500" /> {t('expenseAudit')} ({getVehicleExpenses(selectedVehicle.id).length})
                </h3>

                <div className="space-y-2">
                  {getVehicleExpenses(selectedVehicle.id).length > 0 ? (
                    getVehicleExpenses(selectedVehicle.id).map(e => (
                      <div key={e.id} className="p-3 bg-white border border-gray-200 rounded-lg text-[11px] flex items-start justify-between shadow-2xs">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-gray-900">{translateExpenseType(e.type)}</span>
                            <span className="text-[9px] text-gray-400 font-mono">{e.date}</span>
                          </div>
                          <p className="text-gray-500">{e.note}</p>
                          <p className="text-[9px] text-gray-400">{t('loggedBy')}: {e.staff}</p>
                        </div>
                        <span className="font-bold text-red-600 shrink-0">{formatCurrency(e.amount)}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-[10px] text-gray-400 italic py-2">{t('noExpLogged')}</p>
                  )}
                </div>
              </div>

            </div>

            {/* Drawer Actions */}
            <div className="p-5 border-t border-gray-100 bg-neutral-50 flex items-center gap-3.5 shrink-0">
              <button
                onClick={() => {
                  setIsHistoryDrawerOpen(false);
                  handleOpenEdit(selectedVehicle);
                }}
                className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 border border-gray-200 hover:bg-gray-150 text-xs font-semibold text-gray-700 bg-white rounded-lg transition-all"
              >
                <Edit3 className="h-4 w-4" />
                {t('editVehicle')}
              </button>
              <button
                onClick={() => {
                  setIsHistoryDrawerOpen(false);
                  handleOpenDelete(selectedVehicle);
                }}
                className="p-2 border border-transparent hover:border-red-200 hover:bg-red-50 text-red-500 rounded-lg transition-all"
                title={t('confirmDelete')}
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Confirmation Modal: Delete */}
      {isDeleteConfirmOpen && selectedVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-gray-900/30 backdrop-blur-xs" onClick={() => setIsDeleteConfirmOpen(false)} />
          
          <div className="bg-white border border-gray-200 rounded-xl shadow-lg max-w-sm w-full overflow-hidden relative z-10 text-xs">
            <div className="p-5 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 border border-red-100 text-red-600 mb-4">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-bold text-gray-900">{t('deleteFleetVehicle')}</h3>
              <p className="text-gray-500 mt-2">
                {t('deleteConfirmDesc', { name: selectedVehicle.carName })}
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
