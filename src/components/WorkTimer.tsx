import { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Play, Square } from 'lucide-react';

const CATEGORIES = ['DSA', 'Study', 'Gym', 'Project', 'Reading', 'Other'];

export default function WorkTimer() {
  const { activeTimer, startTimer, stopTimer, workSessions } = useApp();
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [elapsed, setElapsed] = useState('00:00:00');

  const today = new Date().toISOString().split('T')[0];
  const todaySessions = workSessions.filter(s => s.date === today);

  useEffect(() => {
    if (!activeTimer) {
      setElapsed('00:00:00');
      return;
    }
    const tick = () => {
      const diff = Date.now() - new Date(activeTimer.startTime).getTime();
      const s = Math.floor(diff / 1000);
      const h = String(Math.floor(s / 3600)).padStart(2, '0');
      const m = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
      const sec = String(s % 60).padStart(2, '0');
      setElapsed(`${h}:${m}:${sec}`);
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [activeTimer]);

  return (
    <div className="glass-card rounded-xl p-6 animate-slide-up">
      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Work Timer</h3>

      {!activeTimer ? (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  category === cat
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <button
            onClick={() => startTimer(category)}
            className="w-full flex items-center justify-center gap-2 bg-success text-success-foreground rounded-lg py-3 font-medium hover:opacity-90 transition-opacity"
          >
            <Play size={18} /> Start Working
          </button>
        </div>
      ) : (
        <div className="text-center space-y-3">
          <p className="text-xs text-muted-foreground">{activeTimer.category}</p>
          <p className="text-4xl font-bold font-mono tracking-wider animate-pulse-glow">{elapsed}</p>
          <button
            onClick={stopTimer}
            className="w-full flex items-center justify-center gap-2 bg-danger text-danger-foreground rounded-lg py-3 font-medium hover:opacity-90 transition-opacity"
          >
            <Square size={18} /> Stop
          </button>
        </div>
      )}

      {todaySessions.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border space-y-1.5">
          <p className="text-xs text-muted-foreground mb-2">Today's Sessions</p>
          {todaySessions.map((s) => (
            <div key={s.id} className="flex items-center justify-between text-xs">
              <span className="bg-secondary/50 px-2 py-0.5 rounded text-muted-foreground">{s.category}</span>
              <span className="font-mono">{Math.floor(s.durationMinutes / 60)}h {s.durationMinutes % 60}m</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
