import { useEffect, useState } from "react";
import { FaPhoneAlt, FaWhatsapp } from "react-icons/fa";
import { createWhatsAppLink } from "../utils/whatsapp";

const FloatingActions = () => {
  const callNumber = import.meta.env.VITE_CALL_NUMBER || "+919999999999";
  const [lifted, setLifted] = useState(false);

  useEffect(() => {
    const footer = document.getElementById("site-footer");
    if (!footer) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setLifted(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={`fixed right-4 z-50 flex flex-col gap-3 transition-all duration-300 ${
        lifted ? "bottom-28 md:bottom-32" : "bottom-6"
      }`}
    >
      <a
        href={createWhatsAppLink()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-xl text-white shadow-xl transition hover:scale-105 hover:bg-emerald-600"
      >
        <FaWhatsapp />
      </a>

      <a
        href={`tel:${callNumber}`}
        aria-label="Call now"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-500 text-lg text-white shadow-xl transition hover:scale-105 hover:bg-brand-700"
      >
        <FaPhoneAlt />
      </a>
    </div>
  );
};

export default FloatingActions;
