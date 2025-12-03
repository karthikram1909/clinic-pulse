import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPatient } from '../lib/api';
import { UserPlus } from 'lucide-react';

export function AddPatientForm() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [purpose, setPurpose] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createPatient,
    onSuccess: () => {
      setName('');
      setAge('');
      setPurpose('');
      setNote('');
      setError('');
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
    onError: (err: Error) => {
      setError(err.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    createMutation.mutate({
      name: name.trim(),
      age: age ? parseInt(age) : undefined,
      purpose: purpose.trim() || undefined,
      note: note.trim() || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg p-6 shadow-lg">
      <div className="flex items-center mb-4">
        <UserPlus className="w-5 h-5 mr-2 text-blue-400" />
        <h2 className="text-xl font-semibold text-white">Add New Patient</h2>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
            Patient Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter patient name"
            required
            disabled={createMutation.isPending}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-300 mb-1">
              Age
            </label>
            <input
              type="number"
              id="age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Age"
              min="0"
              max="150"
              disabled={createMutation.isPending}
            />
          </div>

          <div>
            <label htmlFor="purpose" className="block text-sm font-medium text-gray-300 mb-1">
              Purpose
            </label>
            <input
              type="text"
              id="purpose"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Fever, Checkup"
              disabled={createMutation.isPending}
            />
          </div>
        </div>

        <div>
          <label htmlFor="note" className="block text-sm font-medium text-gray-300 mb-1">
            Notes
          </label>
          <textarea
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Additional notes..."
            disabled={createMutation.isPending}
          />
        </div>

        <button
          type="submit"
          disabled={createMutation.isPending}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
        >
          {createMutation.isPending ? 'Adding Patient...' : 'Add Patient'}
        </button>
      </div>
    </form>
  );
}
