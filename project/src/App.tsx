import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Router } from './components/Router';
import { Home } from './pages/Home';
import { FrontDesk } from './pages/FrontDesk';
import { Doctor } from './pages/Doctor';
import { useRealtime } from './hooks/useRealtime';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000,
      refetchOnWindowFocus: true,
    },
  },
});

function AppContent() {
  useRealtime();

  const routes = [
    { path: '/', component: <Home /> },
    { path: '/frontdesk', component: <FrontDesk /> },
    { path: '/doctor', component: <Doctor /> },
  ];

  return <Router routes={routes} />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;
