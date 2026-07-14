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
  User,
  Phone,
  Fuel,
  Users,
  Compass,
  Check
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
        <span className="text-xs font-bold px-3.5 py-2 rounded-full bg-blue-50 text-blue-600 border border-blue-100/50">
          {t('daysLeft', { days: diff })}
        </span>
      );
    }
    if (diff === 1) {
      return (
        <span className="text-xs font-bold px-3.5 py-2 rounded-full bg-amber-50 text-amber-700 border border-amber-100/50">
          {t('dayLeft')}
        </span>
      );
    }
    if (diff === 0) {
      return (
        <span className="text-xs font-bold px-3.5 py-2 rounded-full bg-amber-50 text-amber-700 border border-amber-100/50">
          {t('today')}
        </span>
      );
    }
    const overdue = Math.abs(diff);
    return (
      <span className="text-xs font-bold px-3.5 py-2 rounded-full bg-red-50 text-red-600 border border-red-100/50">
        {overdue === 1 ? t('dayOverdue') : t('daysOverdue', { days: overdue })}
      </span>
    );
  };

  // Get badge for upcoming returns column
  const getUpcomingBadge = (returnDateStr: string) => {
    const diff = getDaysDifference(returnDateStr);
    if (diff === 1) {
      return (
        <span className="text-xs font-bold px-2.5 py-1.5 rounded-md bg-amber-50 text-amber-700 border border-amber-150">
          {t('tomorrow')}
        </span>
      );
    }
    if (diff === 0) {
      return (
        <span className="text-xs font-bold px-2.5 py-1.5 rounded-md bg-amber-50 text-amber-700 border border-amber-150">
          {t('today')}
        </span>
      );
    }
    if (diff > 1) {
      return (
        <span className="text-xs font-bold px-2.5 py-1.5 rounded-md bg-blue-50 text-blue-600 border border-blue-150">
          {t('inDays', { days: diff })}
        </span>
      );
    }
    return (
      <span className="text-xs font-bold px-2.5 py-1.5 rounded-md bg-red-50 text-red-600 border border-red-150">
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
    type: 'rental' | 'return' | 'maintenance' | 'gasoline';
    text: string;
    time: string;
  }

  const activitiesFeed: ActivityItem[] = [];
  
  // Completed returns logs
  rentals.filter(r => r.status === 'Completed').forEach(r => {
    const car = vehicles.find(v => v.id === r.vehicleId);
    const dateStr = r.returnedAt || r.returnDate;
    
    activitiesFeed.push({
      id: `act-ret-${r.id}`,
      type: 'return',
      text: language === 'en'
        ? `${car?.carName || 'Vehicle'} (${car?.plateNumber || 'Plate'}) returned by ${r.customerName}`
        : `${car?.carName || 'យានយន្ត'} (${car?.plateNumber || 'ស្លាកលេខ'}) ត្រូវបានប្រគល់ចូលវិញដោយ ${r.customerName}`,
      time: dateStr
    });
  });

  // Active bookings logs
  activeRentals.forEach(r => {
    const car = vehicles.find(v => v.id === r.vehicleId);
    
    activitiesFeed.push({
      id: `act-rent-${r.id}`,
      type: 'rental',
      text: language === 'en'
        ? `${car?.carName || 'Vehicle'} rented out to ${r.customerName} (Logged by ${r.staffName})`
        : `${car?.carName || 'យានយន្ត'} ត្រូវបានជួលទៅឱ្យ ${r.customerName} (ចុះដោយ ${r.staffName})`,
      time: r.startDate
    });
  });

  // Expenses logs
  expenses.forEach(e => {
    const car = vehicles.find(v => v.id === e.vehicleId);
    const typeKey = e.type === 'Gasoline' ? 'gasoline' : 'maintenance';
    
    activitiesFeed.push({
      id: `act-exp-${e.id}`,
      type: typeKey,
      text: e.note || (language === 'en' 
        ? `Logged $${e.amount} operational expense on ${car?.carName || 'vehicle'}`
        : `បានចុះចំណាយប្រតិបត្តិការ $${e.amount} លើ ${car?.carName || 'យានយន្ត'}`),
      time: e.date
    });
  });

  // Sort activities chronologically (newest first)
  activitiesFeed.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

  // Show top 4 logs
  const displayActivities = activitiesFeed.slice(0, 4);

  const formatCurrency = (amount: number) => {
    return `${settings.currency}${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto text-sm">
      {/* Welcome / Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900 dark:text-zinc-100 tracking-tight">{t('overview')}</h1>
          <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1 font-medium">{t('realTimeStatus')}</p>
        </div>
        
        {/* Quick Actions */}
        <div className="flex items-center gap-2.5">
          <Link 
            href="/rentals" 
            className="flex items-center gap-1.5 px-4.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-all hover:scale-[1.02]"
          >
            <Plus className="h-4.5 w-4.5" />
            {t('createRental')}
          </Link>
          <Link 
            href="/expenses" 
            className="flex items-center gap-1.5 px-4.5 py-2.5 bg-white dark:bg-zinc-900 border border-gray-250 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-750 dark:text-zinc-200 rounded-xl text-sm font-semibold shadow-2xs transition-all hover:scale-[1.02]"
          >
            <Receipt className="h-4.5 w-4.5 text-gray-400 dark:text-zinc-500" />
            {t('logExpense')}
          </Link>
        </div>
      </div>

      {/* Financial KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card: Total Revenue */}
        <div className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-900/80 rounded-2xl p-6 shadow-sm bg-gradient-to-br from-white to-emerald-500/[0.02] dark:from-zinc-950 dark:to-emerald-500/[0.01]">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-gray-550 dark:text-zinc-450 uppercase tracking-wider">{t('totalRevenue')}</span>
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-450 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-5">
            <h3 className="text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-zinc-100 tracking-tight">{formatCurrency(totalRevenue)}</h3>
            <p className="text-xs text-gray-400 dark:text-zinc-500 mt-2 flex items-center gap-1 font-semibold">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-500 inline" /> {t('computedCompleted')}
            </p>
          </div>
        </div>

        {/* Card: Total Expenses */}
        <div className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-900/80 rounded-2xl p-6 shadow-sm bg-gradient-to-br from-white to-red-500/[0.02] dark:from-zinc-950 dark:to-red-500/[0.01]">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-gray-550 dark:text-zinc-450 uppercase tracking-wider">{t('totalExpenses')}</span>
            <div className="p-2.5 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-450 rounded-xl border border-red-100 dark:border-red-900/30">
              <Receipt className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-5">
            <h3 className="text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-zinc-100 tracking-tight">{formatCurrency(totalExpenses)}</h3>
            <p className="text-xs text-gray-400 dark:text-zinc-500 mt-2 font-semibold">
              {t('includesRepairs')}
            </p>
          </div>
        </div>

        {/* Card: Net Profit */}
        <div className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-900/80 rounded-2xl p-6 shadow-sm sm:col-span-2 lg:col-span-1 bg-gradient-to-br from-white to-blue-500/[0.02] dark:from-zinc-950 dark:to-blue-500/[0.01]">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-gray-550 dark:text-zinc-450 uppercase tracking-wider">{t('netProfit')}</span>
            <div className="p-2.5 bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-450 rounded-xl border border-blue-100 dark:border-blue-900/30">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-5">
            <h3 className={`text-3xl lg:text-4xl font-extrabold tracking-tight ${netProfit >= 0 ? 'text-gray-900 dark:text-zinc-100' : 'text-red-600'}`}>
              {formatCurrency(netProfit)}
            </h3>
            <p className="text-xs text-gray-400 dark:text-zinc-500 mt-2 font-semibold">
              {t('revMinusExp')}
            </p>
          </div>
        </div>
      </div>

      {/* Fleet Utilization Circular Gauge */}
      <div className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-900 rounded-2xl p-6 shadow-sm">
        <h2 className="text-base lg:text-lg font-bold text-gray-900 dark:text-zinc-100 tracking-tight">{t('fleetOccupancy')}</h2>
        <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Circular donut chart */}
          <div className="relative flex items-center justify-center h-32 w-32 shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                className="stroke-neutral-100 dark:stroke-zinc-850 fill-none"
                strokeWidth="10"
              />
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
              <span className="text-2xl lg:text-3xl font-black text-gray-900 dark:text-zinc-100 block tracking-tight">{rentedPct}%</span>
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-gray-400 dark:text-zinc-500 block mt-0.5">{t('utilizationRate')}</span>
            </div>
          </div>
          
          {/* Stats details */}
          <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            <div className="bg-neutral-50/50 dark:bg-zinc-900/30 border border-neutral-200/50 dark:border-zinc-800/60 rounded-2xl p-4 flex flex-col justify-between shadow-2xs">
              <span className="text-xs text-gray-450 dark:text-zinc-500 font-bold uppercase tracking-wider block">{t('totalFleet')}</span>
              <span className="text-xl font-extrabold text-gray-900 dark:text-zinc-100 mt-2">{vehicles.length} {language === 'en' ? 'Cars' : 'ឡាន'}</span>
            </div>
            <div className="bg-emerald-50/20 dark:bg-emerald-950/10 border border-emerald-100/50 dark:border-emerald-900/20 rounded-2xl p-4 flex flex-col justify-between shadow-2xs">
              <span className="text-xs text-emerald-600 dark:text-emerald-450 font-bold uppercase tracking-wider block">{t('available')}</span>
              <span className="text-xl font-extrabold text-emerald-700 dark:text-emerald-450 mt-2">{availableCars.length} {language === 'en' ? 'Cars' : 'ឡាន'}</span>
            </div>
            <div className="bg-blue-50/20 dark:bg-blue-950/10 border border-blue-100/50 dark:border-blue-900/20 rounded-2xl p-4 flex flex-col justify-between shadow-2xs">
              <span className="text-xs text-blue-600 dark:text-blue-450 font-bold uppercase tracking-wider block">{t('rented')}</span>
              <span className="text-xl font-extrabold text-blue-700 dark:text-blue-450 mt-2">{rentedCars.length} {language === 'en' ? 'Cars' : 'ឡាន'}</span>
            </div>
            <div className="bg-amber-50/20 dark:bg-amber-950/10 border border-amber-100/50 dark:border-amber-900/20 rounded-2xl p-4 flex flex-col justify-between shadow-2xs">
              <span className="text-xs text-amber-600 dark:text-amber-450 font-bold uppercase tracking-wider block">{t('maintenance')}</span>
              <span className="text-xl font-extrabold text-amber-700 dark:text-amber-450 mt-2">{maintenanceCars.length} {language === 'en' ? 'Cars' : 'ឡាន'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* PANEL: Live Garage Operations Manager */}
      <div className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-900 rounded-2xl overflow-hidden shadow-sm">
        {/* Header with tabs */}
        <div className="px-6 py-5 border-b border-gray-105 dark:border-zinc-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/40 dark:bg-zinc-900/10">
          <div>
            <h2 className="text-base lg:text-lg font-bold text-gray-900 dark:text-zinc-100 tracking-tight flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              {language === 'en' ? 'Live Garage Operations' : 'កន្លែងចាត់ចែងឡានរហ័ស'}
            </h2>
            <p className="text-xs text-gray-450 dark:text-zinc-500 mt-1 font-semibold">
              {language === 'en' ? 'Quick dispatch controls matching your physical garage yard.' : 'ការចាត់ចែងរហ័សតាមស្ថានភាពឡានជាក់ស្តែងក្នុងហ្គារ៉ាសរបស់អ្នក។'}
            </p>
          </div>
          
          {/* Tab Selector */}
          <div className="flex bg-neutral-100 dark:bg-zinc-900 p-1 rounded-xl text-xs font-bold text-gray-500 shrink-0 self-start sm:self-center shadow-2xs border border-neutral-200/20 dark:border-zinc-800/40">
            <button
              onClick={() => setActiveTab('yard')}
              className={`px-4.5 py-2.5 rounded-lg transition-all flex items-center gap-2 ${
                activeTab === 'yard' ? 'bg-white dark:bg-zinc-800 text-gray-900 dark:text-white shadow-3xs font-extrabold' : 'hover:text-gray-900 dark:hover:text-zinc-200'
              }`}
            >
              <Car className={`h-4.5 w-4.5 ${activeTab === 'yard' ? 'text-blue-600' : 'text-gray-400 dark:text-zinc-550'}`} />
              <span>{language === 'en' ? 'In Yard' : 'ក្នុងហ្គារ៉ាស'} ({availableCars.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('road')}
              className={`px-4.5 py-2.5 rounded-lg transition-all flex items-center gap-2 ${
                activeTab === 'road' ? 'bg-white dark:bg-zinc-800 text-gray-900 dark:text-white shadow-3xs font-extrabold' : 'hover:text-gray-900 dark:hover:text-zinc-200'
              }`}
            >
              <Compass className={`h-4.5 w-4.5 ${activeTab === 'road' ? 'text-emerald-600' : 'text-gray-400 dark:text-zinc-550'}`} />
              <span>{language === 'en' ? 'On Road' : 'កំពុងជួល'} ({rentedCars.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('workshop')}
              className={`px-4.5 py-2.5 rounded-lg transition-all flex items-center gap-2 ${
                activeTab === 'workshop' ? 'bg-white dark:bg-zinc-800 text-gray-900 dark:text-white shadow-3xs font-extrabold' : 'hover:text-gray-900 dark:hover:text-zinc-200'
              }`}
            >
              <Wrench className={`h-4.5 w-4.5 ${activeTab === 'workshop' ? 'text-amber-600' : 'text-gray-400 dark:text-zinc-550'}`} />
              <span>{language === 'en' ? 'In Workshop' : 'កំពុងថែទាំ'} ({maintenanceCars.length})</span>
            </button>
          </div>
        </div>

        {/* Tab Contents */}
        <div className="p-6">
          {activeTab === 'yard' && (
            availableCars.length === 0 ? (
              <div className="text-center py-10 text-gray-400 font-semibold text-sm">
                {language === 'en' ? 'No vehicles currently in the yard.' : 'គ្មានយានយន្តនៅក្នុងហ្គារ៉ាសឡើយ។'}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {availableCars.map(car => (
                  <div key={car.id} className="border border-gray-150 dark:border-zinc-800/80 rounded-2xl p-5 flex flex-col justify-between hover:border-blue-200 dark:hover:border-blue-900/60 hover:shadow-xs transition-all duration-200 bg-white dark:bg-zinc-900/40">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-bold text-gray-400 dark:text-zinc-500 tracking-wider uppercase font-mono">{car.plateNumber}</span>
                        <span className="text-xs bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-450 border border-emerald-100/50 dark:border-emerald-900/30 font-extrabold px-2 py-0.5 rounded-md">
                          {language === 'en' ? 'Available' : 'ទំនេរ'}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-gray-900 dark:text-zinc-100 mt-2">{car.carName}</h3>
                      <div className="mt-3.5 flex flex-wrap gap-x-3.5 gap-y-2 text-xs text-gray-400 dark:text-zinc-500 font-semibold">
                        <span className="flex items-center gap-1.5"><Fuel className="h-4 w-4 text-gray-450 dark:text-zinc-500" /> {car.fuelPercentage}%</span>
                        <span className="flex items-center gap-1.5"><Car className="h-4 w-4 text-gray-455 dark:text-zinc-500" /> {car.currentMileage.toLocaleString()} km</span>
                        <span className="flex items-center gap-1.5"><Users className="h-4 w-4 text-gray-455 dark:text-zinc-500" /> {car.seats === 'Family Car' ? (language === 'en' ? 'Family' : 'គ្រួសារ') :
                               car.seats === 'Van' ? (language === 'en' ? 'Hiace/Van' : 'វែន/Hiace') :
                               car.seats === 'Bus' ? (language === 'en' ? 'Bus' : 'ឡានក្រុង') : (car.seats || '')}</span>
                      </div>
                    </div>
                    
                    <div className="mt-5 pt-3.5 border-t border-neutral-100 dark:border-zinc-800/60 flex items-center justify-between gap-3">
                      <span className="text-sm font-extrabold text-blue-600 dark:text-blue-400">${car.dailyRentalPrice}/day</span>
                      <Link
                        href={`/rentals?rent=${car.id}`}
                        className="flex items-center gap-1 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-3xs uppercase tracking-wider hover:scale-[1.02]"
                      >
                        <Plus className="h-3.5 w-3.5" />
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
              <div className="text-center py-10 text-gray-400 font-semibold text-sm">
                {language === 'en' ? 'No vehicles currently on the road.' : 'គ្មានយានយន្តកំពុងជួលនៅលើផ្លូវឡើយ។'}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {rentedCars.map(car => {
                  const activeContract = rentals.find(r => r.status === 'Active' && r.vehicleId === car.id);
                  return (
                    <div key={car.id} className="border border-gray-155 dark:border-zinc-800/80 rounded-2xl p-5 flex flex-col justify-between hover:border-blue-200/50 dark:hover:border-blue-900/60 hover:shadow-xs transition-all duration-200 bg-white dark:bg-zinc-900/40">
                      <div>
                        <div className="flex justify-between items-start">
                          <span className="text-xs font-bold text-gray-400 dark:text-zinc-500 tracking-wider uppercase font-mono">{car.plateNumber}</span>
                          <span className="text-xs bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-450 border border-blue-100/50 dark:border-blue-900/30 font-extrabold px-2 py-0.5 rounded-md">
                            {language === 'en' ? 'On Road' : 'កំពុងជួល'}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-gray-900 dark:text-zinc-100 mt-2">{car.carName}</h3>
                        {activeContract && (
                          <div className="mt-3.5 p-3.5 bg-neutral-50 dark:bg-zinc-950/50 border border-neutral-200/50 dark:border-zinc-850 rounded-xl space-y-1.5 text-xs text-gray-500 dark:text-zinc-400 font-semibold">
                            <div className="flex justify-between">
                              <span className="text-gray-400 dark:text-zinc-500">{language === 'en' ? 'Client:' : 'អតិថិជន៖'}</span>
                              <span className="text-gray-800 dark:text-zinc-200 font-bold">{activeContract.customerName}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400 dark:text-zinc-500">{language === 'en' ? 'Return:' : 'ថ្ងៃត្រឡប់៖'}</span>
                              <span className="text-blue-600 dark:text-blue-400 font-bold">{activeContract.returnDate}</span>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-5 pt-3.5 border-t border-neutral-100 dark:border-zinc-800/60 flex items-center justify-end">
                        <Link
                          href={`/rentals?return=${car.id}`}
                          className="flex items-center gap-1 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-3xs uppercase tracking-wider hover:scale-[1.02]"
                        >
                          <ArrowRight className="h-3.5 w-3.5" />
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
              <div className="text-center py-10 text-gray-400 font-semibold text-sm">
                {language === 'en' ? 'No vehicles in the workshop.' : 'គ្មានយានយន្តនៅក្នុងរោងជាងថែទាំឡើយ។'}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {maintenanceCars.map(car => (
                  <div key={car.id} className="border border-gray-155 dark:border-zinc-800/80 rounded-2xl p-5 flex flex-col justify-between hover:border-amber-200 dark:hover:border-amber-900/60 hover:shadow-xs transition-all duration-200 bg-white dark:bg-zinc-900/40">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-bold text-gray-400 dark:text-zinc-500 tracking-wider uppercase font-mono">{car.plateNumber}</span>
                        <span className="text-xs bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-450 border border-amber-100/50 dark:border-amber-900/30 font-extrabold px-2 py-0.5 rounded-md">
                          {language === 'en' ? 'Maintenance' : 'កំពុងថែទាំ'}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-gray-900 dark:text-zinc-100 mt-2">{car.carName}</h3>
                      <div className="mt-2.5 flex items-center gap-2 text-xs text-gray-405 dark:text-zinc-500 font-semibold">
                        <Wrench className="h-4 w-4 text-gray-400 dark:text-zinc-555 shrink-0" />
                        <span>{language === 'en' ? 'Under repair / servicing' : 'កំពុងជួសជុល / ថែទាំ'}</span>
                      </div>
                    </div>
                    
                    <div className="mt-5 pt-3.5 border-t border-neutral-100 dark:border-zinc-800/60 flex items-center justify-end">
                      <button
                        onClick={() => {
                          editVehicle(car.id, { status: 'Available' });
                          alert(language === 'en' ? `${car.carName} returned to yard available.` : `${car.carName} បានយកចូលហ្គារ៉ាសវិញទំនេរ។`);
                        }}
                        className="flex items-center gap-1 px-3.5 py-2 bg-neutral-850 hover:bg-neutral-900 text-white rounded-lg text-xs font-bold transition-all shadow-3xs uppercase tracking-wider hover:scale-[1.02]"
                      >
                        <Check className="h-3.5 w-3.5" />
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
        <div className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-900 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-base lg:text-lg font-bold text-gray-900 dark:text-zinc-100 tracking-tight mb-5">{t('recentActivity')}</h2>
            
            <div className="space-y-4 font-semibold">
              {displayActivities.map((act) => (
                <div key={act.id} className="flex items-start justify-between gap-5 text-sm">
                  <div className="flex items-start gap-3.5">
                    <div className={`mt-0.5 p-2 rounded-full flex items-center justify-center shrink-0 border ${
                      act.type === 'return' ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-450 border-emerald-100 dark:border-emerald-900/30' :
                      act.type === 'gasoline' ? 'bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-450 border-blue-100 dark:border-blue-900/30' :
                      act.type === 'maintenance' ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-450 border-amber-100 dark:border-amber-900/30' :
                      'bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-450 border-purple-100 dark:border-purple-900/30'
                    }`}>
                      {act.type === 'return' && <Car className="h-4.5 w-4.5" />}
                      {act.type === 'gasoline' && <Fuel className="h-4.5 w-4.5" />}
                      {act.type === 'maintenance' && <Wrench className="h-4.5 w-4.5" />}
                      {act.type === 'rental' && <CalendarRange className="h-4.5 w-4.5" />}
                    </div>
                    <div>
                      <p className="text-gray-700 dark:text-zinc-300 leading-relaxed mt-0.5">{act.text}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 dark:text-zinc-500 font-semibold shrink-0 mt-1">
                    {act.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
 
        {/* PANEL 3: Upcoming Returns */}
        <div className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-900 rounded-2xl shadow-xs overflow-hidden flex flex-col justify-between">
          <div className="px-6 py-5 border-b border-gray-100 dark:border-zinc-900 flex items-center justify-between bg-gray-50/10 dark:bg-zinc-900/5">
            <h2 className="text-base lg:text-lg font-bold text-gray-900 dark:text-zinc-100 tracking-tight">{t('upcomingReturns')}</h2>
            <Link href="/rentals" className="px-3.5 py-2 border border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-900 text-xs font-bold text-gray-705 dark:text-zinc-300 rounded-lg transition-all shadow-2xs">
              {t('viewAll')}
            </Link>
          </div>
 
          <div className="divide-y divide-gray-100 dark:divide-zinc-900 px-6 flex-1 flex flex-col justify-center min-h-[220px]">
            {sortedActiveRentals.slice(0, 3).map((r) => {
              const car = vehicles.find(v => v.id === r.vehicleId);
              
              return (
                <div key={r.id} className="py-4 flex items-center justify-between gap-4 text-sm font-semibold">
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-9 bg-neutral-100 dark:bg-zinc-900 rounded-lg flex items-center justify-center border border-gray-150 dark:border-zinc-800 overflow-hidden shrink-0">
                      <VehicleVisual type={car?.photo || 'sedan'} className="h-7 w-9" />
                    </div>
                    <div>
                      <span className="font-bold text-gray-900 dark:text-zinc-100 block">{car?.carName}</span>
                      <span className="text-xs text-gray-400 dark:text-zinc-500 font-mono mt-0.5 block">{car?.plateNumber}</span>
                    </div>
                  </div>
 
                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <span className="text-gray-900 dark:text-zinc-100 block">{formatDateDisplay(r.returnDate)}</span>
                      <span className="text-xs text-gray-400 dark:text-zinc-500 block mt-0.5">10:00 AM</span>
                    </div>
                    {getUpcomingBadge(r.returnDate)}
                  </div>
                </div>
              );
            })}
            
            {sortedActiveRentals.length === 0 && (
              <div className="py-10 text-center text-gray-400 italic text-sm">
                {t('noRecentOps')}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
