import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { 
  defaultVehicles, 
  defaultRentals, 
  defaultExpenses, 
  defaultDrivers, 
  defaultSettings 
} from '../../../context/mockData';

// Path to the local JSON database file in the project directory
const DB_FILE = path.join(process.cwd(), 'db.json');

// Default initial state matching mockData defaults
const DEFAULT_DB = {
  vehicles: defaultVehicles,
  rentals: defaultRentals,
  expenses: defaultExpenses,
  drivers: defaultDrivers,
  currentStaff: 'Sokmean',
  settings: defaultSettings,
  language: 'en'
};

// Helper to read database safely
function readDB() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      // Seed initial data if file does not exist yet
      fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_DB, null, 2), 'utf-8');
      return DEFAULT_DB;
    }
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.error('Error reading local JSON db:', err);
    return DEFAULT_DB;
  }
}

// Helper to write database safely
function writeDB(data: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing local JSON db:', err);
    return false;
  }
}

export async function GET() {
  const db = readDB();
  return NextResponse.json(db);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    writeDB(body);
    return NextResponse.json({ status: 'success' });
  } catch (err) {
    return NextResponse.json({ status: 'error', message: String(err) }, { status: 400 });
  }
}
