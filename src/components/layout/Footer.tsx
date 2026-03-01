import { SHOP_INFO } from '@/lib/mock-data';
import { MapPin, Clock, Mail, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-16">
      <div className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-lg font-bold text-foreground mb-4">{SHOP_INFO.name}</h3>
          <p className="text-sm text-muted-foreground mb-3">Your trusted destination for the latest smartphones at the best prices.</p>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-primary" /> +91 1234567890</p>
            <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-primary" /> {SHOP_INFO.email}</p>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2"><MapPin className="w-5 h-5 text-primary" /> Location</h3>
          <p className="text-sm text-muted-foreground mb-3">{SHOP_INFO.address}</p>
          <div className="rounded-lg overflow-hidden border border-border">
            <iframe
              src={SHOP_INFO.mapEmbedUrl}
              width="100%"
              height="150"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Shop Location"
            />
          </div>
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2"><Clock className="w-5 h-5 text-primary" /> Shop Timing</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Mon – Fri</span><span className="text-foreground font-medium">{SHOP_INFO.timing.weekdays}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Sat – Sun</span><span className="text-foreground font-medium">{SHOP_INFO.timing.weekends}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © 2026 {SHOP_INFO.name}. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
