import AdminSidebar from '@/components/layout/AdminSidebar';
import Navbar from '@/components/layout/Navbar';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const AdminOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    supabase.from('orders').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      if (data) setOrders(data);
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold text-foreground mb-6">Orders ({orders.length})</h1>
          {orders.length === 0 ? (
            <p className="text-muted-foreground">No orders yet.</p>
          ) : (
            <div className="space-y-4">
              {orders.map(o => {
                const items = (o.items as any[]) || [];
                return (
                  <div key={o.id} className="bg-card rounded-lg border border-border p-4">
                    <div className="flex flex-col sm:flex-row justify-between mb-3">
                      <div>
                        <span className="text-sm font-bold text-foreground">{o.user_name}</span>
                        <span className="text-xs text-muted-foreground ml-3">{o.user_email}</span>
                      </div>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full self-start mt-1 sm:mt-0 ${
                        o.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                        o.status === 'confirmed' ? 'bg-primary/20 text-primary' :
                        'bg-green-500/20 text-green-500'
                      }`}>{o.status}</span>
                    </div>
                    <div className="space-y-1 text-sm">
                      {items.map((i: any, idx: number) => (
                        <div key={idx} className="flex justify-between text-muted-foreground">
                          <span>{i.name} ×{i.quantity}</span>
                          <span>₹{Math.round(i.price * i.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 pt-3 border-t border-border flex justify-between text-sm">
                      <span className="text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</span>
                      <span className="font-bold text-foreground">Total: ₹{Number(o.total).toLocaleString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminOrders;
