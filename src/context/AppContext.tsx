import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import * as storage from '@/lib/storage';

interface AppState {
  habits: storage.Habit[];
  workSessions: storage.WorkSession[];
  wasteEntries: storage.WasteEntry[];
  activeTimer: { category: string; startTime: string } | null;
  todayStats: ReturnType<typeof storage.getTodayStats>;
  refreshAll: () => void;
  addHabit: (name: string) => void;
  deleteHabit: (id: string) => void;
  toggleHabit: (id: string, date: string) => void;
  startTimer: (category: string) => void;
  stopTimer: () => void;
  addWaste: (category: string, minutes: number) => void;
  deleteWaste: (id: string) => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [habits, setHabits] = useState(storage.getHabits);
  const [workSessions, setWorkSessions] = useState(storage.getWorkSessions);
  const [wasteEntries, setWasteEntries] = useState(storage.getWasteEntries);
  const [activeTimer, setActiveTimer] = useState(storage.getActiveTimer);
  const [todayStats, setTodayStats] = useState(storage.getTodayStats);

  const refreshAll = useCallback(() => {
    setHabits(storage.getHabits());
    setWorkSessions(storage.getWorkSessions());
    setWasteEntries(storage.getWasteEntries());
    setActiveTimer(storage.getActiveTimer());
    setTodayStats(storage.getTodayStats());
  }, []);

  const addHabit = useCallback((name: string) => {
    storage.addHabit(name);
    refreshAll();
  }, [refreshAll]);

  const deleteHabit = useCallback((id: string) => {
    storage.deleteHabit(id);
    refreshAll();
  }, [refreshAll]);

  const toggleHabit = useCallback((id: string, date: string) => {
    storage.toggleHabitDate(id, date);
    refreshAll();
  }, [refreshAll]);

  const startTimer = useCallback((category: string) => {
    storage.startWorkTimer(category);
    refreshAll();
  }, [refreshAll]);

  const stopTimer = useCallback(() => {
    storage.stopWorkTimer();
    refreshAll();
  }, [refreshAll]);

  const addWaste = useCallback((category: string, minutes: number) => {
    storage.addWasteEntry(category, minutes);
    refreshAll();
  }, [refreshAll]);

  const deleteWaste = useCallback((id: string) => {
    storage.deleteWasteEntry(id);
    refreshAll();
  }, [refreshAll]);

  // Refresh stats periodically when timer is active
  useEffect(() => {
    if (!activeTimer) return;
    const interval = setInterval(refreshAll, 1000);
    return () => clearInterval(interval);
  }, [activeTimer, refreshAll]);

  return (
    <AppContext.Provider value={{
      habits, workSessions, wasteEntries, activeTimer, todayStats,
      refreshAll, addHabit, deleteHabit, toggleHabit, startTimer, stopTimer, addWaste, deleteWaste,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
