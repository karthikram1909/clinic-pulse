import { useQuery } from "@tanstack/react-query";
import { getPatients } from "../lib/api";
import { CurrentPatientCard } from "../components/CurrentPatientCard";
import { QueueTable } from "../components/QueueTable";
import { Stethoscope, Users } from "lucide-react";

export function Doctor() {
  const { data: patients = [], isLoading: patientsLoading } = useQuery({
    queryKey: ["patients"],
    queryFn: () => getPatients(),
    refetchInterval: 5000,
  });

  const currentPatient =
    patients.find((p) => p.status === "in_consultation") || null;
  const waitingPatients = patients.filter((p) => p.status === "waiting");
  const completedToday = patients.filter((p) => p.status === "done").length;

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center mb-2">
            <Stethoscope className="w-8 h-8 mr-3 text-blue-400" />
            <h1 className="text-3xl font-bold text-white">Doctor Dashboard</h1>
          </div>
          <p className="text-gray-400">Manage patient consultations</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-4">
            <div className="text-yellow-400 text-sm font-medium mb-1">
              Waiting
            </div>
            <div className="text-3xl font-bold text-white">
              {waitingPatients.length}
            </div>
          </div>
          <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-4">
            <div className="text-blue-400 text-sm font-medium mb-1">
              In Consultation
            </div>
            <div className="text-3xl font-bold text-white">
              {currentPatient ? 1 : 0}
            </div>
          </div>
          <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-4">
            <div className="text-green-400 text-sm font-medium mb-1">
              Completed Today
            </div>
            <div className="text-3xl font-bold text-white">
              {completedToday}
            </div>
          </div>
        </div>

        <div className="mb-8">
          {patientsLoading ? (
            <div className="bg-gray-800 rounded-lg p-8 text-center">
              <div className="text-gray-400">Loading...</div>
            </div>
          ) : (
            <CurrentPatientCard patient={currentPatient} />
          )}
        </div>

        <div>
          <div className="flex items-center mb-4">
            <Users className="w-6 h-6 mr-2 text-blue-400" />
            <h2 className="text-xl font-semibold text-white">Waiting List</h2>
          </div>
          {patientsLoading ? (
            <div className="bg-gray-800 rounded-lg p-8 text-center">
              <div className="text-gray-400">Loading patients...</div>
            </div>
          ) : (
            <QueueTable
              patients={waitingPatients}
              showActions={true}
              currentPatientId={currentPatient?.id}
            />
          )}
        </div>
      </div>
    </div>
  );
}
