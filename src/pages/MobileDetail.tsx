import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { SHOP_INFO } from '@/lib/mock-data';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, ArrowLeft, MessageCircle, AlertTriangle, Phone, CreditCard } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

const MobileDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Tables<'products'> | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const [selectedImg, setSelectedImg] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    if (!id) return;
    supabase.from('products').select('*').eq('id', id).single().then(({ data }) => {
      setProduct(data);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-muted-foreground">Mobile not found.</p>
          <Link to="/mobiles" className="text-primary hover:underline mt-4 inline-block">← Back to Mobiles</Link>
        </div>
      </div>
    );
  }

  const hasDiscount = product.original_price && product.discount && product.discount > 0;
  const finalPrice = hasDiscount ? product.original_price! * (1 - product.discount! / 100) : product.price;
  const specs = product.specifications as Record<string, string> | null;
  const whatsappMsg = `Hi! I'm interested in ${product.name} (₹${Math.round(finalPrice).toLocaleString()}). Is it available?`;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Link to="/mobiles" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Mobiles
        </Link>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="aspect-square rounded-lg overflow-hidden bg-muted border border-border mb-3">
              <img src={product.images?.[selectedImg] || '/placeholder.svg'} alt={product.name} className="w-full h-full object-cover" />
            </div>
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImg(i)}
                    className={`w-16 h-16 rounded-md overflow-hidden border-2 transition-colors ${i === selectedImg ? 'border-primary' : 'border-border'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <p className="text-sm text-primary font-medium mb-1">{product.brand}</p>
            <h1 className="text-2xl font-bold text-foreground mb-2">{product.name}</h1>
            <p className="text-sm text-muted-foreground mb-4">{product.description}</p>

            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-3xl font-bold text-foreground">₹{Math.round(finalPrice).toLocaleString()}</span>
              {hasDiscount && (
                <>
                  <span className="text-lg text-muted-foreground line-through">₹{product.original_price!.toLocaleString()}</span>
                  <span className="text-sm font-bold text-primary">{product.discount}% off</span>
                </>
              )}
            </div>

            <div className="flex items-center gap-2 mb-4">
              {product.emi_available && (
                <span className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded flex items-center gap-1 font-medium">
                  <CreditCard className="w-3 h-3" /> EMI Available
                </span>
              )}
              {product.stock === 0 && (
                <span className="text-xs bg-destructive/10 text-destructive px-2 py-1 rounded font-medium">Out of Stock</span>
              )}
            </div>

            {product.stock > 0 && product.stock < 5 && (
              <div className="flex items-center gap-2 bg-destructive/10 text-destructive px-3 py-2 rounded-md text-sm font-medium mb-4">
                <AlertTriangle className="w-4 h-4" /> Only {product.stock} left in stock!
              </div>
            )}

            {specs && Object.keys(specs).length > 0 && (
              <div className="bg-muted rounded-lg p-4 mb-6">
                <h3 className="text-sm font-bold text-foreground mb-3">Specifications</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {Object.entries(specs).map(([k, v]) => (
                    <div key={k}>
                      <span className="text-muted-foreground capitalize">{k}: </span>
                      <span className="text-foreground font-medium">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={() => { addToCart(product); toast({ title: "Added to cart!", description: `${product.name} added.` }); }}
                disabled={product.stock === 0}
                className="flex-1 h-11 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                <ShoppingCart className="w-4 h-4" /> Add to Cart
              </button>
              <a href={`https://wa.me/${SHOP_INFO.whatsapp}?text=${encodeURIComponent(whatsappMsg)}`} target="_blank" rel="noopener noreferrer"
                className="flex-1 h-11 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </a>
              <a href={`tel:${SHOP_INFO.phone}`}
                className="flex-1 h-11 bg-accent text-accent-foreground rounded-md text-sm font-medium hover:bg-accent/80 transition-colors flex items-center justify-center gap-2">
                <Phone className="w-4 h-4" /> Call Now
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MobileDetail;
