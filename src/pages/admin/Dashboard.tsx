import AdminSidebar from '@/components/layout/AdminSidebar';
import Navbar from '@/components/layout/Navbar';
import { Smartphone, ShoppingBag, Tag, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const AdminDashboard = () => {
  const [productCount, setProductCount] = useState(0);
  const [offerCount, setOfferCount] = useState(0);
  const [orders, setOrders] = useState<any[]>([]);
  const [revenue, setRevenue] = useState(0);

  useEffect(() => {
    supabase.from('products').select('id', { count: 'exact', head: true }).then(({ count }) => setProductCount(count || 0));
    supabase.from('offers').select('id', { count: 'exact', head: true }).eq('active', true).then(({ count }) => setOfferCount(count || 0));
    supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(10).then(({ data }) => {
      if (data) {
        setOrders(data);
        setRevenue(data.reduce((s, o) => s + Number(o.total), 0));
      }
    });
  }, []);

  const stats = [
    { label: 'Total Mobiles', value: productCount, icon: Smartphone, color: 'text-primary' },
    { label: 'Active Offers', value: offerCount, icon: Tag, color: 'text-yellow-500' },
    { label: 'Total Orders', value: orders.length, icon: ShoppingBag, color: 'text-green-500' },
    { label: 'Revenue', value: `₹${revenue.toLocaleString()}`, icon: TrendingUp, color: 'text-primary' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold text-foreground mb-6">Admin Dashboard</h1>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map(s => (
              <div key={s.label} className="bg-card rounded-lg border border-border p-4">
                <div className="flex items-center gap-3">
                  <s.icon className={`w-8 h-8 ${s.color}`} />
                  <div>
                    <p className="text-2xl font-bold text-foreground">{s.value}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-card rounded-lg border border-border p-6">
            <h2 className="font-bold text-foreground mb-4">Recent Orders</h2>
            {orders.length === 0 ? (
              <p className="text-sm text-muted-foreground">No orders yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-muted-foreground border-b border-border">
                      <th className="pb-2 pr-4">Customer</th>
                      <th className="pb-2 pr-4">Total</th>
                      <th className="pb-2 pr-4">Status</th>
                      <th className="pb-2">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(o => (
                      <tr key={o.id} className="border-b border-border last:border-0">
                        <td className="py-3 pr-4 text-foreground font-medium">{o.user_name}</td>
                        <td className="py-3 pr-4 text-foreground">₹{Number(o.total).toLocaleString()}</td>
                        <td className="py-3 pr-4">
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                            o.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                            o.status === 'confirmed' ? 'bg-primary/20 text-primary' :
                            'bg-green-500/20 text-green-500'
                          }`}>{o.status}</span>
                        </td>
                        <td className="py-3 text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
