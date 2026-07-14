"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '../context/AppContext';
import { VehicleVisual } from '../components/VehicleVisual';
import { 
  DollarSign, 
  Key, 
  Car, 
  Wrench, 
  TrendingUp, 
  ArrowRight,
  Plus,
  Receipt,
  CalendarRange,
  MoreVertical,
  User,
  Phone,
  Fuel,
  Info,
  Check,
  Gauge,
  Users,
  Compass
} from 'lucide-react';

export default function Dashboard() {
  const { rentals, vehicles, expenses, settings, editVehicle, t, language } = useApp();

  const [activeTab, setActiveTab] = useState<'yard' | 'road' | 'workshop'>('yard');

  // Metrics calculations
  const activeRentals = rentals.filter(r => r.status === 'Active');
  const completedRentals = rentals.filter(r => r.status === 'Completed');
  
  const totalRevenue = completedRentals.reduce((sum, r) => sum + (r.finalTotal || 0), 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = totalRevenue - totalExpenses;

  // Occupancy percentages
  const availableCars = vehicles.filter(v => v.status === 'Available');
  const maintenanceCars = vehicles.filter(v => v.status === 'Maintenance');
  const rentedCars = vehicles.filter(v => v.status === 'Rented');
  const fleetTotal = vehicles.length || 1;
  const rentedPct = Math.round((rentedCars.length / fleetTotal) * 100);
  const availablePct = Math.round((availableCars.length / fleetTotal) * 100);
  const maintenancePct = Math.round((maintenanceCars.length / fleetTotal) * 100);

  // Helper to extract staff initials
  const getStaffInitials = (name: string) => {
    if (!name) return "ST";
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  };

  // Helper to compute dynamic days left
  const getDaysDifference = (returnDateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const retDate = new Date(returnDateStr);
    retDate.setHours(0, 0, 0, 0);
    const diffTime = retDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Format date nicely
  const formatDateDisplay = (dateStr: string) => {
    const locale = language === 'en' ? 'en-US' : 'km-KH';
    const d = new Date(dateStr);
    return d.toLocaleDateString(locale, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Get status badge for active rentals
  const getDaysLeftBadge = (returnDateStr: string) => {
    const diff = getDaysDifference(returnDateStr);
    if (diff > 1) {
      return (
        <span className="text-[10px] font-bold px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100/50">
          {t('daysLeft', { days: diff })}
        </span>
      );
    }
    if (diff === 1) {
      return (
        <span className="text-[10px] font-bold px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100/50">
          {t('dayLeft')}
        </span>
      );
    }
    if (diff === 0) {
      return (
        <span className="text-[10px] font-bold px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100/50">
          {t('today')}
        </span>
      );
    }
    const overdue = Math.abs(diff);
    return (
      <span className="text-[10px] font-bold px-3 py-1.5 rounded-full bg-red-50 text-red-600 border border-red-100/50">
        {overdue === 1 ? t('dayOverdue') : t('daysOverdue', { days: overdue })}
      </span>
    );
  };

  // Get badge for upcoming returns column
  const getUpcomingBadge = (returnDateStr: string) => {
    const diff = getDaysDifference(returnDateStr);
    if (diff === 1) {
      return (
        <span className="text-[9px] font-bold px-2 py-1 rounded-md bg-amber-50 text-amber-700 border border-amber-150">
          {t('tomorrow')}
        </span>
      );
    }
    if (diff === 0) {
      return (
        <span className="text-[9px] font-bold px-2 py-1 rounded-md bg-amber-50 text-amber-700 border border-amber-150">
          {t('today')}
        </span>
      );
    }
    if (diff > 1) {
      return (
        <span className="text-[9px] font-bold px-2 py-1 rounded-md bg-blue-50 text-blue-600 border border-blue-150">
          {t('inDays', { days: diff })}
        </span>
      );
    }
    return (
      <span className="text-[9px] font-bold px-2 py-1 rounded-md bg-red-50 text-red-600 border border-red-150">
        {t('daysOverdue', { days: Math.abs(diff) })}
      </span>
    );
  };

  // Sort active rentals by return date (soonest first)
  const sortedActiveRentals = [...activeRentals].sort(
    (a, b) => new Date(a.returnDate).getTime() - new Date(b.returnDate).getTime()
  );

  // Generate Activities Feed
  interface ActivityItem {
    id: string;
    type: 'return' | 'gasoline' | 'maintenance' | 'rental';
    text: string;
    time: string;
  }

  const activities: ActivityItem[] = [];

  // Completed rentals are returns
  completedRentals.forEach(r => {
    const car = vehicles.find(v => v.id === r.vehicleId);
    activities.push({
      id: `act-ret-${r.id}`,
      type: 'return',
      text: `${car?.carName || 'Vehicle'} (${car?.plateNumber || ''}) ${language === 'en' ? 'returned by' : 'ប្រគល់ត្រឡប់មកវិញដោយ'} ${r.customerName}`,
      time: language === 'en' ? '2 hours ago' : '២ ម៉ោងមុន'
    });
  });

  // Gasoline/Repair expenses
  expenses.forEach(e => {
    const car = vehicles.find(v => v.id === e.vehicleId);
    if (e.type === 'Gasoline') {
      activities.push({
        id: `act-gas-${e.id}`,
        type: 'gasoline',
        text: language === 'en' 
          ? `Gasoline added for ${car?.carName || 'Vehicle'} (${car?.plateNumber || ''})` 
          : `បានបន្ថែមសាំងសម្រាប់ ${car?.carName || 'Vehicle'} (${car?.plateNumber || ''})`,
        time: language === 'en' ? '3 hours ago' : '៣ ម៉ោងមុន'
      });
    } else {
      activities.push({
        id: `act-maint-${e.id}`,
        type: 'maintenance',
        text: language === 'en'
          ? `Maintenance completed for ${car?.carName || 'Vehicle'} (${car?.plateNumber || ''})`
          : `ការថែទាំបានបញ្ចប់សម្រាប់ ${car?.carName || 'Vehicle'} (${car?.plateNumber || ''})`,
        time: language === 'en' ? '5 hours ago' : '៥ ម៉ោងមុន'
      });
    }
  });

  // Active rentals are new creations
  activeRentals.forEach(r => {
    const car = vehicles.find(v => v.id === r.vehicleId);
    activities.push({
      id: `act-rent-${r.id}`,
      type: 'rental',
      text: language === 'en'
        ? `New rental created for ${car?.carName || 'Vehicle'} (${car?.plateNumber || ''})`
        : `កិច្ចសន្យាជួលថ្មីត្រូវបានបង្កើតសម្រាប់ ${car?.carName || 'Vehicle'} (${car?.plateNumber || ''})`,
      time: language === 'en' ? '1 day ago' : '១ ថ្ងៃមុន'
    });
  });

  // Sort arbitrarily to match screenshot sequence or timestamps
  const activitiesFeed = activities.slice(0, 4);

  const formatCurrency = (amount: number) => {
    return `${settings.currency}${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome / Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">{t('overview')}</h1>
          <p className="text-xs text-gray-500">{t('realTimeStatus')}</p>
        </div>
        
        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          <Link 
            href="/rentals" 
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium shadow-sm transition-all"
          >
            <Plus className="h-3.5 w-3.5" />
            {t('createRental')}
          </Link>
          <Link 
            href="/expenses" 
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg text-xs font-medium transition-all"
          >
            <Receipt className="h-3.5 w-3.5 text-gray-400" />
            {t('logExpense')}
          </Link>
        </div>
      </div>

      {/* Financial KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Card: Total Revenue */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">{t('totalRevenue')}</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-gray-900 tracking-tight">{formatCurrency(totalRevenue)}</h3>
            <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-emerald-500 inline" /> {t('computedCompleted')}
            </p>
          </div>
        </div>

        {/* Card: Total Expenses */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">{t('totalExpenses')}</span>
            <div className="p-2 bg-red-50 text-red-600 rounded-lg">
              <Receipt className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-gray-900 tracking-tight">{formatCurrency(totalExpenses)}</h3>
            <p className="text-[10px] text-gray-400 mt-1">
              {t('includesRepairs')}
            </p>
          </div>
        </div>

        {/* Card: Net Profit */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">{t('netProfit')}</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className={`text-2xl font-bold tracking-tight ${netProfit >= 0 ? 'text-gray-900' : 'text-red-600'}`}>
              {formatCurrency(netProfit)}
            </h3>
            <p className="text-[10px] text-gray-400 mt-1">
              {t('revMinusExp')}
            </p>
          </div>
        </div>
      </div>

      {/* Fleet Utilization Circular Gauge */}
      <div className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-900 rounded-xl p-5 shadow-xs">
        <h2 className="text-xs font-bold text-gray-900 dark:text-zinc-100 tracking-tight">{t('fleetOccupancy')}</h2>
        <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Circular donut chart */}
          <div className="relative flex items-center justify-center h-28 w-28 shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background Circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                className="stroke-neutral-100 dark:stroke-zinc-800 fill-none"
                strokeWidth="10"
              />
              {/* Rented Circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                className="stroke-blue-600 fill-none transition-all duration-1000 ease-out"
                strokeWidth="10"
                strokeDasharray={2 * Math.PI * 40}
                strokeDashoffset={2 * Math.PI * 40 - (rentedPct / 100) * 2 * Math.PI * 40}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-xl font-black text-gray-900 dark:text-zinc-100 block tracking-tight">{rentedPct}%</span>
              <span className="text-[8px] uppercase tracking-wider font-semibold text-gray-400 dark:text-zinc-500 block">{t('utilizationRate')}</span>
            </div>
          </div>
          
          {/* Stats details */}
          <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-4 w-full text-xs">
            <div className="bg-neutral-50/50 dark:bg-zinc-900/40 border border-neutral-100 dark:border-zinc-800/60 rounded-xl p-3 flex flex-col justify-between shadow-2xs">
              <span className="text-[10px] text-gray-400 dark:text-zinc-500 font-semibold uppercase tracking-wider block">{t('totalFleet')}</span>
              <span className="text-lg font-bold text-gray-900 dark:text-zinc-100 mt-1">{vehicles.length} {language === 'en' ? 'Cars' : 'ឡាន'}</span>
            </div>
            <div className="bg-emerald-50/20 dark:bg-emerald-950/10 border border-emerald-100/50 dark:border-emerald-900/20 rounded-xl p-3 flex flex-col justify-between shadow-2xs">
              <span className="text-[10px] text-emerald-600/70 dark:text-emerald-400/80 font-semibold uppercase tracking-wider block">{t('available')}</span>
              <span className="text-lg font-bold text-emerald-700 dark:text-emerald-400 mt-1">{availableCars.length} {language === 'en' ? 'Cars' : 'ឡាន'}</span>
            </div>
            <div className="bg-blue-50/20 dark:bg-blue-950/10 border border-blue-100/50 dark:border-blue-900/20 rounded-xl p-3 flex flex-col justify-between shadow-2xs">
              <span className="text-[10px] text-blue-600/70 dark:text-blue-400/80 font-semibold uppercase tracking-wider block">{t('rented')}</span>
              <span className="text-lg font-bold text-blue-700 dark:text-blue-400 mt-1">{rentedCars.length} {language === 'en' ? 'Cars' : 'ឡាន'}</span>
            </div>
            <div className="bg-amber-50/20 dark:bg-amber-950/10 border border-amber-100/50 dark:border-amber-900/20 rounded-xl p-3 flex flex-col justify-between shadow-2xs">
              <span className="text-[10px] text-amber-600/70 dark:text-amber-400/80 font-semibold uppercase tracking-wider block">{t('maintenance')}</span>
              <span className="text-lg font-bold text-amber-700 dark:text-amber-400 mt-1">{maintenanceCars.length} {language === 'en' ? 'Cars' : 'ឡាន'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* PANEL: Live Garage Operations Manager */}
      <div className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-900 rounded-xl overflow-hidden shadow-xs">
        {/* Header with tabs */}
        <div className="px-5 py-4 border-b border-gray-100 dark:border-zinc-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-50/40 dark:bg-zinc-900/10">
          <div>
            <h2 className="text-sm font-bold text-gray-900 dark:text-zinc-100 tracking-tight flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              {language === 'en' ? 'Live Garage Operations' : 'កន្លែងចាត់ចែងឡានរហ័ស'}
            </h2>
            <p className="text-[10px] text-gray-400 dark:text-zinc-500 mt-0.5">
              {language === 'en' ? 'Quick dispatch controls matching your physical garage yard.' : 'ការចាត់ចែងរហ័សតាមស្ថានភាពឡានជាក់ស្តែងក្នុងហ្គារ៉ាសរបស់អ្នក។'}
            </p>
          </div>
          
          {/* Tab Selector */}
          <div className="flex bg-neutral-100 dark:bg-zinc-900 p-0.5 rounded-lg text-[10px] font-semibold text-gray-500 shrink-0 self-start sm:self-center">
            <button
              onClick={() => setActiveTab('yard')}
              className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                activeTab === 'yard' ? 'bg-white dark:bg-zinc-800 text-gray-900 dark:text-white shadow-3xs font-bold' : 'hover:text-gray-900 dark:hover:text-zinc-200'
              }`}
            >
              <Car className={`h-3.5 w-3.5 ${activeTab === 'yard' ? 'text-blue-600' : 'text-gray-400'}`} />
              <span>{language === 'en' ? 'In Yard' : 'ក្នុងហ្គារ៉ាស'} ({availableCars.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('road')}
              className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                activeTab === 'road' ? 'bg-white dark:bg-zinc-800 text-gray-900 dark:text-white shadow-3xs font-bold' : 'hover:text-gray-900 dark:hover:text-zinc-200'
              }`}
            >
              <Compass className={`h-3.5 w-3.5 ${activeTab === 'road' ? 'text-emerald-600' : 'text-gray-400'}`} />
              <span>{language === 'en' ? 'On Road' : 'កំពុងជួល'} ({rentedCars.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('workshop')}
              className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                activeTab === 'workshop' ? 'bg-white dark:bg-zinc-800 text-gray-900 dark:text-white shadow-3xs font-bold' : 'hover:text-gray-900 dark:hover:text-zinc-200'
              }`}
            >
              <Wrench className={`h-3.5 w-3.5 ${activeTab === 'workshop' ? 'text-amber-600' : 'text-gray-400'}`} />
              <span>{language === 'en' ? 'In Workshop' : 'កំពុងថែទាំ'} ({maintenanceCars.length})</span>
            </button>
          </div>
        </div>

        {/* Tab Contents */}
        <div className="p-5">
          {activeTab === 'yard' && (
            availableCars.length === 0 ? (
              <div className="text-center py-8 text-gray-400 font-medium">
                {language === 'en' ? 'No vehicles currently in the yard.' : 'គ្មានយានយន្តនៅក្នុងហ្គារ៉ាសឡើយ។'}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableCars.map(car => (
                  <div key={car.id} className="border border-gray-100 dark:border-zinc-800/80 rounded-xl p-4 flex flex-col justify-between hover:border-blue-100 dark:hover:border-blue-900/40 transition-colors shadow-3xs bg-white dark:bg-zinc-900/40">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 tracking-wider uppercase">{car.plateNumber}</span>
                        <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-450 border border-emerald-100/50 dark:border-emerald-900/30 font-bold px-1.5 py-0.5 rounded-md">
                          {language === 'en' ? 'Available' : 'ទំនេរ'}
                        </span>
                      </div>
                      <h3 className="text-xs font-bold text-gray-900 dark:text-zinc-100 mt-1">{car.carName}</h3>
                      <div className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1.5 text-[9px] text-gray-400 dark:text-zinc-500 font-semibold">
                        <span className="flex items-center gap-1"><Fuel className="h-3 w-3 text-gray-400 dark:text-zinc-500" /> {car.fuelPercentage}%</span>
                        <span className="flex items-center gap-1"><Car className="h-3 w-3 text-gray-400 dark:text-zinc-500" /> {car.currentMileage.toLocaleString()} km</span>
                        <span className="flex items-center gap-1"><Users className="h-3 w-3 text-gray-400 dark:text-zinc-500" /> {car.seats === 'Family Car' ? (language === 'en' ? 'Family' : 'គ្រួសារ') :
                               car.seats === 'Van' ? (language === 'en' ? 'Hiace/Van' : 'វែន/Hiace') :
                               car.seats === 'Bus' ? (language === 'en' ? 'Bus' : 'ឡានក្រុង') : (car.seats || '')}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-3 border-t border-neutral-50 dark:border-zinc-800/60 flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">${car.dailyRentalPrice}/day</span>
                      <Link
                        href={`/rentals?rent=${car.id}`}
                        className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold transition-all shadow-3xs uppercase tracking-wider"
                      >
                        <Plus className="h-3 w-3" />
                        {language === 'en' ? 'Rent Out' : 'ជួលចេញ'}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {activeTab === 'road' && (
            rentedCars.length === 0 ? (
              <div className="text-center py-8 text-gray-400 font-medium">
                {language === 'en' ? 'No vehicles currently on the road.' : 'គ្មានយានយន្តកំពុងជួលនៅលើផ្លូវឡើយ។'}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {rentedCars.map(car => {
                  const activeContract = rentals.find(r => r.status === 'Active' && r.vehicleId === car.id);
                  return (
                    <div key={car.id} className="border border-gray-100 dark:border-zinc-800/80 rounded-xl p-4 flex flex-col justify-between hover:border-blue-100/50 dark:hover:border-blue-900/40 transition-colors shadow-3xs bg-white dark:bg-zinc-900/40">
                      <div>
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 tracking-wider uppercase">{car.plateNumber}</span>
                          <span className="text-[10px] bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-450 border border-blue-100/50 dark:border-blue-900/30 font-bold px-1.5 py-0.5 rounded-md">
                            {language === 'en' ? 'On Road' : 'កំពុងជួល'}
                          </span>
                        </div>
                        <h3 className="text-xs font-bold text-gray-900 dark:text-zinc-100 mt-1">{car.carName}</h3>
                        {activeContract && (
                          <div className="mt-2.5 p-2.5 bg-neutral-50 dark:bg-zinc-950/50 border border-neutral-100 dark:border-zinc-800/85 rounded-lg space-y-1 text-[9px] text-gray-500 dark:text-zinc-400 font-semibold">
                            <div className="flex justify-between">
                              <span className="text-gray-400 dark:text-zinc-500">{language === 'en' ? 'Client:' : 'អតិថិជន៖'}</span>
                              <span className="text-gray-800 dark:text-zinc-200">{activeContract.customerName}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400 dark:text-zinc-500">{language === 'en' ? 'Return:' : 'ថ្ងៃត្រឡប់៖'}</span>
                              <span className="text-blue-600 dark:text-blue-400">{activeContract.returnDate}</span>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-4 pt-3 border-t border-neutral-50 dark:border-zinc-800/60 flex items-center justify-end">
                        <Link
                          href={`/rentals?return=${car.id}`}
                          className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold transition-all shadow-3xs uppercase tracking-wider"
                        >
                          <ArrowRight className="h-3 w-3" />
                          {language === 'en' ? 'Check In' : 'ប្រគល់ឡានចូល'}
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          )}

          {activeTab === 'workshop' && (
            maintenanceCars.length === 0 ? (
              <div className="text-center py-8 text-gray-400 font-medium">
                {language === 'en' ? 'No vehicles in the workshop.' : 'គ្មានយានយន្តនៅក្នុងរោងជាងថែទាំឡើយ។'}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {maintenanceCars.map(car => (
                  <div key={car.id} className="border border-gray-100 dark:border-zinc-800/80 rounded-xl p-4 flex flex-col justify-between hover:border-amber-100 dark:hover:border-amber-900/40 transition-colors shadow-3xs bg-white dark:bg-zinc-900/40">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 tracking-wider uppercase">{car.plateNumber}</span>
                        <span className="text-[10px] bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-450 border border-amber-100/50 dark:border-amber-900/30 font-bold px-1.5 py-0.5 rounded-md">
                          {language === 'en' ? 'Maintenance' : 'កំពុងថែទាំ'}
                        </span>
                      </div>
                      <h3 className="text-xs font-bold text-gray-900 dark:text-zinc-100 mt-1">{car.carName}</h3>
                      <div className="mt-2 flex items-center gap-1.5 text-[9px] text-gray-400 dark:text-zinc-500 font-semibold">
                        <Wrench className="h-3 w-3 text-gray-400 dark:text-zinc-500 shrink-0" />
                        <span>{language === 'en' ? 'Under repair / servicing' : 'កំពុងជួសជុល / ថែទាំ'}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-3 border-t border-neutral-50 dark:border-zinc-800/60 flex items-center justify-end">
                      <button
                        onClick={() => {
                          editVehicle(car.id, { status: 'Available' });
                          alert(language === 'en' ? `${car.carName} returned to yard available.` : `${car.carName} បានយកចូលហ្គារ៉ាសវិញទំនេរ។`);
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-900 text-white rounded-lg text-[10px] font-bold transition-all shadow-3xs uppercase tracking-wider"
                      >
                        <Check className="h-3 w-3" />
                        {language === 'en' ? 'Complete' : 'ថែទាំរួចរាល់'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>

      {/* SECTION: TWO COLUMN BOTTOM GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* PANEL 2: Recent Activity */}
        <div className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-900 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-gray-900 dark:text-zinc-100 tracking-tight mb-4">{t('recentActivity')}</h2>
            
            <div className="space-y-4 font-medium">
              {activitiesFeed.map((act) => (
                <div key={act.id} className="flex items-start justify-between gap-4 text-xs">
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 p-2 rounded-full flex items-center justify-center shrink-0 ${
                      act.type === 'return' ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-450 border border-emerald-100 dark:border-emerald-900/30' :
                      act.type === 'gasoline' ? 'bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-450 border border-blue-100 dark:border-blue-900/30' :
                      act.type === 'maintenance' ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-450 border border-amber-100 dark:border-amber-900/30' :
                      'bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-450 border border-purple-100 dark:border-purple-900/30'
                    }`}>
                      {act.type === 'return' && <Car className="h-4 w-4" />}
                      {act.type === 'gasoline' && <Fuel className="h-4 w-4" />}
                      {act.type === 'maintenance' && <Wrench className="h-4 w-4" />}
                      {act.type === 'rental' && <CalendarRange className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="text-gray-700 dark:text-zinc-300 leading-relaxed mt-0.5">{act.text}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-400 dark:text-zinc-500 font-semibold shrink-0 mt-1">
                    {act.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
 
        {/* PANEL 3: Upcoming Returns */}
        <div className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-900 rounded-xl shadow-xs overflow-hidden flex flex-col justify-between">
          <div className="px-5 py-4 border-b border-gray-100 dark:border-zinc-900 flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-900 dark:text-zinc-100 tracking-tight">{t('upcomingReturns')}</h2>
            <Link href="/rentals" className="px-3 py-1.5 border border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-900 text-[10px] font-bold text-gray-700 dark:text-zinc-300 rounded-lg transition-all">
              {t('viewAll')}
            </Link>
          </div>
 
          <div className="divide-y divide-gray-100 dark:divide-zinc-900 px-5 flex-1 flex flex-col justify-center">
            {sortedActiveRentals.slice(0, 3).map((r) => {
              const car = vehicles.find(v => v.id === r.vehicleId);
              
              return (
                <div key={r.id} className="py-3 flex items-center justify-between gap-4 text-xs font-medium">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-8 bg-neutral-100 dark:bg-zinc-900 rounded-lg flex items-center justify-center border border-gray-150 dark:border-zinc-800 overflow-hidden shrink-0">
                      <VehicleVisual type={car?.photo || 'sedan'} className="h-6 w-8" />
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900 dark:text-zinc-100 block">{car?.carName}</span>
                      <span className="text-[10px] text-gray-400 dark:text-zinc-500 font-mono mt-0.5 block">{car?.plateNumber}</span>
                    </div>
                  </div>
 
                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <span className="text-gray-900 dark:text-zinc-100 block">{formatDateDisplay(r.returnDate)}</span>
                      <span className="text-[10px] text-gray-400 dark:text-zinc-500 block mt-0.5">10:00 AM</span>
                    </div>
                    {getUpcomingBadge(r.returnDate)}
                  </div>
                </div>
              );
            })}
            
            {sortedActiveRentals.length === 0 && (
              <div className="py-8 text-center text-gray-400 italic text-xs">
                {t('noRecentOps')}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
