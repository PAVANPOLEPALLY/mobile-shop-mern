import { getWeeklyData } from '@/lib/storage';

export default function WeeklyChart() {
  const data = getWeeklyData();
  const maxMinutes = Math.max(...data.map(d => d.productive + d.wasted), 60);

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="glass-card rounded-xl p-6 animate-slide-up">
      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Weekly Overview</h3>

      <div className="flex items-end gap-2 h-40">
        {data.map((day, i) => {
          const total = day.productive + day.wasted;
          const prodHeight = total > 0 ? (day.productive / maxMinutes) * 100 : 0;
          const wasteHeight = total > 0 ? (day.wasted / maxMinutes) * 100 : 0;
          const dateObj = new Date(day.date + 'T00:00:00');
          const label = dayLabels[dateObj.getDay()];

          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex flex-col items-center justify-end h-32 gap-0.5">
                {wasteHeight > 0 && (
                  <div
                    className="w-full max-w-8 rounded-t bg-danger/60 transition-all duration-500"
                    style={{ height: `${wasteHeight}%` }}
                    title={`Wasted: ${day.wasted}m`}
                  />
                )}
                {prodHeight > 0 && (
                  <div
                    className="w-full max-w-8 rounded-t bg-success transition-all duration-500"
                    style={{ height: `${prodHeight}%` }}
                    title={`Productive: ${day.productive}m`}
                  />
                )}
                {total === 0 && (
                  <div className="w-full max-w-8 h-1 rounded bg-border" />
                )}
              </div>
              <span className="text-[10px] text-muted-foreground font-medium">{label}</span>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-4 mt-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm bg-success" />
          Productive
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm bg-danger/60" />
          Wasted
        </div>
      </div>
    </div>
  );
}
