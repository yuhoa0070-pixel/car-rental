"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Vehicle, Rental, Expense, Settings, Toast, Driver } from '../types';
import { defaultSettings, defaultVehicles, defaultRentals, defaultExpenses, defaultDrivers } from './mockData';
import { translations, Language } from './translations';

interface AppContextType {
  vehicles: Vehicle[];
  rentals: Rental[];
  expenses: Expense[];
  settings: Settings;
  toasts: Toast[];
  drivers: Driver[];
  currentStaff: string;
  isLoaded: boolean;
  language: Language;
  setLanguage: (lang: Language) => void;
  setCurrentStaff: (name: string) => void;
  t: (key: keyof typeof translations['en'], params?: Record<string, string | number>) => string;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  
  // Actions
  addVehicle: (vehicle: Omit<Vehicle, 'id'>) => void;
  editVehicle: (id: string, vehicle: Partial<Vehicle>) => void;
  deleteVehicle: (id: string) => void;
  
  startRental: (rental: Omit<Rental, 'id' | 'status'>) => void;
  returnRental: (id: string, returnData: {
    mileageIn: number;
    fuelIn: number;
    gasolineCost: number;
    damageFee: number;
    cleaningFee: number;
    lateFee: number;
    maintenanceNote: string;
    nextStatus: 'Available' | 'Maintenance';
  }) => void;
  
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  deleteExpense: (id: string) => void;
  
  addDriver: (driver: Omit<Driver, 'id'>) => void;
  editDriver: (id: string, driver: Partial<Driver>) => void;
  deleteDriver: (id: string) => void;
  
  updateSettings: (settings: Settings) => void;
  resetDemoData: () => void;
  
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
  dismissToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [currentStaff, setCurrentStaffState] = useState<string>('Sokmean');
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [language, setLanguageState] = useState<Language>('en');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Load initial data on mount (prefers localStorage first, falls back to Backend API)
  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem('cra_theme') as 'light' | 'dark' | null;
      if (storedTheme) {
        setTheme(storedTheme);
        if (storedTheme === 'dark') {
          document.documentElement.classList.add('dark');
        }
      } else if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('dark');
        document.documentElement.classList.add('dark');
      }

      const storedAuth = localStorage.getItem('cra_auth');
      if (storedAuth === 'true') {
        setIsAuthenticated(true);
      }

      const storedVehicles = localStorage.getItem('cra_vehicles');
      const storedRentals = localStorage.getItem('cra_rentals');
      const storedExpenses = localStorage.getItem('cra_expenses');
      const storedSettings = localStorage.getItem('cra_settings');
      const storedLanguage = localStorage.getItem('cra_language');
      const storedDrivers = localStorage.getItem('cra_drivers');
      const storedCurrentStaff = localStorage.getItem('cra_current_staff');

      // If we have saved data in localStorage, initialize with it immediately!
      if (storedVehicles && storedRentals && storedExpenses && storedSettings && storedDrivers) {
        setVehicles(JSON.parse(storedVehicles));
        setRentals(JSON.parse(storedRentals));
        setExpenses(JSON.parse(storedExpenses));
        setSettings(JSON.parse(storedSettings));
        setDrivers(JSON.parse(storedDrivers));
        if (storedCurrentStaff) setCurrentStaffState(storedCurrentStaff);
        if (storedLanguage === 'en' || storedLanguage === 'km') setLanguageState(storedLanguage as Language);
        setIsLoaded(true);
        return;
      }
    } catch (e) {
      console.error("Failed to load initial localStorage state:", e);
    }

    // Fallback: Fetch from backend API
    const loadFromBackend = async () => {
      try {
        const res = await fetch('/api/data');
        if (res.ok) {
          const data = await res.json();
          if (data && typeof data === 'object') {
            if (Array.isArray(data.vehicles)) {
              setVehicles(data.vehicles);
              localStorage.setItem('cra_vehicles', JSON.stringify(data.vehicles));
            }
            if (Array.isArray(data.rentals)) {
              setRentals(data.rentals);
              localStorage.setItem('cra_rentals', JSON.stringify(data.rentals));
            }
            if (Array.isArray(data.expenses)) {
              setExpenses(data.expenses);
              localStorage.setItem('cra_expenses', JSON.stringify(data.expenses));
            }
            if (Array.isArray(data.drivers)) {
              setDrivers(data.drivers);
              localStorage.setItem('cra_drivers', JSON.stringify(data.drivers));
            }
            if (data.settings) {
              setSettings(data.settings);
              localStorage.setItem('cra_settings', JSON.stringify(data.settings));
            }
            if (data.currentStaff) {
              setCurrentStaffState(data.currentStaff);
              localStorage.setItem('cra_current_staff', data.currentStaff);
            }
            if (data.language) {
              setLanguageState(data.language);
              localStorage.setItem('cra_language', data.language);
            }
          }
        }
      } catch (err) {
        console.error("Backend fetch failed, using default mock data:", err);
        setVehicles(defaultVehicles);
        setRentals(defaultRentals);
        setExpenses(defaultExpenses);
        setSettings(defaultSettings);
        setDrivers(defaultDrivers);
      } finally {
        setIsLoaded(true);
      }
    };

    loadFromBackend();
  }, []);

  // Sync state to Backend on change
  useEffect(() => {
    if (!isLoaded) return;

    const syncToBackend = async () => {
      try {
        await fetch('/api/data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            vehicles,
            rentals,
            expenses,
            drivers,
            currentStaff,
            settings,
            language
          })
        });
      } catch (err) {
        console.error("Failed to sync state to backend API:", err);
      }
    };

    syncToBackend();
  }, [vehicles, rentals, expenses, drivers, currentStaff, settings, language, isLoaded]);

  // Save changes helper (maintains local storage backup)
  const saveState = (key: string, data: any) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(data));
    }
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    saveState('cra_language', lang);
  };

  // Translation helper
  const t = (key: keyof typeof translations['en'], params?: Record<string, string | number>) => {
    const langObj = translations[language] || translations['en'];
    let text = langObj[key] || translations['en'][key] || String(key);
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, String(v));
      });
    }
    return text;
  };

  // Toast notifications
  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto dismiss after 3 seconds
    setTimeout(() => {
      dismissToast(id);
    }, 3000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter(t => t.id !== id));
  };

  // Auth actions
  const login = (emailInput: string, passwordInput: string): boolean => {
    if (emailInput.toLowerCase() === 'admin@garage.com' && passwordInput === 'admin') {
      setIsAuthenticated(true);
      localStorage.setItem('cra_auth', 'true');
      showToast(language === 'en' ? "Welcome back, Administrator!" : "សូមស្វាគមន៍ត្រឡប់មកវិញ អភិបាល!", 'success');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('cra_auth');
    showToast(language === 'en' ? "Signed out successfully" : "បានចាកចេញដោយជោគជ័យ", 'info');
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('cra_theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    showToast(
      newTheme === 'dark' 
        ? (language === 'en' ? 'Dark mode enabled' : 'បានបើក មុខងារងងឹត') 
        : (language === 'en' ? 'Light mode enabled' : 'បានបើក មុខងារពន្លឺ'), 
      'info'
    );
  };

  // Vehicles actions
  const addVehicle = (vehicleData: Omit<Vehicle, 'id'>) => {
    const newVehicle: Vehicle = {
      ...vehicleData,
      id: 'v-' + Math.random().toString(36).substring(2, 9)
    };
    const updated = [newVehicle, ...vehicles];
    setVehicles(updated);
    saveState('cra_vehicles', updated);
    showToast(language === 'en' ? `Vehicle ${newVehicle.carName} added successfully` : `យានយន្ត ${newVehicle.carName} ត្រូវបានបន្ថែមដោយជោគជ័យ`, 'success');
  };

  const editVehicle = (id: string, vehicleData: Partial<Vehicle>) => {
    const updated = vehicles.map(v => v.id === id ? { ...v, ...vehicleData } : v);
    setVehicles(updated);
    saveState('cra_vehicles', updated);
    showToast(language === 'en' ? `Vehicle changes saved` : `ការផ្លាស់ប្តូរយានយន្តត្រូវបានរក្សាទុក`, 'success');
  };

  const deleteVehicle = (id: string) => {
    const vName = vehicles.find(v => v.id === id)?.carName || "Vehicle";
    const updated = vehicles.filter(v => v.id !== id);
    setVehicles(updated);
    saveState('cra_vehicles', updated);
    showToast(language === 'en' ? `${vName} has been deleted` : `${vName} ត្រូវបានលុបចោល`, 'info');
  };

  // Rentals actions
  const startRental = (rentalData: Omit<Rental, 'id' | 'status'>) => {
    const newRental: Rental = {
      ...rentalData,
      id: 'r-' + Math.random().toString(36).substring(2, 9),
      status: 'Active'
    };
    
    // Update vehicle status to Rented
    const updatedVehicles = vehicles.map(v => 
      v.id === rentalData.vehicleId ? { ...v, status: 'Rented' as const } : v
    );

    // If driver is selected, update driver status to Assigned
    let updatedDrivers = [...drivers];
    if (rentalData.driverId) {
      updatedDrivers = drivers.map(d => 
        d.id === rentalData.driverId ? { ...d, status: 'Assigned' as const } : d
      );
    }
    
    const updatedRentals = [newRental, ...rentals];
    
    setVehicles(updatedVehicles);
    setRentals(updatedRentals);
    setDrivers(updatedDrivers);
    
    saveState('cra_vehicles', updatedVehicles);
    saveState('cra_rentals', updatedRentals);
    saveState('cra_drivers', updatedDrivers);
    
    showToast(language === 'en' ? `Rental started for ${rentalData.customerName}` : `ការជួលបានចាប់ផ្តើមសម្រាប់អតិថិជន ${rentalData.customerName}`, 'success');
  };

  const returnRental = (id: string, returnData: {
    mileageIn: number;
    fuelIn: number;
    gasolineCost: number;
    damageFee: number;
    cleaningFee: number;
    lateFee: number;
    maintenanceNote: string;
    nextStatus: 'Available' | 'Maintenance';
  }) => {
    const rental = rentals.find(r => r.id === id);
    if (!rental) return;

    // Calculate final total: (daily price * days) + (driver rate * days) + gasolineCost + damageFee + cleaningFee + lateFee
    const dStart = new Date(rental.startDate);
    const dReturn = new Date(rental.returnDate);
    const timeDiff = Math.max(dReturn.getTime() - dStart.getTime(), 0);
    const days = Math.max(Math.ceil(timeDiff / (1000 * 3600 * 24)), 1); // Minimum 1 day
    
    const baseCost = rental.dailyPrice * days;
    const driverCost = rental.driverRate ? rental.driverRate * days : 0;
    const finalTotal = baseCost + driverCost + (rental.tripSurcharge || 0) + returnData.gasolineCost + returnData.damageFee + returnData.cleaningFee + returnData.lateFee;

    const updatedRentals = rentals.map(r => {
      if (r.id === id) {
        return {
          ...r,
          status: 'Completed' as const,
          returnedAt: new Date().toISOString().split('T')[0],
          mileageIn: returnData.mileageIn,
          fuelIn: returnData.fuelIn,
          gasolineCost: returnData.gasolineCost,
          damageFee: returnData.damageFee,
          cleaningFee: returnData.cleaningFee,
          lateFee: returnData.lateFee,
          maintenanceNote: returnData.maintenanceNote,
          finalTotal
        };
      }
      return r;
    });

    // Update vehicle details: status, fuel, mileage, and service date if maintenance note is added
    const updatedVehicles = vehicles.map(v => {
      if (v.id === rental.vehicleId) {
        return {
          ...v,
          status: returnData.nextStatus,
          currentMileage: returnData.mileageIn,
          fuelPercentage: returnData.fuelIn,
          lastServiceDate: returnData.nextStatus === 'Maintenance' 
            ? new Date().toISOString().split('T')[0] 
            : v.lastServiceDate
        };
      }
      return v;
    });

    // Free up driver status to Available
    let updatedDrivers = [...drivers];
    if (rental.driverId) {
      updatedDrivers = drivers.map(d => 
        d.id === rental.driverId ? { ...d, status: 'Available' as const } : d
      );
    }

    // If there were any extra costs like gasolineCost, damageFee, or cleaningFee that are repairs/maintenance,
    // we automatically log them as expenses
    let updatedExpenses = [...expenses];
    if (returnData.damageFee > 0 || returnData.gasolineCost > 0) {
      if (returnData.gasolineCost > 0) {
        updatedExpenses.push({
          id: 'e-' + Math.random().toString(36).substring(2, 9),
          vehicleId: rental.vehicleId,
          type: 'Gasoline',
          amount: returnData.gasolineCost,
          date: new Date().toISOString().split('T')[0],
          staff: rental.staffName,
          note: `Refuel expense for vehicle return (Rental ${rental.id})`
        });
      }
      if (returnData.damageFee > 0) {
        updatedExpenses.push({
          id: 'e-' + Math.random().toString(36).substring(2, 9),
          vehicleId: rental.vehicleId,
          type: 'Repair',
          amount: returnData.damageFee,
          date: new Date().toISOString().split('T')[0],
          staff: rental.staffName,
          note: `Damage repair allocation from return (Rental ${rental.id}): ${returnData.maintenanceNote}`
        });
      }
    }

    setRentals(updatedRentals);
    setVehicles(updatedVehicles);
    setExpenses(updatedExpenses);
    setDrivers(updatedDrivers);

    saveState('cra_rentals', updatedRentals);
    saveState('cra_vehicles', updatedVehicles);
    saveState('cra_expenses', updatedExpenses);
    saveState('cra_drivers', updatedDrivers);

    showToast(language === 'en' 
      ? `Vehicle returned successfully. Total due: ${settings.currency}${finalTotal}`
      : `ការប្រគល់យានយន្តបានជោគជ័យ។ ទឹកប្រាក់សរុប៖ ${settings.currency}${finalTotal}`, 'success');
  };

  // Expenses actions
  const addExpense = (expenseData: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expenseData,
      id: 'e-' + Math.random().toString(36).substring(2, 9)
    };
    const updated = [newExpense, ...expenses];
    setExpenses(updated);
    saveState('cra_expenses', updated);
    
    showToast(language === 'en' 
      ? `Expense of ${settings.currency}${expenseData.amount} added`
      : `ការចំណាយចំនួន ${settings.currency}${expenseData.amount} ត្រូវបានកត់ត្រាទុក`, 'success');
  };

  const deleteExpense = (id: string) => {
    const updated = expenses.filter(e => e.id !== id);
    setExpenses(updated);
    saveState('cra_expenses', updated);
    showToast(language === 'en' ? `Expense deleted` : `ការចំណាយត្រូវបានលុបចោល`, 'info');
  };

  // Drivers Actions
  const addDriver = (driverData: Omit<Driver, 'id'>) => {
    const newDriver: Driver = {
      ...driverData,
      id: 'd-' + Math.random().toString(36).substring(2, 9)
    };
    const updated = [newDriver, ...drivers];
    setDrivers(updated);
    saveState('cra_drivers', updated);
    showToast(language === 'en' ? `Driver ${newDriver.name} registered` : `អ្នកបើកបរ ${newDriver.name} ត្រូវបានចុះឈ្មោះរួចរាល់`, 'success');
  };

  const editDriver = (id: string, driverData: Partial<Driver>) => {
    const updated = drivers.map(d => d.id === id ? { ...d, ...driverData } : d);
    setDrivers(updated);
    saveState('cra_drivers', updated);
    showToast(language === 'en' ? "Driver details saved" : "ព័ត៌មានអ្នកបើកបរត្រូវបានរក្សាទុក", 'success');
  };

  const deleteDriver = (id: string) => {
    const dName = drivers.find(d => d.id === id)?.name || "Driver";
    const updated = drivers.filter(d => d.id !== id);
    setDrivers(updated);
    saveState('cra_drivers', updated);
    showToast(language === 'en' ? `Driver ${dName} deleted` : `អ្នកបើកបរ ${dName} ត្រូវបានលុបចេញ`, 'info');
  };

  // Current Staff Selector
  const setCurrentStaff = (name: string) => {
    setCurrentStaffState(name);
    saveState('cra_current_staff', name);
    showToast(language === 'en' ? `Logged in as ${name}` : `បានចូលប្រើប្រាស់ជា ${name}`, 'info');
  };

  // Settings actions
  const updateSettings = (newSettings: Settings) => {
    setSettings(newSettings);
    saveState('cra_settings', newSettings);
    showToast(language === 'en' ? "Settings updated successfully" : "ការកំណត់ត្រូវបានរក្សាទុកដោយជោគជ័យ", 'success');
  };

  const resetDemoData = () => {
    setVehicles(defaultVehicles);
    setRentals(defaultRentals);
    setExpenses(defaultExpenses);
    setSettings(defaultSettings);
    setDrivers(defaultDrivers);
    setCurrentStaffState('Sokmean');
    
    saveState('cra_vehicles', defaultVehicles);
    saveState('cra_rentals', defaultRentals);
    saveState('cra_expenses', defaultExpenses);
    saveState('cra_settings', defaultSettings);
    saveState('cra_drivers', defaultDrivers);
    saveState('cra_current_staff', 'Sokmean');
    
    showToast(language === 'en' ? "Application reset to demo data" : "ទិន្នន័យត្រូវបានកំណត់ឡើងវិញទៅលំនាំដើម", 'info');
  };

  return (
    <AppContext.Provider value={{
      vehicles,
      rentals,
      expenses,
      settings,
      toasts,
      drivers,
      currentStaff,
      isLoaded,
      language,
      setLanguage,
      setCurrentStaff,
      t,
      isAuthenticated,
      login,
      logout,
      theme,
      toggleTheme,
      addVehicle,
      editVehicle,
      deleteVehicle,
      startRental,
      returnRental,
      addExpense,
      deleteExpense,
      addDriver,
      editDriver,
      deleteDriver,
      updateSettings,
      resetDemoData,
      showToast,
      dismissToast
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppContextProvider');
  }
  return context;
};
