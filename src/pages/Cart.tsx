import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { SHOP_INFO } from '@/lib/mock-data';
import { Trash2, Plus, Minus, ShoppingBag, MessageCircle, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';

const Cart = () => {
  const { items, removeFromCart, updateQuantity, clearCart, total, itemCount } = useCart();
  const { isAuthenticated, user, profile } = useAuth();
  const { toast } = useToast();
  const [placing, setPlacing] = useState(false);

  const getPrice = (p: any) => {
    if (p.original_price && p.discount) return p.original_price * (1 - (p.discount / 100));
    return p.price;
  };

  const handlePlaceOrder = async () => {
    if (!isAuthenticated || !user) {
      toast({ title: "Please login first", description: "You need to sign in to place an order.", variant: "destructive" });
      return;
    }
    setPlacing(true);
    const orderItems = items.map(i => ({
      productId: i.product.id,
      name: i.product.name,
      price: getPrice(i.product),
      quantity: i.quantity,
    }));
    const { error } = await supabase.from('orders').insert({
      user_id: user.id,
      user_name: profile?.name || '',
      user_email: profile?.email || '',
      items: orderItems,
      total: Math.round(total),
    });
    setPlacing(false);
    if (error) {
      toast({ title: "Order failed", description: error.message, variant: "destructive" });
    } else {
      clearCart();
      toast({ title: "Order placed! 🎉", description: "The shop owner will contact you shortly." });
    }
  };

  const whatsappMsg = `Hi! I'd like to order:\n${items.map(i => `• ${i.product.name} x${i.quantity} - ₹${Math.round(getPrice(i.product) * i.quantity).toLocaleString()}`).join('\n')}\n\nTotal: ₹${Math.round(total).toLocaleString()}`;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-foreground mb-6">Your Cart ({itemCount})</h1>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">Your cart is empty</p>
            <Link to="/mobiles" className="bg-primary text-primary-foreground px-6 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
              Browse Mobiles
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-3">
              {items.map(item => (
                <div key={item.product.id} className="bg-card rounded-lg border border-border p-4 flex gap-4">
                  <img src={item.product.images?.[0] || '/placeholder.svg'} alt={item.product.name} className="w-20 h-20 rounded-md object-cover" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground text-sm truncate">{item.product.name}</h3>
                    <p className="text-xs text-muted-foreground">{item.product.brand}</p>
                    <p className="text-sm font-bold text-foreground mt-1">₹{Math.round(getPrice(item.product)).toLocaleString()}</p>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <button onClick={() => removeFromCart(item.product.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="w-7 h-7 rounded border border-border flex items-center justify-center text-foreground hover:bg-accent transition-colors">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm font-medium text-foreground w-6 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="w-7 h-7 rounded border border-border flex items-center justify-center text-foreground hover:bg-accent transition-colors">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-card rounded-lg border border-border p-6 h-fit sticky top-20">
              <h3 className="font-bold text-foreground mb-4">Order Summary</h3>
              <div className="space-y-2 text-sm mb-4">
                {items.map(i => (
                  <div key={i.product.id} className="flex justify-between text-muted-foreground">
                    <span className="truncate mr-2">{i.product.name} ×{i.quantity}</span>
                    <span>₹{Math.round(getPrice(i.product) * i.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-3 flex justify-between text-foreground font-bold mb-6">
                <span>Total</span><span>₹{Math.round(total).toLocaleString()}</span>
              </div>
              <div className="space-y-3">
                <button onClick={handlePlaceOrder} disabled={placing}
                  className="w-full h-11 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">
                  {placing ? 'Placing...' : 'Place Order'}
                </button>
                <a href={`https://wa.me/${SHOP_INFO.whatsapp}?text=${encodeURIComponent(whatsappMsg)}`} target="_blank" rel="noopener noreferrer"
                  className="w-full h-11 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                  <MessageCircle className="w-4 h-4" /> Order via WhatsApp
                </a>
                <a href={`tel:${SHOP_INFO.phone}`}
                  className="w-full h-11 bg-accent text-accent-foreground rounded-md text-sm font-medium hover:bg-accent/80 transition-colors flex items-center justify-center gap-2">
                  <Phone className="w-4 h-4" /> Call Now
                </a>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
