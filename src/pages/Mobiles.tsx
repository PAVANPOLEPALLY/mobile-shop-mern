import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import MobileCard from '@/components/MobileCard';
import { Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

const Mobiles = () => {
  const [products, setProducts] = useState<Tables<'products'>[]>([]);
  const [search, setSearch] = useState('');
  const [brand, setBrand] = useState('All');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    supabase.from('products').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      if (data) setProducts(data);
    });
  }, []);

  const brands = ['All', ...Array.from(new Set(products.map(p => p.brand)))];
  const categories = ['All', 'mobile', 'accessory'];

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase());
    const matchBrand = brand === 'All' || p.brand === brand;
    const matchCat = category === 'All' || p.category === category;
    return matchSearch && matchBrand && matchCat;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-foreground mb-6">All Mobiles</h1>
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              className="w-full h-10 rounded-md border border-input bg-background pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Search mobiles..." />
          </div>
          <select value={brand} onChange={e => setBrand(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
            {brands.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
          <select value={category} onChange={e => setCategory(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring capitalize">
            {categories.map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
          </select>
        </div>

        {filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">No mobiles found.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map(p => <MobileCard key={p.id} product={p} />)}
          </div>
        )}
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Mobiles;
