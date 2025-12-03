import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { startConsultation, cancelPatient } from "../lib/api";
import { Play, X, Clock, Search } from "lucide-react";
import type { Patient } from "../lib/types";

interface QueueTableProps {
  patients: Patient[];
  showActions?: boolean;
  currentPatientId?: number | null;
}

export function QueueTable({
  patients,
  showActions = false,
  currentPatientId,
}: QueueTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();

  const startMutation = useMutation({
    mutationFn: startConsultation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      queryClient.invalidateQueries({ queryKey: ["clinic-state"] });
    },
  });

  const cancelMutation = useMutation({
    mutationFn: cancelPatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      queryClient.invalidateQueries({ queryKey: ["clinic-state"] });
    },
  });

  const handleStartConsultation = (patientId: number) => {
    if (currentPatientId && currentPatientId !== patientId) {
      if (
        !confirm("A patient is already in consultation. Do you want to switch?")
      ) {
        return;
      }
    }
    startMutation.mutate(patientId);
  };

  const filteredPatients = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.token_no.toString().includes(searchTerm)
  );

  const getWaitingTime = (createdAt: string) => {
    return Math.floor(
      (new Date().getTime() - new Date(createdAt).getTime()) / 60000
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "waiting":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
      case "in_consultation":
        return "bg-blue-500/20 text-blue-400 border-blue-500/50";
      case "done":
        return "bg-green-500/20 text-green-400 border-green-500/50";
      case "cancelled":
        return "bg-red-500/20 text-red-400 border-red-500/50";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/50";
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 border-b border-gray-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name or token number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {filteredPatients.length === 0 ? (
        <div className="p-8 text-center text-gray-400">
          {searchTerm
            ? "No patients found matching your search"
            : "No patients in queue"}
        </div>
      ) : (
        <>
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Token
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Age
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Purpose
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Waiting
                  </th>
                  {showActions && (
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredPatients.map((patient) => (
                  <tr
                    key={patient.id}
                    className="hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="text-white font-bold text-lg">
                        #{patient.token_no}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-white font-medium">
                        {patient.name}
                      </div>
                      {patient.note && (
                        <div className="text-gray-400 text-sm mt-1">
                          {patient.note}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-gray-300">
                      {patient.age || "-"}
                    </td>
                    <td className="px-4 py-4 text-gray-300">
                      {patient.purpose || "-"}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded border ${getStatusColor(
                          patient.status
                        )}`}
                      >
                        {patient.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-gray-300 text-sm">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {getWaitingTime(patient.created_at)} min
                      </div>
                    </td>
                    {showActions && (
                      <td className="px-4 py-4 whitespace-nowrap text-right">
                        <div className="flex gap-2 justify-end">
                          {patient.status === "waiting" && (
                            <button
                              onClick={() =>
                                handleStartConsultation(patient.id)
                              }
                              disabled={startMutation.isPending}
                              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white p-2 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                              title="Start Consultation"
                            >
                              <Play className="w-4 h-4" />
                            </button>
                          )}
                          {patient.status === "waiting" && (
                            <button
                              onClick={() => cancelMutation.mutate(patient.id)}
                              disabled={cancelMutation.isPending}
                              className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white p-2 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                              title="Cancel"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden divide-y divide-gray-700">
            {filteredPatients.map((patient) => (
              <div
                key={patient.id}
                className="p-4 hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="text-white font-bold text-lg">
                      #{patient.token_no}
                    </span>
                    <h3 className="text-white font-medium mt-1">
                      {patient.name}
                    </h3>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded border ${getStatusColor(
                      patient.status
                    )}`}
                  >
                    {patient.status.replace("_", " ")}
                  </span>
                </div>
                <div className="space-y-1 text-sm">
                  {patient.age && (
                    <div className="text-gray-300">Age: {patient.age}</div>
                  )}
                  {patient.purpose && (
                    <div className="text-gray-300">
                      Purpose: {patient.purpose}
                    </div>
                  )}
                  {patient.note && (
                    <div className="text-gray-400">Note: {patient.note}</div>
                  )}
                  <div className="flex items-center text-gray-300">
                    <Clock className="w-4 h-4 mr-1" />
                    Waiting: {getWaitingTime(patient.created_at)} min
                  </div>
                </div>
                {showActions && patient.status === "waiting" && (
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleStartConsultation(patient.id)}
                      disabled={startMutation.isPending}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white py-2 px-4 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start
                    </button>
                    <button
                      onClick={() => cancelMutation.mutate(patient.id)}
                      disabled={cancelMutation.isPending}
                      className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white py-2 px-4 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
