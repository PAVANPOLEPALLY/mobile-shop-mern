import { AppProvider } from '@/context/AppContext';
import GrowthRing from '@/components/GrowthRing';
import StatsCards from '@/components/StatsCards';
import HabitTracker from '@/components/HabitTracker';
import WorkTimer from '@/components/WorkTimer';
import TimeWasteLogger from '@/components/TimeWasteLogger';
import WeeklyChart from '@/components/WeeklyChart';
import { Activity } from 'lucide-react';

function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Activity size={18} className="text-primary-foreground" />
          </div>
          <h1 className="text-lg font-bold tracking-tight">Trackr</h1>
          <span className="text-xs text-muted-foreground ml-1">Habit · Work · Focus</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <StatsCards />
          </div>
          <GrowthRing />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <HabitTracker />
          <WorkTimer />
          <TimeWasteLogger />
        </div>

        <WeeklyChart />
      </main>
    </div>
  );
}

export default function Index() {
  return (
    <AppProvider>
      <Dashboard />
    </AppProvider>
  );
}
