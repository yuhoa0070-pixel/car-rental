import { Vehicle, Rental, Expense, Settings, Driver, Staff } from '../types';

const addDays = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
};

export const defaultSettings: Settings = {
  businessName: "SOMA Car Rentals",
  currency: "$",
  staffNames: ["Kanha", "Vuthy", "Sokmean", "Dara"]
};

export const defaultVehicles: Vehicle[] = [
  {
    id: "v-camry",
    carName: "Toyota Camry",
    plateNumber: "2AB-1234",
    photo: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=600&q=80",
    status: "Available",
    currentMileage: 28450,
    fuelPercentage: 90,
    seats: "Family Car",
    dailyRentalPrice: 50,
    lastServiceDate: addDays(-15)
  },
  {
    id: "v-civic",
    carName: "Honda Civic",
    plateNumber: "2BB-5678",
    photo: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=600&q=80",
    status: "Available",
    currentMileage: 45100,
    fuelPercentage: 85,
    seats: "Family Car",
    dailyRentalPrice: 45,
    lastServiceDate: addDays(-45)
  },
  {
    id: "v-lexus",
    carName: "Lexus NX 300",
    plateNumber: "2CC-9012",
    photo: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=600&q=80",
    status: "Available",
    currentMileage: 12500,
    fuelPercentage: 95,
    seats: "Family Car",
    dailyRentalPrice: 85,
    lastServiceDate: addDays(-20)
  },
  {
    id: "v-ranger",
    carName: "Ford Ranger",
    plateNumber: "2DD-3456",
    photo: "https://images.unsplash.com/photo-1533599904691-450f1a0f5873?auto=format&fit=crop&w=600&q=80",
    status: "Available",
    currentMileage: 14200,
    fuelPercentage: 80,
    seats: "Family Car",
    dailyRentalPrice: 75,
    lastServiceDate: addDays(-10)
  },
  {
    id: "v-prius",
    carName: "Toyota Prius",
    plateNumber: "2EE-7890",
    photo: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80",
    status: "Available",
    currentMileage: 85000,
    fuelPercentage: 100,
    seats: "Family Car",
    dailyRentalPrice: 35,
    lastServiceDate: addDays(-5)
  },
  {
    id: "v-landcruiser",
    carName: "Toyota Land Cruiser",
    plateNumber: "2FF-4321",
    photo: "https://images.unsplash.com/photo-1594568284297-7c64464062b1?auto=format&fit=crop&w=600&q=80",
    status: "Available",
    currentMileage: 32000,
    fuelPercentage: 70,
    seats: "Family Car",
    dailyRentalPrice: 120,
    lastServiceDate: addDays(-30)
  },
  {
    id: "v-cx5",
    carName: "Mazda CX-5",
    plateNumber: "2GG-8765",
    photo: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=600&q=80",
    status: "Available",
    currentMileage: 19800,
    fuelPercentage: 85,
    seats: "Family Car",
    dailyRentalPrice: 55,
    lastServiceDate: addDays(-12)
  },
  {
    id: "v-alphard",
    carName: "Toyota Alphard",
    plateNumber: "2HH-1122",
    photo: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=600&q=80",
    status: "Available",
    currentMileage: 9500,
    fuelPercentage: 90,
    seats: "Van",
    dailyRentalPrice: 110,
    lastServiceDate: addDays(-8)
  },
  {
    id: "v-modely",
    carName: "Tesla Model Y",
    plateNumber: "2II-3344",
    photo: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=600&q=80",
    status: "Available",
    currentMileage: 5400,
    fuelPercentage: 100,
    seats: "Family Car",
    dailyRentalPrice: 90,
    lastServiceDate: addDays(-25)
  },
  {
    id: "v-fortuner",
    carName: "Toyota Fortuner",
    plateNumber: "2JJ-5566",
    photo: "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=600&q=80",
    status: "Available",
    currentMileage: 25600,
    fuelPercentage: 80,
    seats: "Family Car",
    dailyRentalPrice: 65,
    lastServiceDate: addDays(-18)
  }
];

const FIRST_NAMES = ["Sok", "Chan", "Keo", "Heng", "Chea", "Rith", "Nguon", "Lim", "Seng", "Vann", "Sam", "Phan", "Noun", "Meas", "Tep", "Ouk", "Chhim", "Chheang", "Bun", "Yi", "Rotha", "Kim", "Pech", "Ros", "Sar"];
const LAST_NAMES = ["Mean", "Dara", "Piseth", "Rotha", "Bona", "Vibol", "Sothy", "Phalla", "Vannak", "Sophal", "Sarith", "Manvy", "Rithy", "Narin", "Kosal", "Seyha", "Sovereign", "Kiri", "Chamroeun", "Nisay", "Chann", "Heng", "Sophan", "Vandy", "Veasna"];
const PHONES = ["012", "010", "098", "088", "077", "099", "011", "015", "016", "085"];

const generateRandomName = (index: number) => {
  const f = FIRST_NAMES[(index + 3) % FIRST_NAMES.length];
  const l = LAST_NAMES[(index * 7) % LAST_NAMES.length];
  return `${f} ${l}`;
};

const generateRandomPhone = (index: number) => {
  const prefix = PHONES[index % PHONES.length];
  const body1 = 100 + (index * 13) % 900;
  const body2 = 1000 + (index * 29) % 9000;
  return `${prefix} ${body1} ${body2}`;
};

const generateRentals = (): Rental[] => {
  const list: Rental[] = [];
  const vehicleList = defaultVehicles;
  const staff = defaultSettings.staffNames;
  
  for (let i = 1; i <= 100; i++) {
    const vehicle = vehicleList[i % vehicleList.length];
    
    // Deterministic dates:
    // Modulo logic keeps around 5 active rentals and 95 completed history logs
    const isActive = i % 18 === 0;
    
    let startDate: string;
    let returnDate: string;
    
    if (isActive) {
      startDate = addDays(-1 - (i % 2));
      returnDate = addDays(2 + (i % 3));
    } else {
      startDate = addDays(-5 - (i % 40) - (i % 4));
      returnDate = addDays(-5 - (i % 40) + 2 + (i % 3));
    }
    
    const duration = Math.max(1, Math.ceil((new Date(returnDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)));
    
    const rental: Rental = {
      id: `r-${i}`,
      vehicleId: vehicle.id,
      customerName: generateRandomName(i),
      customerPhone: generateRandomPhone(i),
      startDate,
      returnDate,
      dailyPrice: vehicle.dailyRentalPrice,
      deposit: 50 + (i % 4) * 50,
      staffName: staff[i % staff.length],
      mileageOut: 10000 + i * 150,
      fuelOut: 80 + (i % 5) * 5,
      notes: `Trip ${i}: General operations rent.`,
      status: isActive ? 'Active' : 'Completed'
    };
    
    if (!isActive) {
      rental.returnedAt = returnDate;
      rental.mileageIn = rental.mileageOut + 80 + (i % 10) * 35;
      rental.fuelIn = rental.fuelOut - (i % 3) * 5;
      rental.damageFee = (i % 25 === 0) ? 75 : 0;
      rental.gasolineCost = (rental.fuelIn < rental.fuelOut) ? (rental.fuelOut - rental.fuelIn) * 0.5 : 0;
      rental.finalTotal = (rental.dailyPrice * duration) + (rental.damageFee || 0) + (rental.gasolineCost || 0);
    }
    
    list.push(rental);
  }
  return list;
};

export const defaultRentals = generateRentals();

// Adjust vehicles' default status to match active rentals
defaultVehicles.forEach(v => {
  const active = defaultRentals.find(r => r.vehicleId === v.id && r.status === 'Active');
  if (active) {
    v.status = 'Rented';
  } else if (v.id === 'v-civic') {
    v.status = 'Maintenance'; // Let one vehicle be in maintenance
  } else {
    v.status = 'Available';
  }
});

export const defaultExpenses: Expense[] = [
  {
    id: "e-1",
    vehicleId: "v-lexus",
    type: "Repair",
    amount: 120,
    date: addDays(-1),
    staff: "Kanha",
    note: "Maintenance completed for Lexus NX 300"
  },
  {
    id: "e-2",
    vehicleId: "v-civic",
    type: "Gasoline",
    amount: 35,
    date: addDays(-1),
    staff: "Vuthy",
    note: "Gasoline added for Honda Civic"
  },
  {
    id: "e-3",
    vehicleId: "v-ranger",
    type: "Oil Change",
    amount: 45,
    date: addDays(-3),
    staff: "Sokmean",
    note: "Scheduled oil service"
  }
];

export const defaultDrivers: Driver[] = [
  {
    id: "d-sok-sophea",
    name: "Sok Sophea",
    phone: "012-345-678",
    dailyRate: 15,
    status: "Available",
    telegram: "soksophea"
  },
  {
    id: "d-chan-dara",
    name: "Chan Dara",
    phone: "098-765-432",
    dailyRate: 20,
    status: "Available",
    telegram: "chandara"
  },
  {
    id: "d-keo-piseth",
    name: "Keo Piseth",
    phone: "088-111-222",
    dailyRate: 15,
    status: "Available",
    telegram: "keopiseth"
  },
  {
    id: "d-hang-bora",
    name: "Hang Bora",
    phone: "077-444-555",
    dailyRate: 18,
    status: "Available",
    telegram: "hangbora"
  },
  {
    id: "d-lim-veasna",
    name: "Lim Veasna",
    phone: "015-888-777",
    dailyRate: 15,
    status: "Available",
    telegram: "limveasna"
  }
];

export const defaultStaff: Staff[] = [
  {
    id: "s-sokmean",
    name: "Sokmean",
    role: "Owner",
    phone: "012-111-222",
    email: "sokmean@soma.com",
    status: "Active"
  },
  {
    id: "s-kanha",
    name: "Kanha",
    role: "Manager",
    phone: "012-345-678",
    email: "kanha@soma.com",
    status: "Active"
  },
  {
    id: "s-vuthy",
    name: "Vuthy",
    role: "Staff",
    phone: "010-234-567",
    email: "vuthy@soma.com",
    status: "Active"
  },
  {
    id: "s-dara",
    name: "Dara",
    role: "Staff",
    phone: "011-456-789",
    email: "dara@soma.com",
    status: "Active"
  }
];
