# Clinic Token System

A production-ready, real-time clinic queue management system built with React, Supabase (Postgres), and Edge Functions.

## Features

### Front Desk Interface
- Add new patients with name, age, purpose, and notes
- View real-time queue status
- See waiting, in-consultation, and total patient counts
- Search patients by name or token number
- Mobile-responsive design

### Doctor Dashboard
- View current patient in consultation
- Start consultation with waiting patients
- Mark patients as done
- Cancel appointments
- Real-time updates across all connected clients
- Waiting time tracking
- Mobile-responsive interface

### Real-Time Updates
- Instant synchronization across all connected devices
- Supabase Realtime for database changes
- React Query for efficient cache management
- No manual refresh needed

### Accessibility & UX
- Keyboard navigation support
- High contrast color scheme
- Mobile-first responsive design
- Dark mode interface
- Clear visual status indicators
- Search and filter capabilities

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **State Management**: React Query (TanStack Query)
- **Database**: Neon Postgres (via Supabase)
- **Real-time**: Supabase Realtime
- **Backend**: Supabase Edge Functions (Deno)
- **Icons**: Lucide React

## Database Schema

### `patients` Table
- `id` (bigserial, primary key)
- `token_no` (integer, unique) - Sequential token number
- `name` (text) - Patient name
- `age` (integer) - Patient age
- `purpose` (text) - Visit purpose
- `note` (text) - Additional notes
- `status` (text) - waiting | in_consultation | done | cancelled
- `created_at` (timestamptz) - Registration time
- `updated_at` (timestamptz) - Last update time

### `clinic_state` Table
- `id` (integer, primary key) - Always 1 (singleton)
- `current_patient_id` (bigint) - Currently consulting patient
- `last_token` (integer) - Last assigned token number

## Setup Instructions

### Prerequisites
- Node.js 18+
- Supabase account

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Installation

1. Install dependencies:
```bash
npm install
```

2. The database schema and Edge Functions are already deployed to Supabase

3. Start the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

5. Preview production build:
```bash
npm run preview
```

## API Endpoints (Edge Functions)

### Patients API (`/functions/v1/patients-api`)

#### Get all patients
```
GET /patients-api?status=waiting
```

#### Create patient
```
POST /patients-api
Body: { name, age?, purpose?, note? }
```

#### Start consultation
```
POST /patients-api/:id/start
```

#### Mark done
```
POST /patients-api/:id/done
```

#### Cancel patient
```
POST /patients-api/:id/cancel
```

### Clinic State API (`/functions/v1/clinic-state-api`)

#### Get clinic state
```
GET /clinic-state-api
```

## Routes

- `/` - Home page with role selection
- `/frontdesk` - Front desk interface for patient registration
- `/doctor` - Doctor dashboard for consultations

## Security

- Row Level Security (RLS) enabled on all tables
- Authenticated access required for all operations
- Secure Edge Functions with JWT verification
- Input validation on both client and server

## Real-Time Behavior

The system uses Supabase Realtime to provide instant updates:

1. When a patient is added at the front desk, it immediately appears in:
   - Front desk queue list
   - Doctor's waiting list

2. When a doctor starts consultation:
   - Patient status changes to "in_consultation"
   - Current patient card updates in doctor view
   - Front desk sees updated status

3. When a doctor marks patient as done:
   - Patient status changes to "done"
   - Current patient clears from doctor view
   - Front desk sees updated status

All changes are atomic and synchronized across all connected clients within milliseconds.

## Development

### Type Checking
```bash
npm run typecheck
```

### Linting
```bash
npm run lint
```

### Build
```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── AddPatientForm.tsx      # Patient registration form
│   ├── CurrentPatientCard.tsx   # Doctor's current patient view
│   ├── QueueTable.tsx          # Patient queue table
│   ├── Link.tsx                # Custom link component
│   └── Router.tsx              # Simple routing
├── pages/
│   ├── Home.tsx                # Landing page
│   ├── FrontDesk.tsx           # Front desk interface
│   └── Doctor.tsx              # Doctor dashboard
├── hooks/
│   └── useRealtime.ts          # Realtime subscription hook
├── lib/
│   ├── supabase.ts             # Supabase client
│   └── api.ts                  # API functions
├── App.tsx                      # Main app component
└── main.tsx                     # Entry point

supabase/
└── functions/
    ├── patients-api/           # Patient CRUD operations
    └── clinic-state-api/       # Clinic state management
```

## Key Features Implemented

✅ Sequential token number generation
✅ Real-time queue updates across all clients
✅ Front desk patient registration
✅ Doctor consultation management
✅ Status tracking (waiting, in consultation, done, cancelled)
✅ Waiting time calculation
✅ Search and filter patients
✅ Mobile-responsive design
✅ Accessibility features
✅ Dark mode UI
✅ Row Level Security
✅ Optimistic UI updates
✅ Error handling
✅ Input validation

## Future Enhancements

- Multiple doctor support
- Waiting room display screen
- SMS/push notifications
- Patient history tracking
- Appointment scheduling
- Analytics dashboard
- Export reports

## License

MIT
