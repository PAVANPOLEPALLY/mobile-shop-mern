import { Link } from "react-router-dom";

const HeroBanner = () => (
  <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-900 via-brand-700 to-brand-500 p-8 text-white shadow-xl sm:p-12 animate-fade-in">
    <div className="absolute -right-16 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
    <div className="absolute -bottom-10 left-10 h-36 w-36 rounded-full bg-cyan-200/20 blur-2xl" />

    <div className="relative max-w-2xl space-y-5">
      <p className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-widest">
        Local Mobile Shop
      </p>
      <h1 className="text-3xl font-bold leading-tight sm:text-5xl">
        Latest Smartphones, Trusted Service
      </h1>
      <p className="text-sm text-blue-100 sm:text-base">
        Explore premium mobiles and accessories with best offers, flexible EMI and instant
        WhatsApp ordering.
      </p>
      <div className="flex flex-wrap gap-3">
        <Link
          to="/products"
          className="inline-flex rounded-lg bg-white px-5 py-3 text-sm font-bold text-brand-700 transition hover:-translate-y-0.5 hover:shadow-md"
        >
          Shop Now
        </Link>
        <span className="inline-flex items-center rounded-lg border border-white/30 px-4 py-3 text-sm font-semibold text-white/90">
          Fast Delivery | Genuine Products
        </span>
      </div>
    </div>
  </section>
);

export default HeroBanner;
