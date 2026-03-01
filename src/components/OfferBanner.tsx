import type { Tables } from '@/integrations/supabase/types';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Offer = Tables<'offers'>;

const OfferBanner = ({ offers }: { offers: Offer[] }) => {
  const [current, setCurrent] = useState(0);
  const activeOffers = offers.filter(o => o.active);

  useEffect(() => {
    if (activeOffers.length <= 1) return;
    const timer = setInterval(() => setCurrent(c => (c + 1) % activeOffers.length), 4000);
    return () => clearInterval(timer);
  }, [activeOffers.length]);

  if (activeOffers.length === 0) return null;
  const offer = activeOffers[current];

  return (
    <div className="relative rounded-xl overflow-hidden bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30">
      <div className="relative h-48 md:h-64 flex flex-col items-center justify-center text-center p-6">
        {offer.discount_text && (
          <span className="bg-primary text-primary-foreground text-sm font-bold px-4 py-1 rounded-full mb-3">{offer.discount_text}</span>
        )}
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{offer.title}</h2>
        <p className="text-sm text-muted-foreground max-w-md">{offer.description}</p>
      </div>
      {activeOffers.length > 1 && (
        <>
          <button onClick={() => setCurrent(c => (c - 1 + activeOffers.length) % activeOffers.length)} className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 p-2 rounded-full text-foreground hover:bg-background transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={() => setCurrent(c => (c + 1) % activeOffers.length)} className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 p-2 rounded-full text-foreground hover:bg-background transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {activeOffers.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)} className={`w-2 h-2 rounded-full transition-colors ${i === current ? 'bg-primary' : 'bg-muted-foreground/40'}`} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default OfferBanner;
