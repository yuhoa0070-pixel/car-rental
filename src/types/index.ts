export interface Vehicle {
  id: string;
  carName: string;
  plateNumber: string;
  photo: string; // Data URL or descriptive base64/SVG string
  status: 'Available' | 'Rented' | 'Maintenance';
  currentMileage: number;
  fuelPercentage: number;
  seats?: string;
  dailyRentalPrice: number;
  lastServiceDate: string; // YYYY-MM-DD
}

export interface Rental {
  id: string;
  vehicleId: string;
  customerName: string;
  customerPhone: string;
  startDate: string; // YYYY-MM-DD
  returnDate: string; // YYYY-MM-DD
  dailyPrice: number;
  deposit: number;
  staffName: string;
  mileageOut: number;
  fuelOut: number;
  notes: string;
  status: 'Active' | 'Completed';
  destinationProvince?: string;
  tripSurcharge?: number;
  
  // Driver properties
  driverId?: string;
  driverRate?: number;
  
  // Return fields
  returnedAt?: string; // YYYY-MM-DD
  mileageIn?: number;
  fuelIn?: number;
  gasolineCost?: number;
  damageFee?: number;
  cleaningFee?: number;
  lateFee?: number;
  maintenanceNote?: string;
  finalTotal?: number;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  dailyRate: number;
  status: 'Available' | 'Assigned' | 'Off-duty';
  telegram?: string;
}

export interface Expense {
  id: string;
  vehicleId: string; // linked vehicle ID
  type: 'Gasoline' | 'Repair' | 'Insurance' | 'Car Wash' | 'Oil Change' | 'Other';
  amount: number;
  date: string; // YYYY-MM-DD
  staff: string;
  note: string;
}

export interface Settings {
  businessName: string;
  currency: string;
  staffNames: string[];
}

export interface Staff {
  id: string;
  name: string;
  role: 'Owner' | 'Manager' | 'Staff';
  phone: string;
  email: string;
  status: 'Active' | 'Inactive';
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}
