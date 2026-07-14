import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { 
  defaultVehicles, 
  defaultRentals, 
  defaultExpenses, 
  defaultDrivers, 
  defaultSettings 
} from '../../../context/mockData';

const DB_FILE = path.join(process.cwd(), 'db.json');

const DEFAULT_DB = {
  vehicles: defaultVehicles,
  rentals: defaultRentals,
  expenses: defaultExpenses,
  drivers: defaultDrivers,
  currentStaff: 'Sokmean',
  settings: defaultSettings,
  language: 'en'
};

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

// Local DB fallback helper
function readLocalDB() {
  try {
    if (!fs.existsSync(DB_FILE)) {
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

function writeLocalDB(data: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing local JSON db:', err);
    return false;
  }
}

// GET Handler
export async function GET() {
  if (!supabase) {
    console.log('Supabase client not initialized. Falling back to local db.json');
    const db = readLocalDB();
    return NextResponse.json(db);
  }

  try {
    const { data, error } = await supabase
      .from('garage_store')
      .select('data')
      .eq('key', 'db_state')
      .single();

    if (error) {
      console.error('Supabase query error, falling back to local:', error);
      const db = readLocalDB();
      return NextResponse.json(db);
    }

    // If row is found but data object is empty, seed with initial dataset
    if (!data || !data.data || Object.keys(data.data).length === 0) {
      console.log('Supabase store is empty. Seeding default data...');
      await supabase
        .from('garage_store')
        .upsert({ key: 'db_state', data: DEFAULT_DB });
      return NextResponse.json(DEFAULT_DB);
    }

    return NextResponse.json(data.data);
  } catch (err) {
    console.error('Failed to query Supabase database:', err);
    const db = readLocalDB();
    return NextResponse.json(db);
  }
}

// POST Handler
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!supabase) {
      writeLocalDB(body);
      return NextResponse.json({ status: 'success', source: 'local' });
    }

    const { error } = await supabase
      .from('garage_store')
      .upsert({ 
        key: 'db_state', 
        data: body,
        updated_at: new Date().toISOString()
      });

    if (error) {
      console.error('Supabase save error, writing to local fallback:', error);
      writeLocalDB(body);
      return NextResponse.json({ status: 'success', source: 'local_fallback', error: error.message });
    }

    return NextResponse.json({ status: 'success', source: 'supabase' });
  } catch (err) {
    return NextResponse.json({ status: 'error', message: String(err) }, { status: 400 });
  }
}
