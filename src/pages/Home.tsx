import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import OfferBanner from '@/components/OfferBanner';
import MobileCard from '@/components/MobileCard';
import { SHOP_INFO } from '@/lib/mock-data';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

const Home = () => {
  const [products, setProducts] = useState<Tables<'products'>[]>([]);
  const [offers, setOffers] = useState<Tables<'offers'>[]>([]);

  useEffect(() => {
    supabase.from('products').select('*').order('created_at', { ascending: false }).limit(8).then(({ data }) => {
      if (data) setProducts(data);
    });
    supabase.from('offers').select('*').eq('active', true).then(({ data }) => {
      if (data) setOffers(data);
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 space-y-12">
        <OfferBanner offers={offers} />

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Featured Mobiles</h2>
            <Link to="/mobiles" className="text-sm text-primary hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map(p => <MobileCard key={p.id} product={p} />)}
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2"><MapPin className="w-5 h-5 text-primary" /> Visit Our Store</h3>
            <p className="text-sm text-muted-foreground mb-4">{SHOP_INFO.address}</p>
            <div className="rounded-lg overflow-hidden border border-border">
              <iframe src={SHOP_INFO.mapEmbedUrl} width="100%" height="200" style={{ border: 0 }} allowFullScreen loading="lazy" title="Location" />
            </div>
          </div>
          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2"><Clock className="w-5 h-5 text-primary" /> Store Hours</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-muted rounded-md">
                <span className="text-sm text-muted-foreground">Monday – Friday</span>
                <span className="text-sm font-medium text-foreground">{SHOP_INFO.timing.weekdays}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted rounded-md">
                <span className="text-sm text-muted-foreground">Saturday – Sunday</span>
                <span className="text-sm font-medium text-foreground">{SHOP_INFO.timing.weekends}</span>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Home;
