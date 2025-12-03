import type { Patient } from './types';

const API_BASE = 'https://clinic-pulse.onrender.com';

export async function getPatients(status?: string): Promise<Patient[]> {
  try {
    const url = status 
      ? `${API_BASE}/queue?status=${encodeURIComponent(status)}`
      : `${API_BASE}/queue`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch patients');
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
  const response = await fetch(`${API_BASE}/patients`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: patient.name,
      age: patient.age || null,
      purpose: patient.purpose || null,
      notes: patient.note || null,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create patient');
  }

  const data = await response.json();
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

export async function startConsultation(patientId: number): Promise<Patient> {
  const response = await fetch(`${API_BASE}/patients/${patientId}/start`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to start consultation');
  }

  const data = await response.json();
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

export async function markPatientDone(patientId: number): Promise<Patient> {
  const response = await fetch(`${API_BASE}/patients/${patientId}/complete`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to mark patient as done');
  }

  const data = await response.json();
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

export async function cancelPatient(patientId: number): Promise<Patient> {
  const response = await fetch(`${API_BASE}/patients/${patientId}/cancel`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to cancel patient');
  }

  const data = await response.json();
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

export async function getDashboardStats() {
  const response = await fetch(`${API_BASE}/dashboard`);

  if (!response.ok) {
    throw new Error('Failed to fetch clinic stats');
  }

  return response.json();
}

// Helper function to normalize status names from backend to frontend format
function normalizeStatus(backendStatus: string): 'waiting' | 'in_consultation' | 'done' | 'cancelled' {
  const statusMap: Record<string, 'waiting' | 'in_consultation' | 'done' | 'cancelled'> = {
    'Waiting': 'waiting',
    'In Consultation': 'in_consultation',
    'Completed': 'done',
    'Cancelled': 'cancelled',
  };
  return statusMap[backendStatus] || 'waiting';
}
