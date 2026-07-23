"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useApp } from '../../context/AppContext';
import { Rental, Vehicle, Driver } from '../../types';
import { 
  Key, 
  Calendar, 
  User, 
  Phone, 
  Search, 
  Check, 
  Plus, 
  X, 
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Info,
  CalendarRange,
  Users,
  Gauge,
  Fuel,
  Car
} from 'lucide-react';

const CAMBODIA_PROVINCES = [
  { en: 'Phnom Penh', km: 'ភ្នំពេញ', defaultPrice: 0 },
  { en: 'Siem Reap', km: 'សៀមរាប', defaultPrice: 50 },
  { en: 'Preah Sihanouk', km: 'ព្រះសីហនុ', defaultPrice: 40 },
  { en: 'Kampot', km: 'កំពត', defaultPrice: 30 },
  { en: 'Kep', km: 'កែប', defaultPrice: 30 },
  { en: 'Battambang', km: 'បាត់ដំបង', defaultPrice: 45 },
  { en: 'Kandal', km: 'កណ្តាល', defaultPrice: 10 },
  { en: 'Kampong Cham', km: 'កំពង់ចាម', defaultPrice: 20 },
  { en: 'Kampong Speu', km: 'កំពង់ស្ពឺ', defaultPrice: 15 },
  { en: 'Koh Kong', km: 'កោះកុង', defaultPrice: 50 },
  { en: 'Mondulkiri', km: 'មណ្ឌលគិរី', defaultPrice: 65 },
  { en: 'Ratanakiri', km: 'រតនគិរី', defaultPrice: 75 },
  { en: 'Pursat', km: 'ពោធិ៍សាត់', defaultPrice: 35 },
  { en: 'Banteay Meanchey', km: 'បន្ទាយមានជ័យ', defaultPrice: 50 },
  { en: 'Kampong Chhnang', km: 'កំពង់ឆ្នាំង', defaultPrice: 20 },
  { en: 'Kampong Thom', km: 'កំពង់ធំ', defaultPrice: 30 },
  { en: 'Kratie', km: 'ក្រចេះ', defaultPrice: 40 },
  { en: 'Prey Veng', km: 'ព្រៃវែង', defaultPrice: 25 },
  { en: 'Svay Rieng', km: 'ស្វាយរៀង', defaultPrice: 35 },
  { en: 'Takeo', km: 'តាកែវ', defaultPrice: 20 },
  { en: 'Oddar Meanchey', km: 'ឧត្តរមានជ័យ', defaultPrice: 60 },
  { en: 'Pailin', km: 'ប៉ៃលិន', defaultPrice: 50 },
  { en: 'Preah Vihear', km: 'ព្រះវិហារ', defaultPrice: 55 },
  { en: 'Stung Treng', km: 'ស្ទឹងត្រែង', defaultPrice: 55 },
  { en: 'Tboung Khmum', km: 'ត្បូងឃ្មុំ', defaultPrice: 30 }
];

function RentalsPageContent() {
  const { 
    rentals, 
    vehicles, 
    settings, 
    startRental, 
    returnRental,
    drivers,
    currentStaff,
    t,
    language
  } = useApp();

  // Tab State
  const [activeTab, setActiveTab] = useState<'Active' | 'Completed'>('Active');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery]);

  // Modals state
  const [isStartModalOpen, setIsStartModalOpen] = useState(false);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  
  const [selectedRental, setSelectedRental] = useState<Rental | null>(null);

  const searchParams = useSearchParams();

  useEffect(() => {
    const rentVal = searchParams.get('rent');
    const returnVal = searchParams.get('return');

    if (rentVal) {
      handleOpenStart(rentVal);
      window.history.replaceState({}, '', window.location.pathname);
    } else if (returnVal) {
      const activeRental = rentals.find(r => r.status === 'Active' && r.vehicleId === returnVal);
      if (activeRental) {
        handleOpenReturn(activeRental);
      }
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [searchParams, rentals, vehicles]);

  // START RENTAL FORM FIELDS
  const [vehicleId, setVehicleId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [startDate, setStartDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [dailyPrice, setDailyPrice] = useState(0);
  const [deposit, setDeposit] = useState(150);
  const [staffName, setStaffName] = useState('');
  const [mileageOut, setMileageOut] = useState(0);
  const [fuelOut, setFuelOut] = useState(100);
  const [destinationProvince, setDestinationProvince] = useState('Phnom Penh');
  const [tripSurcharge, setTripSurcharge] = useState(0);

  const handleProvinceSelect = (provEn: string) => {
    setDestinationProvince(provEn);
    const found = CAMBODIA_PROVINCES.find(p => p.en === provEn);
    if (found) {
      setTripSurcharge(found.defaultPrice);
    }
  };

  const getProvinceLabel = (provEn: string) => {
    const found = CAMBODIA_PROVINCES.find(p => p.en === provEn);
    if (!found) return provEn;
    return language === 'en' ? found.en : found.km;
  };
  const [notes, setNotes] = useState('');
  
  // Driver selection field
  const [driverId, setDriverId] = useState('');

  // RETURN RENTAL FORM FIELDS
  const [mileageIn, setMileageIn] = useState(0);
  const [fuelIn, setFuelIn] = useState(100);
  const [gasolineCost, setGasolineCost] = useState(0);
  const [damageFee, setDamageFee] = useState(0);
  const [cleaningFee, setCleaningFee] = useState(0);
  const [lateFee, setLateFee] = useState(0);
  const [maintenanceNote, setMaintenanceNote] = useState('');
  const [nextStatus, setNextStatus] = useState<'Available' | 'Maintenance'>('Available');

  // Available vehicles for dropdown
  const availableVehicles = vehicles.filter(v => v.status === 'Available');
  // Available drivers
  const availableDrivers = drivers.filter(d => d.status === 'Available');

  // Trigger Start Rental Modal
  const handleOpenStart = (preSelectedVehicleId?: any) => {
    const vId = typeof preSelectedVehicleId === 'string' ? preSelectedVehicleId : undefined;
    // Pick first available vehicle if exists
    if (vId) {
      handleVehicleSelect(vId);
    } else if (availableVehicles.length > 0) {
      handleVehicleSelect(availableVehicles[0].id);
    } else {
      setVehicleId('');
      setDailyPrice(0);
      setMileageOut(0);
      setFuelOut(100);
    }
    
    setCustomerName('');
    setCustomerPhone('');
    setStartDate(new Date().toISOString().split('T')[0]);
    
    // Default 3 days rental
    const threeDaysLater = new Date();
    threeDaysLater.setDate(threeDaysLater.getDate() + 3);
    setReturnDate(threeDaysLater.toISOString().split('T')[0]);
    
    setDeposit(150);
    setStaffName(currentStaff || settings.staffNames[0] || 'Staff');
    setDestinationProvince('Phnom Penh');
    setTripSurcharge(0);
    setNotes('');
    setDriverId(''); // default: No driver
    setIsStartModalOpen(true);
  };

  // Pre-fill fields when vehicle is selected
  const handleVehicleSelect = (vId: string) => {
    setVehicleId(vId);
    const car = vehicles.find(v => v.id === vId);
    if (car) {
      setDailyPrice(car.dailyRentalPrice);
      setMileageOut(car.currentMileage);
      setFuelOut(car.fuelPercentage);
    }
  };

  // Trigger Return Modal
  const handleOpenReturn = (rental: Rental) => {
    const car = vehicles.find(v => v.id === rental.vehicleId);
    setSelectedRental(rental);
    
    // Prefill inputs
    setMileageIn((car?.currentMileage || rental.mileageOut) + 120); // estimate 120 miles driven
    setFuelIn(car?.fuelPercentage || rental.fuelOut);
    setGasolineCost(0);
    setDamageFee(0);
    setCleaningFee(0);
    setLateFee(0);
    setMaintenanceNote('');
    setNextStatus('Available');
    setIsReturnModalOpen(true);
  };

  // Submit Actions
  const handleStartSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleId || !customerName || !customerPhone || !startDate || !returnDate) return;
    
    const selectedDriver = drivers.find(d => d.id === driverId);
    
    startRental({
      vehicleId,
      customerName,
      customerPhone,
      startDate,
      returnDate,
      dailyPrice,
      deposit,
      staffName,
      mileageOut,
      fuelOut,
      notes,
      destinationProvince,
      tripSurcharge,
      driverId: driverId || undefined,
      driverRate: selectedDriver ? selectedDriver.dailyRate : undefined
    });
    setIsStartModalOpen(false);
  };

  const handleReturnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRental) return;
    
    if (mileageIn < selectedRental.mileageOut) {
      alert("Return mileage cannot be less than initial mileage out!");
      return;
    }
    
    returnRental(selectedRental.id, {
      mileageIn,
      fuelIn,
      gasolineCost,
      damageFee,
      cleaningFee,
      lateFee,
      maintenanceNote,
      nextStatus
    });
    setIsReturnModalOpen(false);
  };

  // Calculations for return preview
  const getReturnCalculationDetails = () => {
    if (!selectedRental) return { days: 0, rentCost: 0, driverCost: 0, total: 0 };
    
    const dStart = new Date(selectedRental.startDate);
    const dReturn = new Date(selectedRental.returnDate);
    const timeDiff = Math.max(dReturn.getTime() - dStart.getTime(), 0);
    const days = Math.max(Math.ceil(timeDiff / (1000 * 3600 * 24)), 1);
    
    const rentCost = selectedRental.dailyPrice * days;
    const driverCost = selectedRental.driverRate ? selectedRental.driverRate * days : 0;
    const total = rentCost + driverCost + (selectedRental.tripSurcharge || 0) + gasolineCost + damageFee + cleaningFee + lateFee;
    
    return { days, rentCost, driverCost, total };
  };

  const calcDetails = getReturnCalculationDetails();
  const checkoutDays = startDate && returnDate ? Math.max(Math.ceil((new Date(returnDate).getTime() - new Date(startDate).getTime()) / (1000 * 3600 * 24)), 0) : 0;

  // Filter rentals list
  const filteredRentals = rentals.filter(r => {
    if (r.status !== activeTab) return false;
    
    const query = searchQuery.toLowerCase();
    const carName = vehicles.find(v => v.id === r.vehicleId)?.carName.toLowerCase() || '';
    const customer = r.customerName.toLowerCase();
    const phone = r.customerPhone;
    
    return carName.includes(query) || customer.includes(query) || phone.includes(query);
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredRentals.length / itemsPerPage) || 1;
  const activePage = Math.min(currentPage, totalPages);
  const paginatedRentals = filteredRentals.slice((activePage - 1) * itemsPerPage, activePage * itemsPerPage);

  const formatCurrency = (amount: number) => {
    return `${settings.currency}${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">{t('rentals')}</h1>
          <p className="text-xs text-gray-500">{t('manageLeases')}</p>
        </div>
        <button
          onClick={handleOpenStart}
          disabled={availableVehicles.length === 0}
          className="flex items-center justify-center gap-1.5 px-4 py-2 glass-btn-primary disabled:opacity-50 disabled:cursor-not-allowed rounded-full text-xs font-bold transition-all w-fit sm:w-auto shrink-0"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>{t('createRental')}</span>
        </button>
      </div>

      {/* Warning when no available cars */}
      {availableVehicles.length === 0 && (
        <div className="flex items-start gap-2.5 p-3.5 bg-amber-50 border border-amber-200/50 rounded-xl text-xs text-amber-800">
          <AlertTriangle className="h-4.5 w-4.5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">{t('noAvailableCars')}</span> {t('noAvailableCarsDesc')}
          </div>
        </div>
      )}

      {/* List controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Tabs */}
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('Active')}
            className={`text-xs font-semibold pb-3 transition-all border-b-2 ${
              activeTab === 'Active' ? 'text-gray-900 border-black font-bold' : 'text-gray-400 hover:text-gray-900 border-transparent'
            }`}
          >
            {t('activeContractsTab', { count: rentals.filter(r => r.status === 'Active').length })}
          </button>
          <button
            onClick={() => setActiveTab('Completed')}
            className={`text-xs font-semibold pb-3 transition-all border-b-2 ${
              activeTab === 'Completed' ? 'text-gray-900 border-black font-bold' : 'text-gray-400 hover:text-gray-900 border-transparent'
            }`}
          >
            {t('completedTermsTab', { count: rentals.filter(r => r.status === 'Completed').length })}
          </button>
        </div>

        {/* Search */}
        <div className="relative max-w-xs w-full sm:self-center">
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

      {/* Rentals Table / Grid */}
      {filteredRentals.length > 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-6 py-3">{t('vehicleDetails')}</th>
                  <th className="px-6 py-3">{t('customerInfo')}</th>
                  <th className="px-6 py-3">{t('rentalWindow')}</th>
                  <th className="px-6 py-3">{t('ratesDeposit')}</th>
                  <th className="px-6 py-3">{t('staffNotes')}</th>
                  <th className="px-6 py-3 text-right">{t('actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {paginatedRentals.map((r) => {
                  const car = vehicles.find(v => v.id === r.vehicleId);
                  const driver = drivers.find(d => d.id === r.driverId);
                  
                  return (
                    <tr key={r.id} className="hover:bg-neutral-50/50 transition-colors">
                      {/* Vehicle Column */}
                      <td className="px-6 py-4.5">
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-900">{car?.carName || 'Deleted Car'}</span>
                          <span className="text-[10px] text-gray-400 font-mono mt-0.5">{car?.plateNumber}</span>
                        </div>
                      </td>

                      {/* Customer Column */}
                      <td className="px-6 py-4.5 text-gray-700">
                        <div className="space-y-0.5">
                          <p className="flex items-center gap-1">
                            <User className="h-3 w-3 text-gray-400" /> {r.customerName}
                          </p>
                          <p className="flex items-center gap-1 text-[10px] text-gray-400">
                            <Phone className="h-3 w-3 text-gray-400" /> {r.customerPhone}
                          </p>
                        </div>
                      </td>

                      {/* Window Column */}
                      <td className="px-6 py-4.5 text-gray-700">
                        <div className="space-y-0.5">
                          <p className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5 text-gray-400" /> 
                            <span>{r.startDate} <span className="text-gray-300">→</span> {r.returnDate}</span>
                          </p>
                          <div className="flex flex-wrap gap-1.5 mt-1.5">
                            {r.destinationProvince && (
                              <span className="text-[9px] font-bold bg-neutral-100 text-neutral-600 border border-neutral-200/80 rounded px-1.5 py-0.5 inline-flex items-center gap-0.5 shadow-2xs">
                                📍 {getProvinceLabel(r.destinationProvince)}
                              </span>
                            )}
                            {r.returnedAt && (
                              <span className="text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 rounded px-1.5 py-0.5 inline-block">
                                {language === 'en' ? 'Returned' : 'ប្រគល់មកវិញ'}៖ {r.returnedAt}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Pricing Column */}
                      <td className="px-6 py-4.5">
                        <div className="flex flex-col">
                          <span>{formatCurrency(r.dailyPrice)}/{language === 'en' ? 'day' : 'ថ្ងៃ'}</span>
                          {r.driverRate && (
                            <span className="text-[10px] text-blue-600 font-semibold mt-0.5">
                              +{formatCurrency(r.driverRate)}/d ({language === 'en' ? 'Driver' : 'អ្នកបើកបរ'})
                            </span>
                          )}
                          {r.tripSurcharge && r.tripSurcharge > 0 ? (
                            <span className="text-[10px] text-amber-600 font-bold mt-0.5" title={t('tripSurcharge')}>
                              +{formatCurrency(r.tripSurcharge)} ({t('tripSurcharge')})
                            </span>
                          ) : null}
                          <span className="text-[10px] text-gray-400 mt-0.5">{t('deposit')}: {formatCurrency(r.deposit)}</span>
                        </div>
                      </td>

                      {/* Staff & Notes */}
                      <td className="px-6 py-4.5 text-gray-500 max-w-xs">
                        <p className="text-gray-900 text-[10px]">{t('loggedBy')}: {r.staffName}</p>
                        {driver && (
                          <p className="text-blue-600 text-[10px] font-bold">
                            {t('drivers')}: {driver.name}
                          </p>
                        )}
                        {r.notes && (
                          <p className="truncate text-[10px] text-gray-400 italic mt-0.5" title={r.notes}>
                            &quot;{r.notes}&quot;
                          </p>
                        )}
                      </td>

                      {/* Return Actions */}
                      <td className="px-6 py-4.5 text-right whitespace-nowrap">
                        {r.status === 'Active' ? (
                          <button
                            onClick={() => handleOpenReturn(r)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-semibold shadow-xs transition-all"
                          >
                            <Key className="h-3 w-3" />
                            {t('returnVehicle')}
                          </button>
                        ) : (
                          <div className="text-right">
                            <span className="text-xs font-bold text-emerald-600">
                              {t('paid')} {formatCurrency(r.finalTotal || 0)}
                            </span>
                            <span className="block text-[9px] text-gray-400 mt-0.5">
                              {t('completedTerm')}
                            </span>
                          </div>
                        )}
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4.5 bg-gray-50/50 border-t border-gray-100 text-xs text-gray-500 font-medium">
              <div>
                {language === 'en' ? (
                  <>
                    Showing <span className="font-semibold text-gray-900">{(activePage - 1) * itemsPerPage + 1}</span> to{' '}
                    <span className="font-semibold text-gray-900">
                      {Math.min(activePage * itemsPerPage, filteredRentals.length)}
                    </span>{' '}
                    of <span className="font-semibold text-gray-900">{filteredRentals.length}</span> entries
                  </>
                ) : (
                  <>
                    បង្ហាញ <span className="font-semibold text-gray-900">{(activePage - 1) * itemsPerPage + 1}</span> ដល់{' '}
                    <span className="font-semibold text-gray-900">
                      {Math.min(activePage * itemsPerPage, filteredRentals.length)}
                    </span>{' '}
                    ក្នុងចំណោម <span className="font-semibold text-gray-900">{filteredRentals.length}</span> កំណត់ត្រា
                  </>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={activePage === 1}
                  className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg font-semibold hover:bg-neutral-50/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-2xs text-[11px]"
                >
                  {language === 'en' ? 'Previous' : 'មុន'}
                </button>
                <span className="text-[11px] text-gray-400">
                  {language === 'en' ? `Page ${activePage} of ${totalPages}` : `ទំព័រទី ${activePage} នៃ ${totalPages}`}
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={activePage === totalPages}
                  className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg font-semibold hover:bg-neutral-50/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-2xs text-[11px]"
                >
                  {language === 'en' ? 'Next' : 'បន្ទាប់'}
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center shadow-xs">
          <div className="inline-flex p-3 bg-gray-50 border border-gray-100 text-gray-400 rounded-xl mb-4">
            <CalendarRange className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-bold text-gray-900">{t('noRentalsLogged')}</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
            {searchQuery 
              ? t('noRentalsDescSearch') 
              : t('noRentalsDescEmpty')
            }
          </p>
          {!searchQuery && availableVehicles.length > 0 && (
            <button
              onClick={handleOpenStart}
              className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium shadow-sm transition-all"
            >
              <Plus className="h-3.5 w-3.5" />
              {t('rentCarNow')}
            </button>
          )}
        </div>
      )}

      {/* Modal: Start Rental */}
      {isStartModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-gray-900/30 backdrop-blur-xs" onClick={() => setIsStartModalOpen(false)} />
          
          <div className="bg-white border border-gray-200 rounded-xl shadow-lg max-w-lg w-full overflow-hidden relative z-10">
            <div className="px-5 py-4 border-b border-b-gray-100 flex items-center justify-between bg-gray-50">
              <span className="text-xs font-bold text-gray-900">{t('startRentalContract')}</span>
              <button onClick={() => setIsStartModalOpen(false)} className="text-gray-400 hover:text-gray-750 p-1">
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <form onSubmit={handleStartSubmit} className="p-5 space-y-4 text-xs font-medium">
              
              {/* Select Vehicle */}
              <div className="space-y-1">
                <label className="font-semibold text-gray-700">{t('selectAvailableVehicle')}</label>
                <select
                  required
                  value={vehicleId}
                  onChange={(e) => handleVehicleSelect(e.target.value)}
                  className="w-full pl-3 pr-10 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                >
                  <option value="" disabled>-- {language === 'en' ? 'Choose Available Fleet' : 'ជ្រើសរើសឡានទំនេរ'} --</option>
                  {availableVehicles.map(v => (
                    <option key={v.id} value={v.id}>{v.carName} ({v.plateNumber}) • {formatCurrency(v.dailyRentalPrice)}/d</option>
                  ))}
                </select>
              </div>

              {/* Customer Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-gray-700">{t('customerFullName')}</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-gray-700">{t('customerPhoneNumber')}</label>
                  <input
                    type="text"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="e.g. +1 555-0199"
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-gray-700">{t('startDate')}</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      if (returnDate && new Date(returnDate) < new Date(e.target.value)) {
                        const newReturn = new Date(e.target.value);
                        newReturn.setDate(newReturn.getDate() + 1);
                        setReturnDate(newReturn.toISOString().split('T')[0]);
                      }
                    }}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-gray-700">{t('scheduledReturnDate')}</label>
                  <input
                    type="date"
                    required
                    min={startDate}
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
              </div>

              {/* Dynamic Duration Counter Badge */}
              {checkoutDays > 0 && (
                <div className="text-[10px] text-blue-600 font-bold bg-blue-50/50 border border-blue-100/50 rounded-lg px-2.5 py-1.5 flex items-center justify-between shadow-2xs">
                  <span className="flex items-center gap-1">
                    <CalendarRange className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                    {language === 'en' ? 'Rental Duration' : 'រយៈពេលជួលសរុប'}៖
                  </span>
                  <span>{checkoutDays} {language === 'en' ? (checkoutDays === 1 ? 'Day' : 'Days') : 'ថ្ងៃ'}</span>
                </div>
              )}

              {/* Pricing, Deposit, Staff */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-gray-700">{t('dailyPrice')} ({settings.currency})</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={dailyPrice}
                    onChange={(e) => setDailyPrice(parseInt(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-gray-700">{t('cashDeposit')} ({settings.currency})</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={deposit}
                    onChange={(e) => setDeposit(parseInt(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-gray-700">{t('loggingStaff')}</label>
                  <select
                    value={staffName}
                    onChange={(e) => setStaffName(e.target.value)}
                    className="w-full pl-3 pr-10 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                  >
                    {settings.staffNames.map(name => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Driver Selection */}
              <div className="space-y-1">
                <label className="font-semibold text-gray-700">{t('selectDriver')}</label>
                <select
                  value={driverId}
                  onChange={(e) => setDriverId(e.target.value)}
                  className="w-full pl-3 pr-10 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                >
                  <option value="">{t('noDriver')}</option>
                  {availableDrivers.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.name} (+{formatCurrency(d.dailyRate)}/{language === 'en' ? 'd' : 'ថ្ងៃ'}) • {d.phone}
                    </option>
                  ))}
                </select>
              </div>

              {/* Destination Province & Trip Surcharge */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-gray-700">{t('destinationProvince')}</label>
                  <select
                    value={destinationProvince}
                    onChange={(e) => handleProvinceSelect(e.target.value)}
                    className="w-full pl-3 pr-10 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                  >
                    {CAMBODIA_PROVINCES.map(prov => (
                      <option key={prov.en} value={prov.en}>
                        {language === 'en' ? prov.en : prov.km}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-gray-700">{t('tripSurcharge')} ({settings.currency})</label>
                  <input
                    type="number"
                    min="0"
                    value={tripSurcharge}
                    onChange={(e) => setTripSurcharge(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black font-semibold text-gray-900"
                  />
                </div>
              </div>

              {/* Initial Mileage & Fuel (Editable) */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-gray-700">{t('currentMileageOut')}</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={mileageOut}
                    onChange={(e) => setMileageOut(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black font-semibold text-gray-900"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-gray-700">{t('fuelLevelOut')} (%)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    max="100"
                    value={fuelOut}
                    onChange={(e) => setFuelOut(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black font-semibold text-gray-900"
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1">
                <label className="font-semibold text-gray-700">{t('contractNotes')}</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Needs child seat, return clean..."
                  rows={2}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black resize-none"
                />
              </div>

              {/* Submit footer */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsStartModalOpen(false)}
                  className="px-3 py-1.5 border border-gray-200 bg-white hover:bg-gray-50 text-gray-755 font-semibold rounded-lg"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
                >
                  {t('confirmCheckout')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Return Vehicle */}
      {isReturnModalOpen && selectedRental && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-gray-900/30 backdrop-blur-xs" onClick={() => setIsReturnModalOpen(false)} />
          
          <div className="bg-white border border-gray-200 rounded-xl shadow-lg max-w-lg w-full overflow-hidden relative z-10">
            <div className="px-5 py-4 border-b border-b-gray-100 flex items-center justify-between bg-gray-50">
              <span className="text-xs font-bold text-gray-900">{t('returnCheckIn')}</span>
              <button onClick={() => setIsReturnModalOpen(false)} className="text-gray-400 hover:text-gray-750 p-1">
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <form onSubmit={handleReturnSubmit} className="p-5 space-y-4 text-xs font-medium">
              
              {/* Customer and Car info */}
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
                <div>
                  <span className="text-[10px] text-gray-400 block font-semibold">{t('customerInfo')}</span>
                  <span className="text-xs font-bold text-gray-900">{selectedRental.customerName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block font-semibold">{t('vehicleDetails')}</span>
                  <span className="text-xs font-bold text-gray-900">
                    {vehicles.find(v => v.id === selectedRental.vehicleId)?.carName || "Vehicle"}
                  </span>
                </div>
              </div>

              {/* Mileage & Fuel In */}
              <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-3">
                <div className="space-y-1">
                  <label className="font-semibold text-gray-700">
                    {t('mileageCheckIn')} ({language === 'en' ? 'Out' : 'ចេញ'}៖ {selectedRental.mileageOut.toLocaleString()})
                  </label>
                  <input
                    type="number"
                    required
                    min={selectedRental.mileageOut}
                    value={mileageIn}
                    onChange={(e) => setMileageIn(parseInt(e.target.value) || 0)}
                    className={`w-full px-3 py-2 bg-white border rounded-lg focus:outline-none focus:ring-1 focus:ring-black font-semibold text-gray-900 ${
                      mileageIn < selectedRental.mileageOut ? 'border-red-500 text-red-600 focus:ring-red-500' : 'border-gray-200'
                    }`}
                  />
                  {mileageIn < selectedRental.mileageOut ? (
                    <span className="text-[10px] text-red-500 font-bold flex items-center gap-1 mt-1">
                      <AlertTriangle className="h-3.5 w-3.5 text-red-500 shrink-0" />
                      {language === 'en' ? 'Cannot be less than starting mileage' : 'មិនអាចតិចជាងចម្ងាយចេញឡើយ'}
                    </span>
                  ) : (
                    mileageIn >= selectedRental.mileageOut && (
                      <span className="text-[10px] text-blue-600 font-bold flex items-center gap-1 mt-1">
                        <Car className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                        {language === 'en' ? 'Distance' : 'ចម្ងាយជិះ'}៖ +{(mileageIn - selectedRental.mileageOut).toLocaleString()} {language === 'en' ? 'km' : 'គ.ម'}
                      </span>
                    )
                  )}
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-gray-700">
                    {t('fuelCheckIn')} ({language === 'en' ? 'Out' : 'ចេញ'}៖ {selectedRental.fuelOut}%)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    max="100"
                    value={fuelIn}
                    onChange={(e) => setFuelIn(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black font-semibold text-gray-900"
                  />
                  {fuelIn !== selectedRental.fuelOut && (
                    <span className={`text-[10px] font-bold flex items-center gap-1 mt-1 ${fuelIn < selectedRental.fuelOut ? 'text-red-500' : 'text-emerald-600'}`}>
                      <Fuel className="h-3.5 w-3.5 shrink-0" />
                      <span>
                        {fuelIn < selectedRental.fuelOut 
                          ? `${language === 'en' ? 'Used' : 'ប្រើអស់'}៖ -${selectedRental.fuelOut - fuelIn}%`
                          : `${language === 'en' ? 'Refueled' : 'បានថែមប្រេង'}៖ +${fuelIn - selectedRental.fuelOut}%`
                        }
                      </span>
                    </span>
                  )}
                </div>
              </div>

              {/* Fees grid */}
              <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-3">
                <div className="space-y-1">
                  <label className="font-semibold text-gray-750">
                    {t('gasolineFee')} ({settings.currency}) {fuelIn < selectedRental.fuelOut && <span className="text-red-500 font-semibold">{t('lowFuel')}</span>}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={gasolineCost}
                    onChange={(e) => setGasolineCost(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-gray-750">{t('damageCharges')} ({settings.currency})</label>
                  <input
                    type="number"
                    min="0"
                    value={damageFee}
                    onChange={(e) => setDamageFee(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-gray-750">{t('cleaningFee')} ({settings.currency})</label>
                  <input
                    type="number"
                    min="0"
                    value={cleaningFee}
                    onChange={(e) => setCleaningFee(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-gray-750">{t('lateReturnFine')} ({settings.currency})</label>
                  <input
                    type="number"
                    min="0"
                    value={lateFee}
                    onChange={(e) => setLateFee(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
              </div>

              {/* Maintenance Notes & Next Status */}
              <div className="grid grid-cols-3 gap-4 border-t border-gray-100 pt-3">
                <div className="col-span-2 space-y-1">
                  <label className="font-semibold text-gray-700">{t('inspectionNotes')}</label>
                  <input
                    type="text"
                    value={maintenanceNote}
                    onChange={(e) => setMaintenanceNote(e.target.value)}
                    placeholder="e.g. Returned in clean condition"
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-gray-700">{t('nextStatus')}</label>
                  <select
                    value={nextStatus}
                    onChange={(e) => setNextStatus(e.target.value as any)}
                    className="w-full pl-3 pr-10 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                  >
                    <option value="Available">{t('available')}</option>
                    <option value="Maintenance">{t('maintenance')}</option>
                  </select>
                </div>
              </div>

              {/* Live Invoice Preview */}
              <div className="bg-gray-55/50 border border-gray-200 rounded-xl p-3.5 space-y-2">
                <span className="text-[10px] font-bold text-gray-900 uppercase block tracking-wider">{t('invoiceDetails')}</span>
                <div className="space-y-1 text-gray-500 font-medium">
                  <div className="flex justify-between">
                    <span>{t('baseLeaseDays', { days: calcDetails.days, price: formatCurrency(selectedRental.dailyPrice) })}:</span>
                    <span className="text-gray-900 font-bold">{formatCurrency(calcDetails.rentCost)}</span>
                  </div>
                  {calcDetails.driverCost > 0 && (
                    <div className="flex justify-between text-blue-600 font-semibold">
                      <span>{t('driverCostLabel', { days: calcDetails.days, rate: formatCurrency(selectedRental.driverRate || 0) })}:</span>
                      <span>{formatCurrency(calcDetails.driverCost)}</span>
                    </div>
                  )}
                  {selectedRental.tripSurcharge && selectedRental.tripSurcharge > 0 ? (
                    <div className="flex justify-between text-amber-600 font-semibold">
                      <span>{t('tripSurcharge')}:</span>
                      <span>{formatCurrency(selectedRental.tripSurcharge)}</span>
                    </div>
                  ) : null}
                  {(gasolineCost > 0 || damageFee > 0 || cleaningFee > 0 || lateFee > 0) && (
                    <div className="space-y-0.5 pl-3 border-l border-gray-200 text-[10px]">
                      {gasolineCost > 0 && <div className="flex justify-between"><span>{t('gasolineFee')}:</span><span>+{formatCurrency(gasolineCost)}</span></div>}
                      {damageFee > 0 && <div className="flex justify-between"><span>{t('damageCharges')}:</span><span>+{formatCurrency(damageFee)}</span></div>}
                      {cleaningFee > 0 && <div className="flex justify-between"><span>{t('cleaningFee')}:</span><span>+{formatCurrency(cleaningFee)}</span></div>}
                      {lateFee > 0 && <div className="flex justify-between"><span>{t('lateReturnFine')}:</span><span>+{formatCurrency(lateFee)}</span></div>}
                    </div>
                  )}
                  <div className="flex justify-between border-t border-gray-200 pt-1.5 text-xs font-bold text-gray-950">
                    <span>{t('finalCalculatedTotal')}:</span>
                    <span>{formatCurrency(calcDetails.total)}</span>
                  </div>
                  <div className="text-[9px] text-gray-400 mt-1">
                    {t('offsetDepositNote', { deposit: formatCurrency(selectedRental.deposit) })}
                  </div>
                </div>
              </div>

              {/* Submit buttons */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsReturnModalOpen(false)}
                  className="px-3 py-1.5 border border-gray-200 bg-white hover:bg-gray-50 text-gray-755 font-semibold rounded-lg"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
                >
                  {t('completeCheckin')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default function RentalsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500 font-medium">Loading...</div>}>
      <RentalsPageContent />
    </Suspense>
  );
}
