import { Link } from '../components/Link';
import { ClipboardList, Stethoscope } from 'lucide-react';

export function Home() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Clinic Token System
          </h1>
          <p className="text-xl text-gray-400">
            Streamline patient management with real-time queue tracking
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/frontdesk"
            className="bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg p-8 shadow-lg transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            <ClipboardList className="w-16 h-16 text-white mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Front Desk</h2>
            <p className="text-blue-100">
              Register new patients and manage the queue
            </p>
          </Link>

          <Link
            href="/doctor"
            className="bg-gradient-to-br from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 rounded-lg p-8 shadow-lg transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            <Stethoscope className="w-16 h-16 text-white mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Doctor Dashboard</h2>
            <p className="text-green-100">
              View waiting patients and manage consultations
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
