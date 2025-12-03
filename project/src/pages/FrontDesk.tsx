import { useQuery } from '@tanstack/react-query';
import { getPatients } from '../lib/api';
import { AddPatientForm } from '../components/AddPatientForm';
import { QueueTable } from '../components/QueueTable';
import { ClipboardList } from 'lucide-react';

export function FrontDesk() {
  const { data: patients = [], isLoading } = useQuery({
    queryKey: ['patients'],
    queryFn: () => getPatients(),
    refetchInterval: 5000,
  });

  const waitingPatients = patients.filter((p) => p.status === 'waiting');
  const inConsultationPatients = patients.filter((p) => p.status === 'in_consultation');

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center mb-2">
            <ClipboardList className="w-8 h-8 mr-3 text-blue-400" />
            <h1 className="text-3xl font-bold text-white">Front Desk</h1>
          </div>
          <p className="text-gray-400">Manage patient registrations and queue</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-1">
            <AddPatientForm />
          </div>

          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-4">
                <div className="text-yellow-400 text-sm font-medium mb-1">Waiting</div>
                <div className="text-3xl font-bold text-white">{waitingPatients.length}</div>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-4">
                <div className="text-blue-400 text-sm font-medium mb-1">In Consultation</div>
                <div className="text-3xl font-bold text-white">
                  {inConsultationPatients.length}
                </div>
              </div>
              <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-4">
                <div className="text-green-400 text-sm font-medium mb-1">Total Today</div>
                <div className="text-3xl font-bold text-white">{patients.length}</div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Current Queue</h2>
          {isLoading ? (
            <div className="bg-gray-800 rounded-lg p-8 text-center">
              <div className="text-gray-400">Loading patients...</div>
            </div>
          ) : (
            <QueueTable patients={patients} />
          )}
        </div>
      </div>
    </div>
  );
}
