import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const navLinkClass = ({ isActive }) =>
  `rounded-md px-3 py-2 text-sm font-semibold transition min-h-[44px] inline-flex items-center ${
    isActive
      ? "bg-brand-100 text-brand-700"
      : "text-slate-700 hover:bg-slate-100 hover:text-brand-500"
  }`;

const Navbar = () => {
  const { items } = useCart();
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate("/admin/login");
  };

  const closeMobileMenu = () => setMobileOpen(false);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur animate-slide-down">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="max-w-[70%] whitespace-nowrap text-lg font-bold tracking-tight text-brand-700 transition hover:text-brand-500"
          onClick={closeMobileMenu}
        >
          Sri Kanakadurga Mobiles
        </Link>

        <div className="flex items-center gap-2">
          <NavLink
            to="/cart"
            className="rounded-md px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 min-h-[44px] inline-flex items-center md:hidden"
          >
            Cart ({items.length})
          </NavLink>

          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md border border-slate-300 text-slate-700 transition hover:bg-slate-100 md:hidden"
          >
            {mobileOpen ? "X" : "Menu"}
          </button>
        </div>

        <nav className="hidden items-center gap-1 md:flex">
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
              className="inline-flex min-h-[44px] items-center rounded-md bg-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-300"
            >
              Logout
            </button>
          )}
        </nav>
      </div>

      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-200 md:hidden ${
          mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeMobileMenu}
      />
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-[70%] max-w-72 bg-white shadow-lg transition-transform duration-200 md:hidden ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="border-b border-slate-200 px-4 py-4">
          <p className="text-lg font-bold text-brand-700">Menu</p>
        </div>
        <nav className="flex flex-col gap-2 px-4 py-4">
          <NavLink to="/" className={navLinkClass} onClick={closeMobileMenu}>
            Home
          </NavLink>
          <NavLink to="/about" className={navLinkClass} onClick={closeMobileMenu}>
            About
          </NavLink>
          <NavLink to="/contact" className={navLinkClass} onClick={closeMobileMenu}>
            Contact
          </NavLink>
          <NavLink to="/products" className={navLinkClass} onClick={closeMobileMenu}>
            Products
          </NavLink>
          <NavLink to="/cart" className={navLinkClass} onClick={closeMobileMenu}>
            Cart ({items.length})
          </NavLink>
          <NavLink to="/admin/dashboard" className={navLinkClass} onClick={closeMobileMenu}>
            Admin
          </NavLink>
          {token && (
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex h-12 items-center rounded-lg bg-slate-200 px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-300"
            >
              Logout
            </button>
          )}
        </nav>
      </aside>
    </header>
  );
};

export default Navbar;
