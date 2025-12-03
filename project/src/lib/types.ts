export interface Patient {
  id: number;
  token_no: number;
  name: string;
  age?: number | null;
  purpose?: string | null;
  note?: string | null;
  status: 'waiting' | 'in_consultation' | 'done' | 'cancelled';
  created_at: string;
}
