import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { getStreak } from '@/lib/storage';
import { Check, Plus, Trash2, Flame } from 'lucide-react';

export default function HabitTracker() {
  const { habits, addHabit, deleteHabit, toggleHabit } = useApp();
  const [newHabit, setNewHabit] = useState('');
  const today = new Date().toISOString().split('T')[0];

  const handleAdd = () => {
    if (!newHabit.trim()) return;
    addHabit(newHabit.trim());
    setNewHabit('');
  };

  return (
    <div className="glass-card rounded-xl p-6 animate-slide-up">
      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Habits</h3>

      <div className="flex gap-2 mb-4">
        <input
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="Add a habit..."
          className="flex-1 bg-secondary/50 border border-border rounded-lg px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
        />
        <button
          onClick={handleAdd}
          className="bg-primary text-primary-foreground rounded-lg px-3 py-2 hover:opacity-90 transition-opacity"
        >
          <Plus size={18} />
        </button>
      </div>

      <div className="space-y-2 max-h-72 overflow-y-auto">
        {habits.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">No habits yet. Add one above!</p>
        )}
        {habits.map((habit) => {
          const completed = habit.completedDates.includes(today);
          const streak = getStreak(habit);
          return (
            <div
              key={habit.id}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all ${
                completed ? 'bg-success/10' : 'bg-secondary/30 hover:bg-secondary/50'
              }`}
            >
              <button
                onClick={() => toggleHabit(habit.id, today)}
                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all shrink-0 ${
                  completed
                    ? 'bg-success border-success text-success-foreground'
                    : 'border-muted-foreground/30 hover:border-primary'
                }`}
              >
                {completed && <Check size={12} strokeWidth={3} />}
              </button>
              <span className={`flex-1 text-sm ${completed ? 'line-through text-muted-foreground' : ''}`}>
                {habit.name}
              </span>
              {streak > 0 && (
                <span className="flex items-center gap-1 text-xs text-warning font-medium">
                  <Flame size={12} /> {streak}
                </span>
              )}
              <button
                onClick={() => deleteHabit(habit.id)}
                className="text-muted-foreground hover:text-danger transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
