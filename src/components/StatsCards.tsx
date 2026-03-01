import { useApp } from '@/context/AppContext';

export default function StatsCards() {
  const { todayStats } = useApp();

  const formatTime = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h === 0) return `${m}m`;
    return `${h}h ${m}m`;
  };

  const cards = [
    {
      label: 'Habits Done',
      value: `${todayStats.completedHabits}/${todayStats.totalHabits}`,
      accent: 'primary',
    },
    {
      label: 'Productive Time',
      value: formatTime(todayStats.productiveMinutes),
      accent: 'success',
    },
    {
      label: 'Wasted Time',
      value: formatTime(todayStats.wastedMinutes),
      accent: 'danger',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`glass-card rounded-xl p-5 animate-slide-up ${
            card.accent === 'success' ? 'glow-success' : card.accent === 'danger' ? 'glow-danger' : ''
          }`}
        >
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">{card.label}</p>
          <p className="text-2xl font-bold font-mono">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
