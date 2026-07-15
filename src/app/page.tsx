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
  Check,
  ChevronDown
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
        <span className="text-[10px] font-bold px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100/55">
          {t('daysLeft', { days: diff })}
        </span>
      );
    }
    if (diff === 1) {
      return (
        <span className="text-[10px] font-bold px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100/55">
          {t('dayLeft')}
        </span>
      );
    }
    if (diff === 0) {
      return (
        <span className="text-[10px] font-bold px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100/55">
          {t('today')}
        </span>
      );
    }
    const overdue = Math.abs(diff);
    return (
      <span className="text-[10px] font-bold px-3 py-1.5 rounded-full bg-red-50 text-red-600 border border-red-100/55">
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
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome / Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-zinc-100 tracking-tight">{t('overview')}</h1>
          <p className="text-xs text-gray-500 dark:text-zinc-400">{t('realTimeStatus')}</p>
        </div>
        
        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          <Link 
            href="/rentals" 
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
          >
            <Plus className="h-3.5 w-3.5" />
            {t('createRental')}
          </Link>
          <Link 
            href="/expenses" 
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white dark:bg-zinc-900 border border-gray-250 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-850 text-gray-700 dark:text-zinc-200 rounded-lg text-xs font-semibold shadow-2xs transition-all"
          >
            <Receipt className="h-3.5 w-3.5 text-gray-400 dark:text-zinc-500" />
            {t('logExpense')}
          </Link>
        </div>
      </div>

      {/* Financial KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Card: Total Revenue */}
        <div className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-900 rounded-xl p-5 shadow-xs bg-gradient-to-br from-white to-emerald-500/[0.02] dark:from-zinc-950 dark:to-emerald-500/[0.01]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">{t('totalRevenue')}</span>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-450 rounded-lg border border-emerald-100/50 dark:border-emerald-900/20">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-zinc-100 tracking-tight">{formatCurrency(totalRevenue)}</h3>
            <p className="text-[10px] text-gray-400 dark:text-zinc-500 mt-1 flex items-center gap-1 font-semibold">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-500 inline" /> {t('computedCompleted')}
            </p>
          </div>
        </div>

        {/* Card: Total Expenses */}
        <div className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-900 rounded-xl p-5 shadow-xs bg-gradient-to-br from-white to-red-500/[0.02] dark:from-zinc-950 dark:to-red-500/[0.01]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">{t('totalExpenses')}</span>
            <div className="p-2 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-450 rounded-lg border border-red-100/50 dark:border-red-900/20">
              <Receipt className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-zinc-100 tracking-tight">{formatCurrency(totalExpenses)}</h3>
            <p className="text-[10px] text-gray-400 dark:text-zinc-500 mt-1 font-semibold">
              {t('includesRepairs')}
            </p>
          </div>
        </div>

        {/* Card: Net Profit */}
        <div className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-900 rounded-xl p-5 shadow-xs sm:col-span-2 lg:col-span-1 bg-gradient-to-br from-white to-blue-500/[0.02] dark:from-zinc-950 dark:to-blue-500/[0.01]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">{t('netProfit')}</span>
            <div className="p-2 bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-450 rounded-lg border border-blue-100/50 dark:border-blue-900/20">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className={`text-2xl font-bold tracking-tight ${netProfit >= 0 ? 'text-gray-900 dark:text-zinc-100' : 'text-red-600'}`}>
              {formatCurrency(netProfit)}
            </h3>
            <p className="text-[10px] text-gray-400 dark:text-zinc-500 mt-1 font-semibold">
              {t('revMinusExp')}
            </p>
          </div>
        </div>
      </div>

      {/* Visual Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card: Vehicle Status Overview */}
        <div className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-900 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-900 pb-3">
            <h2 className="text-xs font-bold text-gray-900 dark:text-zinc-100 tracking-tight">
              {language === 'en' ? 'Vehicle Status Overview' : 'ស្ថានភាពយានយន្តទូទៅ'}
            </h2>
            <Link 
              href="/vehicles" 
              className="px-3 py-1 bg-gray-50 dark:bg-zinc-900 hover:bg-gray-100 dark:hover:bg-zinc-800 text-[10px] font-bold text-gray-700 dark:text-zinc-300 border border-gray-200 dark:border-zinc-850 rounded-lg transition-colors"
            >
              {t('viewAll')}
            </Link>
          </div>

          <div className="mt-5 flex items-center justify-between gap-6">
            {/* Doughnut Chart */}
            <div className="relative flex items-center justify-center h-28 w-28 shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background Track */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className="stroke-gray-100 dark:stroke-zinc-800 fill-none"
                  strokeWidth="8"
                />
                {/* Green (Available) Segment */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className="stroke-emerald-500 fill-none"
                  strokeWidth="8"
                  strokeDasharray={`${(availableCars.length / fleetTotal) * 251.32} 251.32`}
                  strokeDashoffset="0"
                />
                {/* Blue (Rented) Segment */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className="stroke-blue-600 fill-none"
                  strokeWidth="8"
                  strokeDasharray={`${(rentedCars.length / fleetTotal) * 251.32} 251.32`}
                  strokeDashoffset={`${-((availableCars.length / fleetTotal) * 251.32)}`}
                />
                {/* Orange (Maintenance) Segment */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className="stroke-amber-500 fill-none"
                  strokeWidth="8"
                  strokeDasharray={`${(maintenanceCars.length / fleetTotal) * 251.32} 251.32`}
                  strokeDashoffset={`${-(((availableCars.length + rentedCars.length) / fleetTotal) * 251.32)}`}
                />
              </svg>
              <div className="absolute text-center flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-gray-900 dark:text-zinc-100 block tracking-tight leading-none">{vehicles.length}</span>
                <span className="text-[9px] font-medium text-gray-400 dark:text-zinc-550 block mt-1 leading-none">
                  {language === 'en' ? 'Vehicles' : 'យានយន្ត'}
                </span>
              </div>
            </div>

            {/* Sliced Legend List */}
            <div className="flex-1 divide-y divide-gray-100 dark:divide-zinc-900 text-xs font-semibold text-gray-700 dark:text-zinc-350 font-mono">
              <div className="pb-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                  <span className="font-sans font-semibold text-gray-600 dark:text-zinc-400">{t('available')}</span>
                </div>
                <span className="font-bold text-gray-900 dark:text-zinc-100">
                  {availableCars.length} ({Math.round((availableCars.length / fleetTotal) * 100)}%)
                </span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0" />
                  <span className="font-sans font-semibold text-gray-600 dark:text-zinc-400">{t('rented')}</span>
                </div>
                <span className="font-bold text-gray-900 dark:text-zinc-100">
                  {rentedCars.length} ({Math.round((rentedCars.length / fleetTotal) * 100)}%)
                </span>
              </div>
              <div className="pt-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                  <span className="font-sans font-semibold text-gray-600 dark:text-zinc-400">{t('maintenance')}</span>
                </div>
                <span className="font-bold text-gray-900 dark:text-zinc-100">
                  {maintenanceCars.length} ({Math.round((maintenanceCars.length / fleetTotal) * 100)}%)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Card: Income vs Expenses Chart */}
        <div className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-900 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-900 pb-3">
            <h2 className="text-xs font-bold text-gray-900 dark:text-zinc-100 tracking-tight">
              {language === 'en' ? 'Income vs Expenses' : 'ប្រាក់ចំណូល និង ការចំណាយ'}
            </h2>
            {/* Dropdown Filter */}
            <div className="relative">
              <button
                className="px-2.5 py-1 bg-gray-50 dark:bg-zinc-900 hover:bg-gray-100 dark:hover:bg-zinc-800 text-[10px] font-bold text-gray-700 dark:text-zinc-300 border border-gray-200 dark:border-zinc-850 rounded-lg flex items-center gap-1 transition-colors"
              >
                <span>{language === 'en' ? 'This Week' : 'សប្តាហ៍នេះ'}</span>
                <ChevronDown className="h-3 w-3 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-3 flex items-center justify-center gap-4 text-[10px] font-bold text-gray-500 dark:text-zinc-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
              <span>{language === 'en' ? 'Income' : 'ចំណូល'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-red-500" />
              <span>{language === 'en' ? 'Expenses' : 'ចំណាយ'}</span>
            </div>
          </div>

          {/* Chart Bars Grid */}
          <div className="mt-5 flex items-end justify-between h-36 relative pt-4 text-[10px] font-semibold text-gray-400 dark:text-zinc-550">
            {/* Background Y-Axis lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pr-8">
              <div className="border-b border-gray-100 dark:border-zinc-900/60 w-full" />
              <div className="border-b border-gray-100 dark:border-zinc-900/60 w-full" />
              <div className="border-b border-gray-100 dark:border-zinc-900/60 w-full" />
              <div className="border-b border-gray-100 dark:border-zinc-900/60 w-full" />
              <div className="border-b border-gray-200 dark:border-zinc-855 w-full" />
            </div>

            {/* Left Y-Axis labels */}
            <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between pointer-events-none text-[9px]">
              <span>$4K</span>
              <span>$3K</span>
              <span>$2K</span>
              <span>$1K</span>
              <span>$0</span>
            </div>

            {/* Bars columns container */}
            <div className="flex-1 flex justify-between items-end pl-8 h-full">
              {[
                { day: language === 'en' ? 'Mon' : 'ចន្ទ', inc: 2.7, exp: 1.4 },
                { day: language === 'en' ? 'Tue' : 'អង្គារ', inc: 2.5, exp: 1.4 },
                { day: language === 'en' ? 'Wed' : 'ពុធ', inc: 3.4, exp: 1.8 },
                { day: language === 'en' ? 'Thu' : 'ព្រហ', inc: 3.6, exp: 1.5 },
                { day: language === 'en' ? 'Fri' : 'សុក្រ', inc: 3.0, exp: 1.6 },
                { day: language === 'en' ? 'Sat' : 'សៅរ៍', inc: 2.8, exp: 1.5 },
                { day: language === 'en' ? 'Sun' : 'អាទិត្យ', inc: 1.7, exp: 0.7 }
              ].map((d, index) => (
                <div key={index} className="flex flex-col items-center gap-1 h-full justify-end w-10 z-10">
                  {/* Visual Bars */}
                  <div className="flex items-end gap-1 h-24">
                    {/* Income bar */}
                    <div 
                      style={{ height: `${(d.inc / 4) * 100}%` }}
                      className="w-2.5 bg-emerald-500 rounded-t-sm hover:opacity-90 transition-opacity"
                      title={`Income: $${d.inc * 1000}`}
                    />
                    {/* Expense bar */}
                    <div 
                      style={{ height: `${(d.exp / 4) * 100}%` }}
                      className="w-2.5 bg-red-500 rounded-t-sm hover:opacity-90 transition-opacity"
                      title={`Expense: $${d.exp * 1000}`}
                    />
                  </div>
                  {/* Label */}
                  <span className="text-[10px] text-gray-500 dark:text-zinc-400 mt-1">{d.day}</span>
                </div>
              ))}
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
          <div className="flex bg-neutral-100 dark:bg-zinc-900 p-0.5 rounded-lg text-[10px] font-semibold text-gray-550 shrink-0 self-start sm:self-center border border-neutral-200/20 dark:border-zinc-800/40">
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
              <div className="text-center py-8 text-gray-400 font-semibold text-xs">
                {language === 'en' ? 'No vehicles currently in the yard.' : 'គ្មានយានយន្តនៅក្នុងហ្គារ៉ាសឡើយ។'}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableCars.map(car => (
                  <div key={car.id} className="border border-gray-200 dark:border-zinc-850 rounded-xl p-4 flex flex-col justify-between hover:border-blue-100 dark:hover:border-blue-900/30 transition-colors shadow-3xs bg-white dark:bg-zinc-900/40">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 tracking-wider uppercase font-mono">{car.plateNumber}</span>
                        <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-450 border border-emerald-100/50 dark:border-emerald-900/30 font-bold px-1.5 py-0.5 rounded-md">
                          {language === 'en' ? 'Available' : 'ទំនេរ'}
                        </span>
                      </div>
                      <h3 className="text-xs font-bold text-gray-900 dark:text-zinc-100 mt-1">{car.carName}</h3>
                      <div className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1.5 text-[9px] text-gray-405 dark:text-zinc-500 font-semibold">
                        <span className="flex items-center gap-1"><Fuel className="h-3.5 w-3.5 text-gray-400 dark:text-zinc-500" /> {car.fuelPercentage}%</span>
                        <span className="flex items-center gap-1"><Car className="h-3.5 w-3.5 text-gray-400 dark:text-zinc-500" /> {car.currentMileage.toLocaleString()} km</span>
                        <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5 text-gray-400 dark:text-zinc-500" /> {car.seats === 'Family Car' ? (language === 'en' ? 'Family' : 'គ្រួសារ') :
                               car.seats === 'Van' ? (language === 'en' ? 'Hiace/Van' : 'វែន/Hiace') :
                               car.seats === 'Bus' ? (language === 'en' ? 'Bus' : 'ឡានក្រុង') : (car.seats || '')}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-zinc-800/60 flex items-center justify-between gap-2">
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
              <div className="text-center py-8 text-gray-400 font-semibold text-xs">
                {language === 'en' ? 'No vehicles currently on the road.' : 'គ្មានយានយន្តកំពុងជួលនៅលើផ្លូវឡើយ។'}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {rentedCars.map(car => {
                  const activeContract = rentals.find(r => r.status === 'Active' && r.vehicleId === car.id);
                  return (
                    <div key={car.id} className="border border-gray-200 dark:border-zinc-850 rounded-xl p-4 flex flex-col justify-between hover:border-blue-100/50 dark:hover:border-blue-900/30 transition-colors shadow-3xs bg-white dark:bg-zinc-900/40">
                      <div>
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 tracking-wider uppercase font-mono">{car.plateNumber}</span>
                          <span className="text-[10px] bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-450 border border-blue-100/50 dark:border-blue-900/30 font-bold px-1.5 py-0.5 rounded-md">
                            {language === 'en' ? 'On Road' : 'កំពុងជួល'}
                          </span>
                        </div>
                        <h3 className="text-xs font-bold text-gray-900 dark:text-zinc-100 mt-1">{car.carName}</h3>
                        {activeContract && (
                          <div className="mt-2.5 p-2.5 bg-neutral-50 dark:bg-zinc-950/50 border border-neutral-100 dark:border-zinc-800/80 rounded-lg space-y-1 text-[9px] text-gray-500 dark:text-zinc-400 font-semibold">
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
                      
                      <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-zinc-800/60 flex items-center justify-end">
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
              <div className="text-center py-8 text-gray-400 font-semibold text-xs">
                {language === 'en' ? 'No vehicles in the workshop.' : 'គ្មានយានយន្តនៅក្នុងរោងជាងថែទាំឡើយ។'}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {maintenanceCars.map(car => (
                  <div key={car.id} className="border border-gray-200 dark:border-zinc-850 rounded-xl p-4 flex flex-col justify-between hover:border-amber-100 dark:hover:border-amber-900/30 transition-colors shadow-3xs bg-white dark:bg-zinc-900/40">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 tracking-wider uppercase font-mono">{car.plateNumber}</span>
                        <span className="text-[10px] bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-450 border border-amber-100/50 dark:border-amber-900/30 font-bold px-1.5 py-0.5 rounded-md">
                          {language === 'en' ? 'Maintenance' : 'កំពុងថែទាំ'}
                        </span>
                      </div>
                      <h3 className="text-xs font-bold text-gray-900 dark:text-zinc-100 mt-1">{car.carName}</h3>
                      <div className="mt-2 flex items-center gap-1.5 text-[9px] text-gray-400 dark:text-zinc-500 font-semibold">
                        <Wrench className="h-3.5 w-3.5 text-gray-400 dark:text-zinc-500 shrink-0" />
                        <span>{language === 'en' ? 'Under repair / servicing' : 'កំពុងជួសជុល / ថែទាំ'}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-zinc-800/60 flex items-center justify-end">
                      <button
                        onClick={() => {
                          editVehicle(car.id, { status: 'Available' });
                          alert(language === 'en' ? `${car.carName} returned to yard available.` : `${car.carName} បានយកចូលហ្គារ៉ាសវិញទំនេរ។`);
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-900 text-white rounded-lg text-[10px] font-bold transition-all shadow-3xs uppercase tracking-wider"
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
        <div className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-900 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-gray-900 dark:text-zinc-100 tracking-tight mb-4">{t('recentActivity')}</h2>
            
            <div className="space-y-4 font-medium">
              {displayActivities.map((act) => (
                <div key={act.id} className="flex items-start justify-between gap-4 text-xs">
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 p-2 rounded-full flex items-center justify-center shrink-0 border ${
                      act.type === 'return' ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-450 border-emerald-100 dark:border-emerald-900/30' :
                      act.type === 'gasoline' ? 'bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-450 border-blue-100 dark:border-blue-900/30' :
                      act.type === 'maintenance' ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-450 border-amber-100 dark:border-amber-900/30' :
                      'bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-450 border-purple-100 dark:border-purple-900/30'
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
 
          <div className="divide-y divide-gray-100 dark:divide-zinc-900 px-5 flex-1 flex flex-col justify-start py-2 min-h-[200px]">
            {sortedActiveRentals.slice(0, 3).map((r) => {
              const car = vehicles.find(v => v.id === r.vehicleId);
              
              return (
                <div key={r.id} className="py-3 flex items-center justify-between gap-4 text-xs font-medium">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-8 bg-neutral-100 dark:bg-zinc-900 rounded-lg flex items-center justify-center border border-gray-200 dark:border-zinc-800 overflow-hidden shrink-0">
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
