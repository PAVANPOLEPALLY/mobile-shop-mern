import { MessageCircle } from 'lucide-react';
import { SHOP_INFO } from '@/lib/mock-data';

const WhatsAppButton = ({ message = "Hi! I'm interested in buying a mobile from your shop." }: { message?: string }) => {
  const url = `https://wa.me/${SHOP_INFO.whatsapp}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-6 h-6" />
    </a>
  );
};

export default WhatsAppButton;
