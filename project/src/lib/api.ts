// src/api.ts
import type { Patient } from './types';

/**
 * API base selection:
 * 1) import.meta.env.VITE_API_BASE (set in Netlify env at build time)
 * 2) If running in browser on a non-localhost host -> use RAILWAY_API
 * 3) Fallback to local dev backend
 */

const RAILWAY_API = 'https://clinic-pulse-production.up.railway.app/api';

// read build-time env (Vite)
const envBase =
  typeof import.meta !== 'undefined' && typeof import.meta.env !== 'undefined' && import.meta.env.VITE_API_BASE
    ? (import.meta.env.VITE_API_BASE as string)
    : '';

// helper to detect localhost
function isLocalhostHost(hostname: string) {
  if (!hostname) return false;
  return (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname.startsWith('192.168.') ||
    hostname.startsWith('10.') ||
    hostname.startsWith('172.')
  );
}

let API_BASE = '';

if (envBase) {
  API_BASE = envBase;
} else if (typeof window !== 'undefined' && window.location && !isLocalhostHost(window.location.hostname)) {
  // running on deployed domain (not localhost) -> use Railway
  API_BASE = RAILWAY_API;
} else {
  // local dev
  API_BASE = 'http://localhost:4000/api';
}

// remove trailing slash
API_BASE = API_BASE.replace(/\/+$/, '');

function apiUrl(path: string) {
  // ensure exactly one slash between base and path
  return `${API_BASE}${path.startsWith('/') ? '' : '/'}${path}`;
}

/* ---------- API functions (unchanged behavior) ---------- */

export async function getPatients(status?: string): Promise<Patient[]> {
  try {
    const url = status
      ? apiUrl(`/queue?status=${encodeURIComponent(status)}`)
      : apiUrl('/queue');

    const response = await fetch(url, { credentials: 'include' });

    if (!response.ok) {
      throw new Error(`Failed to fetch patients: ${response.status}`);
    }

    const data = await response.json();
    return data.map((patient: any) => ({
      id: patient.id,
      token_no: patient.token_number,
      name: patient.name,
      age: patient.age,
      purpose: patient.purpose,
      note: patient.notes,
      status: normalizeStatus(patient.current_status),
      created_at: patient.created_at,
    }));
  } catch (error) {
    console.error('Error fetching patients:', error);
    throw error;
  }
}

export async function createPatient(patient: {
  name: string;
  age?: number;
  purpose?: string;
  note?: string;
}): Promise<Patient> {
  const response = await fetch(apiUrl('/patients'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: patient.name,
      age: patient.age ?? null,
      purpose: patient.purpose ?? null,
      notes: patient.note ?? null,
    }),
    credentials: 'include'
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || `Failed to create patient (${response.status})`);
  }

  const data = await response.json();
  return mapPatient(data);
}

export async function startConsultation(patientId: number): Promise<Patient> {
  const response = await fetch(apiUrl(`/patients/${patientId}/start`), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include'
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || `Failed to start consultation (${response.status})`);
  }

  const data = await response.json();
  return mapPatient(data);
}

export async function markPatientDone(patientId: number): Promise<Patient> {
  const response = await fetch(apiUrl(`/patients/${patientId}/complete`), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include'
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || `Failed to mark patient as done (${response.status})`);
  }

  const data = await response.json();
  return mapPatient(data);
}

export async function cancelPatient(patientId: number): Promise<Patient> {
  const response = await fetch(apiUrl(`/patients/${patientId}/cancel`), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include'
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || `Failed to cancel patient (${response.status})`);
  }

  const data = await response.json();
  return mapPatient(data);
}

export async function getDashboardStats() {
  const response = await fetch(apiUrl('/dashboard'), { credentials: 'include' });

  if (!response.ok) {
    throw new Error(`Failed to fetch clinic stats (${response.status})`);
  }

  return response.json();
}

function mapPatient(data: any): Patient {
  return {
    id: data.id,
    token_no: data.token_number,
    name: data.name,
    age: data.age,
    purpose: data.purpose,
    note: data.notes,
    status: normalizeStatus(data.current_status),
    created_at: data.created_at,
  };
}

function normalizeStatus(backendStatus: string): 'waiting' | 'in_consultation' | 'done' | 'cancelled' {
  const statusMap: Record<string, 'waiting' | 'in_consultation' | 'done' | 'cancelled'> = {
    'Waiting': 'waiting',
    'In Consultation': 'in_consultation',
    'Completed': 'done',
    'Cancelled': 'cancelled',
  };
  return statusMap[backendStatus] || 'waiting';
}
