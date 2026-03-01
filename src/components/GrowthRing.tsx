import { useApp } from '@/context/AppContext';

export default function GrowthRing() {
  const { todayStats } = useApp();
  const { growthPercent } = todayStats;

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (growthPercent / 100) * circumference;

  const getMessage = () => {
    if (growthPercent >= 80) return "🔥 You're on fire!";
    if (growthPercent >= 60) return "💪 Great progress!";
    if (growthPercent >= 40) return "📈 Keep pushing!";
    if (growthPercent > 0) return "🌱 Room to grow";
    return "⏳ Start tracking!";
  };

  return (
    <div className="glass-card rounded-xl p-6 flex flex-col items-center gap-4">
      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Today's Growth</h3>
      <div className="relative">
        <svg width="164" height="164" className="-rotate-90">
          <circle
            cx="82" cy="82" r={radius}
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth="8"
          />
          <circle
            cx="82" cy="82" r={radius}
            fill="none"
            stroke={growthPercent >= 50 ? "hsl(var(--success))" : "hsl(var(--danger))"}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="progress-ring"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold font-mono animate-count-up">{growthPercent}%</span>
          <span className="text-xs text-muted-foreground">growth</span>
        </div>
      </div>
      <p className="text-sm font-medium">{getMessage()}</p>
    </div>
  );
}
