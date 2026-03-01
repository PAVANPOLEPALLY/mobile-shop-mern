import { useState } from "react";
import { FaDirections, FaMapMarkerAlt } from "react-icons/fa";

const ContactPage = () => {
  const shopName = import.meta.env.VITE_SHOP_NAME || "Sri Kanakadurga Mobiles";
  const shopAddress =
    import.meta.env.VITE_SHOP_ADDRESS || "MG Road, Bengaluru, Karnataka 560001";
  const shopEmail = import.meta.env.VITE_SHOP_EMAIL || "support@srikanakadurgamobiles.in";
  const callNumber = import.meta.env.VITE_CALL_NUMBER || "+919999999999";
  const whatsappNumber = (import.meta.env.VITE_WHATSAPP_NUMBER || "919999999999").replace(
    /\D/g,
    ""
  );
  const directionsUrl = "https://maps.app.goo.gl/W5Qe9oECETukCe3S6?g_st=aw";
  const mapEmbedUrl =
    "https://www.google.com/maps?q=SRI+KANAKADURGA+WATCH%26+MOBILES,+Gandhinagar,+Bhoodan+Pochampally,+Telangana+508284&output=embed";
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [status, setStatus] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const enquiryText = [
      "Hello, I want to contact your store.",
      "",
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      `Phone: ${form.phone}`,
      "",
      "Message:",
      form.message
    ].join("\n");

    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(enquiryText)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setStatus("Opening WhatsApp with your message...");
  };

  return (
    <section className="mx-auto max-w-5xl space-y-8 animate-fade-in">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">Contact Us</h1>
        <p className="text-slate-600">
          Have questions about products, orders, or EMI? Our team is here to help.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <article className="card space-y-4 p-6">
          <h2 className="text-xl font-semibold text-brand-700">{shopName}</h2>
          <p className="text-sm text-slate-700">{shopAddress}</p>
          <div className="space-y-2 text-sm">
            <a href={`tel:${callNumber}`} className="block font-medium text-slate-700 hover:text-brand-700">
              Call: {callNumber}
            </a>
            <a href={`mailto:${shopEmail}`} className="block font-medium text-slate-700 hover:text-brand-700">
              Email: {shopEmail}
            </a>
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block font-medium text-emerald-700 hover:text-emerald-800"
            >
              WhatsApp Chat
            </a>
          </div>
        </article>

        <article className="card p-6">
          <h2 className="mb-4 text-xl font-semibold text-brand-700">Send an Enquiry</h2>
          <form className="space-y-3" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your Name"
              required
              className="w-full min-h-[44px] rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-brand-500"
            />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Your Email"
              required
              className="w-full min-h-[44px] rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-brand-500"
            />
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              required
              className="w-full min-h-[44px] rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-brand-500"
            />
            <textarea
              rows={4}
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="How can we help you?"
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-brand-500"
            />
            <button
              type="submit"
              className="inline-flex min-h-[44px] items-center rounded-lg bg-brand-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-700"
            >
              Submit
            </button>
            {status && <p className="text-sm text-slate-600">{status}</p>}
          </form>
        </article>
      </div>

      <section className="card space-y-5 p-6 sm:p-8">
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-semibold text-brand-700">Find Our Store</h2>
          <p className="text-sm text-slate-600">
            Visit us in person for hands-on demos, expert guidance, and quick support.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl ring-1 ring-slate-200">
          <div className="relative w-full pb-[56.25%]">
            <iframe
              title="Store Location Map"
              src={mapEmbedUrl}
              className="absolute inset-0 h-full w-full"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>

        <div className="flex justify-center">
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-brand-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-700"
          >
            <FaDirections />
            Get Directions
            <FaMapMarkerAlt className="text-xs" />
          </a>
        </div>
      </section>
    </section>
  );
};

export default ContactPage;

