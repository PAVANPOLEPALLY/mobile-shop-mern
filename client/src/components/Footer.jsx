import { FaFacebook, FaInstagram, FaTwitter, FaPhoneAlt, FaEnvelope, FaWhatsapp } from "react-icons/fa";

const shopName = import.meta.env.VITE_SHOP_NAME || "Sri Kanakadurga Mobiles";
const shopDescription =
  import.meta.env.VITE_SHOP_DESCRIPTION ||
  "Your trusted local mobile shop for genuine smartphones, accessories, and great value offers.";
const shopAddress =
  import.meta.env.VITE_SHOP_ADDRESS || "MG Road, Bengaluru, Karnataka 560001";
const shopEmail = import.meta.env.VITE_SHOP_EMAIL || "support@srikanakadurgamobiles.in";
const callNumber = import.meta.env.VITE_CALL_NUMBER || "+917780319932";
const whatsappNumber = (import.meta.env.VITE_WHATSAPP_NUMBER || "778039932").replace(/\D/g, "");

const socialLinks = [
  { icon: FaTwitter, label: "Twitter", href: "https://twitter.com" },
  { icon: FaInstagram, label: "Instagram", href: "https://instagram.com" },
  { icon: FaFacebook, label: "Facebook", href: "https://facebook.com" }
];

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer id="site-footer" className="mt-16 border-t border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-10 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <section className="space-y-3">
          <h3 className="text-lg font-bold text-brand-700">{shopName}</h3>
          <p className="text-sm text-slate-600">{shopDescription}</p>
          <p className="text-sm text-slate-600">{shopAddress}</p>
          <a href={`mailto:${shopEmail}`} className="block text-sm text-slate-700 hover:text-brand-700">
            {shopEmail}
          </a>
          <a href={`tel:${callNumber}`} className="block text-sm text-slate-700 hover:text-brand-700">
            {callNumber}
          </a>
        </section>

        <section className="space-y-3">
          <h4 className="text-base font-semibold">Follow Us</h4>
          <div className="flex gap-3">
            {socialLinks.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-slate-100 p-3 text-slate-700 transition hover:-translate-y-0.5 hover:bg-brand-100 hover:text-brand-700"
              >
                <Icon />
              </a>
            ))}
          </div>
        </section>

        <section className="space-y-3 md:col-span-2 md:justify-self-end">
          <h4 className="text-base font-semibold">Contact</h4>
          <div className="flex flex-col gap-2 text-sm">
            <a
              href={`tel:${callNumber}`}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 font-semibold text-slate-800 transition hover:bg-slate-200"
            >
              <FaPhoneAlt /> Call Now
            </a>
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-emerald-100 px-4 py-2 font-semibold text-emerald-700 transition hover:bg-emerald-200"
            >
              <FaWhatsapp /> WhatsApp
            </a>
            <a
              href={`mailto:${shopEmail}`}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-blue-100 px-4 py-2 font-semibold text-blue-700 transition hover:bg-blue-200"
            >
              <FaEnvelope /> Email Us
            </a>
          </div>
        </section>
      </div>

      <div className="border-t border-slate-200">
        <p className="mx-auto max-w-7xl px-4 py-4 text-center text-sm text-slate-500 sm:px-6 lg:px-8">
          (c) {year} {shopName}. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
