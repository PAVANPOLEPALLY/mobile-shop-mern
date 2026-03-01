export interface Habit {
  id: string;
  name: string;
  createdAt: string;
  completedDates: string[];
}

export interface WorkSession {
  id: string;
  category: string;
  startTime: string;
  endTime: string | null;
  durationMinutes: number;
  date: string;
}

export interface WasteEntry {
  id: string;
  category: string;
  durationMinutes: number;
  date: string;
}

const HABITS_KEY = 'tracker_habits';
const WORK_KEY = 'tracker_work';
const WASTE_KEY = 'tracker_waste';
const ACTIVE_TIMER_KEY = 'tracker_active_timer';

function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function load<T>(key: string, fallback: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, data: T): void {
  localStorage.setItem(key, JSON.stringify(data));
}

// Habits
export function getHabits(): Habit[] {
  return load<Habit[]>(HABITS_KEY, []);
}

export function addHabit(name: string): Habit {
  const habits = getHabits();
  const habit: Habit = { id: generateId(), name, createdAt: getToday(), completedDates: [] };
  habits.push(habit);
  save(HABITS_KEY, habits);
  return habit;
}

export function deleteHabit(id: string): void {
  save(HABITS_KEY, getHabits().filter(h => h.id !== id));
}

export function toggleHabitDate(id: string, date: string): void {
  const habits = getHabits();
  const habit = habits.find(h => h.id === id);
  if (!habit) return;
  if (habit.completedDates.includes(date)) {
    habit.completedDates = habit.completedDates.filter(d => d !== date);
  } else {
    habit.completedDates.push(date);
  }
  save(HABITS_KEY, habits);
}

export function getStreak(habit: Habit): number {
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    if (habit.completedDates.includes(dateStr)) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }
  return streak;
}

// Work Sessions
export function getWorkSessions(): WorkSession[] {
  return load<WorkSession[]>(WORK_KEY, []);
}

export function getActiveTimer(): { category: string; startTime: string } | null {
  return load<{ category: string; startTime: string } | null>(ACTIVE_TIMER_KEY, null);
}

export function startWorkTimer(category: string): void {
  save(ACTIVE_TIMER_KEY, { category, startTime: new Date().toISOString() });
}

export function stopWorkTimer(): WorkSession | null {
  const active = getActiveTimer();
  if (!active) return null;
  const start = new Date(active.startTime);
  const end = new Date();
  const durationMinutes = Math.round((end.getTime() - start.getTime()) / 60000);
  const session: WorkSession = {
    id: generateId(),
    category: active.category,
    startTime: active.startTime,
    endTime: end.toISOString(),
    durationMinutes,
    date: start.toISOString().split('T')[0],
  };
  const sessions = getWorkSessions();
  sessions.push(session);
  save(WORK_KEY, sessions);
  save(ACTIVE_TIMER_KEY, null);
  return session;
}

// Waste
export function getWasteEntries(): WasteEntry[] {
  return load<WasteEntry[]>(WASTE_KEY, []);
}

export function addWasteEntry(category: string, durationMinutes: number): WasteEntry {
  const entries = getWasteEntries();
  const entry: WasteEntry = { id: generateId(), category, durationMinutes, date: getToday() };
  entries.push(entry);
  save(WASTE_KEY, entries);
  return entry;
}

export function deleteWasteEntry(id: string): void {
  save(WASTE_KEY, getWasteEntries().filter(e => e.id !== id));
}

// Analytics
export function getTodayStats() {
  const today = getToday();
  const habits = getHabits();
  const work = getWorkSessions().filter(s => s.date === today);
  const waste = getWasteEntries().filter(e => e.date === today);

  const completedHabits = habits.filter(h => h.completedDates.includes(today)).length;
  const productiveMinutes = work.reduce((sum, s) => sum + s.durationMinutes, 0);
  const wastedMinutes = waste.reduce((sum, e) => sum + e.durationMinutes, 0);
  const totalMinutes = productiveMinutes + wastedMinutes;
  const growthPercent = totalMinutes > 0 ? Math.round((productiveMinutes / totalMinutes) * 100) : 0;

  return {
    totalHabits: habits.length,
    completedHabits,
    productiveMinutes,
    wastedMinutes,
    growthPercent,
  };
}

export function getWeeklyData() {
  const data: { date: string; productive: number; wasted: number }[] = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const productive = getWorkSessions().filter(s => s.date === dateStr).reduce((sum, s) => sum + s.durationMinutes, 0);
    const wasted = getWasteEntries().filter(e => e.date === dateStr).reduce((sum, e) => sum + e.durationMinutes, 0);
    data.push({ date: dateStr, productive, wasted });
  }
  return data;
}
