import { Link, NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const navLinkClass = ({ isActive }) =>
  `rounded-md px-2 py-1 transition ${
    isActive
      ? "bg-brand-100 text-brand-700"
      : "text-slate-700 hover:bg-slate-100 hover:text-brand-500"
  }`;

const Navbar = () => {
  const { items } = useCart();
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur animate-slide-down">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-xl font-bold tracking-tight text-brand-700 transition hover:text-brand-500">
          Sri Kanakadurga Mobiles
        </Link>
        <nav className="flex items-center gap-2 text-sm font-semibold sm:gap-3">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/about" className={navLinkClass}>
            About
          </NavLink>
          <NavLink to="/contact" className={navLinkClass}>
            Contact
          </NavLink>
          <NavLink to="/products" className={navLinkClass}>
            Products
          </NavLink>
          <NavLink to="/cart" className={navLinkClass}>
            Cart ({items.length})
          </NavLink>
          <NavLink to="/admin/dashboard" className={navLinkClass}>
            Admin
          </NavLink>
          {token && (
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-md bg-slate-200 px-2 py-1 text-slate-700 transition hover:bg-slate-300"
            >
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;

