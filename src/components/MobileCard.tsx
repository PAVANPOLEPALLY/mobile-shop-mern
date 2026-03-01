import { Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, CreditCard } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

type Product = Tables<'products'>;

const MobileCard = ({ product }: { product: Product }) => {
  const { addToCart } = useCart();
  const hasDiscount = product.original_price && product.discount && product.discount > 0;
  const finalPrice = hasDiscount ? product.original_price! * (1 - product.discount! / 100) : product.price;

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden group hover:shadow-lg transition-shadow">
      <Link to={`/mobiles/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img src={product.images?.[0] || '/placeholder.svg'} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          {product.stock > 0 && product.stock < 5 && (
            <span className="absolute top-2 left-2 bg-destructive text-destructive-foreground text-xs font-bold px-2 py-1 rounded">
              Only {product.stock} left!
            </span>
          )}
          {hasDiscount && (
            <span className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded">
              {product.discount}% OFF
            </span>
          )}
        </div>
      </Link>
      <div className="p-4">
        <p className="text-xs text-muted-foreground mb-1">{product.brand}</p>
        <Link to={`/mobiles/${product.id}`}>
          <h3 className="font-semibold text-foreground text-sm mb-2 hover:text-primary transition-colors line-clamp-1">{product.name}</h3>
        </Link>
        <div className="flex items-center gap-1 mb-2">
          {product.emi_available && (
            <span className="text-xs bg-accent text-accent-foreground px-1.5 py-0.5 rounded flex items-center gap-1">
              <CreditCard className="w-3 h-3" /> EMI
            </span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-foreground">₹{Math.round(finalPrice).toLocaleString()}</span>
            {hasDiscount && (
              <span className="text-xs text-muted-foreground line-through ml-2">₹{product.original_price!.toLocaleString()}</span>
            )}
          </div>
          <button
            onClick={() => addToCart(product)}
            className="bg-primary text-primary-foreground p-2 rounded-md hover:bg-primary/90 transition-colors"
            aria-label="Add to cart"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileCard;
