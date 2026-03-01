import AdminSidebar from '@/components/layout/AdminSidebar';
import Navbar from '@/components/layout/Navbar';
import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

type Offer = Tables<'offers'>;

const ManageOffers = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', discount_text: '', active: true });
  const { toast } = useToast();

  const fetchOffers = () => {
    supabase.from('offers').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      if (data) setOffers(data);
    });
  };

  useEffect(() => { fetchOffers(); }, []);

  const openNew = () => { setForm({ title: '', description: '', discount_text: '', active: true }); setEditingId(null); setShowForm(true); };
  const openEdit = (o: Offer) => {
    setForm({ title: o.title, description: o.description || '', discount_text: o.discount_text || '', active: o.active ?? true });
    setEditingId(o.id);
    setShowForm(true);
  };

  const save = async () => {
    if (!form.title || !form.discount_text) { toast({ title: "Fill required fields", variant: "destructive" }); return; }
    if (editingId) {
      await supabase.from('offers').update(form).eq('id', editingId);
      toast({ title: "Offer updated!" });
    } else {
      await supabase.from('offers').insert(form);
      toast({ title: "Offer added!" });
    }
    setShowForm(false);
    fetchOffers();
  };

  const remove = async (id: string) => {
    await supabase.from('offers').delete().eq('id', id);
    toast({ title: "Offer deleted" });
    fetchOffers();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-foreground">Manage Offers</h1>
            <button onClick={openNew} className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Offer
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {offers.map(o => (
              <div key={o.id} className="bg-card rounded-lg border border-border p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-foreground">{o.title}</h3>
                    <span className="text-xs text-primary font-bold">{o.discount_text}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(o)} className="text-muted-foreground hover:text-primary"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => remove(o.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{o.description}</p>
                <span className={`text-xs mt-2 inline-block ${o.active ? 'text-green-500' : 'text-destructive'}`}>{o.active ? 'Active' : 'Inactive'}</span>
              </div>
            ))}
          </div>

          {showForm && (
            <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-card rounded-lg border border-border w-full max-w-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-foreground">{editingId ? 'Edit' : 'Add'} Offer</h2>
                  <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
                </div>
                <div className="space-y-3">
                  <input placeholder="Title *" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                  <input placeholder="Discount text (e.g. 30% OFF) *" value={form.discount_text} onChange={e => setForm({ ...form, discount_text: e.target.value })}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                  <textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring min-h-[60px]" />
                  <label className="flex items-center gap-2 text-sm text-foreground">
                    <input type="checkbox" checked={form.active} onChange={e => setForm({ ...form, active: e.target.checked })} /> Active
                  </label>
                  <button onClick={save} className="w-full h-10 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
                    {editingId ? 'Update' : 'Add'} Offer
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ManageOffers;
