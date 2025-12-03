import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markPatientDone } from "../lib/api";
import { User, Clock, CheckCircle } from "lucide-react";
import type { Patient } from "../lib/types";

interface CurrentPatientCardProps {
  patient: Patient | null;
}

export function CurrentPatientCard({ patient }: CurrentPatientCardProps) {
  const queryClient = useQueryClient();

  const doneMutation = useMutation({
    mutationFn: markPatientDone,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      queryClient.invalidateQueries({ queryKey: ["clinic-state"] });
    },
  });

  if (!patient) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg border-2 border-dashed border-gray-700">
        <h2 className="text-xl font-semibold text-gray-400 mb-4">
          No Patient in Consultation
        </h2>
        <p className="text-gray-500">
          Select a patient from the waiting list to start consultation
        </p>
      </div>
    );
  }

  const waitingTime = Math.floor(
    (new Date().getTime() - new Date(patient.created_at).getTime()) / 60000
  );

  return (
    <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-lg p-6 shadow-lg border-2 border-blue-500">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">Current Patient</h2>
        <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
          Token #{patient.token_no}
        </span>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center text-white">
          <User className="w-5 h-5 mr-2 text-blue-300" />
          <span className="text-lg font-medium">{patient.name}</span>
          {patient.age && (
            <span className="ml-2 text-blue-200">({patient.age} years)</span>
          )}
        </div>

        {patient.purpose && (
          <div className="text-blue-100">
            <span className="font-medium">Purpose:</span> {patient.purpose}
          </div>
        )}

        {patient.note && (
          <div className="text-blue-100">
            <span className="font-medium">Notes:</span> {patient.note}
          </div>
        )}

        <div className="flex items-center text-blue-200 text-sm">
          <Clock className="w-4 h-4 mr-1" />
          <span>Waiting time: {waitingTime} minutes</span>
        </div>
      </div>

      <button
        onClick={() => doneMutation.mutate(patient.id)}
        disabled={doneMutation.isPending}
        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center justify-center"
      >
        <CheckCircle className="w-5 h-5 mr-2" />
        {doneMutation.isPending ? "Marking Done..." : "Mark as Done"}
      </button>
    </div>
  );
}
