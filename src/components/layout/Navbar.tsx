import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';
import { ShoppingCart, Menu, X, User, LogOut, LayoutDashboard, Smartphone } from 'lucide-react';

const Navbar = () => {
  const { profile, logout, isAdmin, isAuthenticated } = useAuth();
  const { itemCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary">
          <Smartphone className="w-6 h-6" /> MobileShop
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <Link to="/mobiles" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Mobiles</Link>
          {isAdmin && (
            <Link to="/admin" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
              <LayoutDashboard className="w-4 h-4" /> Admin
            </Link>
          )}
          <Link to="/cart" className="relative text-muted-foreground hover:text-foreground transition-colors">
            <ShoppingCart className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">{itemCount}</span>
            )}
          </Link>
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground"><User className="w-4 h-4 inline mr-1" />{profile?.name || 'User'}</span>
              <button onClick={handleLogout} className="text-sm text-muted-foreground hover:text-destructive transition-colors"><LogOut className="w-4 h-4" /></button>
            </div>
          ) : (
            <Link to="/login" className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">Login</Link>
          )}
        </div>

        <div className="flex md:hidden items-center gap-3">
          <Link to="/cart" className="relative text-muted-foreground">
            <ShoppingCart className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">{itemCount}</span>
            )}
          </Link>
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-foreground">
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-card border-b border-border px-4 py-4 space-y-3">
          <Link to="/" onClick={() => setMenuOpen(false)} className="block text-sm text-muted-foreground hover:text-foreground">Home</Link>
          <Link to="/mobiles" onClick={() => setMenuOpen(false)} className="block text-sm text-muted-foreground hover:text-foreground">Mobiles</Link>
          {isAdmin && <Link to="/admin" onClick={() => setMenuOpen(false)} className="block text-sm text-muted-foreground hover:text-foreground">Admin Dashboard</Link>}
          {isAuthenticated ? (
            <>
              <span className="block text-sm text-muted-foreground">Hi, {profile?.name}</span>
              <button onClick={handleLogout} className="text-sm text-destructive">Logout</button>
            </>
          ) : (
            <Link to="/login" onClick={() => setMenuOpen(false)} className="block text-sm text-primary font-medium">Login / Signup</Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
