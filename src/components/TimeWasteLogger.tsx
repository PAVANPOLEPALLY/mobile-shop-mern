import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Plus, Trash2 } from 'lucide-react';

const WASTE_CATEGORIES = ['Instagram', 'YouTube', 'Gaming', 'Twitter/X', 'Netflix', 'Other'];

export default function TimeWasteLogger() {
  const { wasteEntries, addWaste, deleteWaste } = useApp();
  const [category, setCategory] = useState(WASTE_CATEGORIES[0]);
  const [minutes, setMinutes] = useState('');

  const today = new Date().toISOString().split('T')[0];
  const todayEntries = wasteEntries.filter(e => e.date === today);

  const handleAdd = () => {
    const mins = parseInt(minutes);
    if (!mins || mins <= 0) return;
    addWaste(category, mins);
    setMinutes('');
  };

  return (
    <div className="glass-card rounded-xl p-6 animate-slide-up">
      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Time Wasted</h3>

      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {WASTE_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                category === cat
                  ? 'bg-danger text-danger-foreground'
                  : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="number"
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="Minutes..."
            min="1"
            className="flex-1 bg-secondary/50 border border-border rounded-lg px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-danger/50 transition-all"
          />
          <button
            onClick={handleAdd}
            className="bg-danger text-danger-foreground rounded-lg px-3 py-2 hover:opacity-90 transition-opacity"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      {todayEntries.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border space-y-1.5">
          {todayEntries.map((entry) => (
            <div key={entry.id} className="flex items-center justify-between text-xs">
              <span className="bg-danger/10 text-danger px-2 py-0.5 rounded">{entry.category}</span>
              <div className="flex items-center gap-2">
                <span className="font-mono">{entry.durationMinutes}m</span>
                <button onClick={() => deleteWaste(entry.id)} className="text-muted-foreground hover:text-danger transition-colors">
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
