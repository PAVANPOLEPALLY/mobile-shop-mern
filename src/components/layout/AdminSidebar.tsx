import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Smartphone, Tag, ShoppingBag, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

const links = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/mobiles', icon: Smartphone, label: 'Mobiles' },
  { to: '/admin/offers', icon: Tag, label: 'Offers' },
  { to: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
];

const AdminSidebar = () => {
  const { pathname } = useLocation();

  return (
    <aside className="w-60 min-h-[calc(100vh-4rem)] bg-card border-r border-border hidden md:block p-4">
      <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Shop
      </Link>
      <nav className="space-y-1">
        {links.map(l => (
          <Link
            key={l.to}
            to={l.to}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors",
              pathname === l.to ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <l.icon className="w-4 h-4" /> {l.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
