import AdminSidebar from '@/components/layout/AdminSidebar';
import Navbar from '@/components/layout/Navbar';
import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

type Product = Tables<'products'>;

interface ProductForm {
  name: string; brand: string; category: string; price: number; original_price: number | null;
  discount: number; emi_available: boolean; description: string; stock: number;
  specifications: Record<string, string>; images: string[];
}

const emptyForm: ProductForm = {
  name: '', brand: '', category: 'mobile', price: 0, original_price: null,
  discount: 0, emi_available: false, description: '', stock: 0,
  specifications: {}, images: [],
};

const ManageMobiles = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [imageUrl, setImageUrl] = useState('');
  const { toast } = useToast();

  const fetchProducts = () => {
    supabase.from('products').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      if (data) setProducts(data);
    });
  };

  useEffect(() => { fetchProducts(); }, []);

  const openNew = () => { setForm(emptyForm); setEditingId(null); setShowForm(true); };
  const openEdit = (p: Product) => {
    setForm({
      name: p.name, brand: p.brand, category: p.category, price: p.price,
      original_price: p.original_price, discount: p.discount || 0, emi_available: p.emi_available || false,
      description: p.description || '', stock: p.stock,
      specifications: (p.specifications as Record<string, string>) || {},
      images: p.images || [],
    });
    setEditingId(p.id);
    setShowForm(true);
  };

  const save = async () => {
    if (!form.name || !form.brand || !form.price) {
      toast({ title: "Fill required fields", variant: "destructive" }); return;
    }
    const payload = {
      name: form.name, brand: form.brand, category: form.category, price: form.price,
      original_price: form.original_price, discount: form.discount, emi_available: form.emi_available,
      description: form.description, stock: form.stock, specifications: form.specifications, images: form.images,
    };
    if (editingId) {
      const { error } = await supabase.from('products').update(payload).eq('id', editingId);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Product updated!" });
    } else {
      const { error } = await supabase.from('products').insert(payload);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Product added!" });
    }
    setShowForm(false);
    fetchProducts();
  };

  const remove = async (id: string) => {
    await supabase.from('products').delete().eq('id', id);
    toast({ title: "Product deleted" });
    fetchProducts();
  };

  const addImage = () => {
    if (imageUrl.trim()) {
      setForm({ ...form, images: [...form.images, imageUrl.trim()] });
      setImageUrl('');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-foreground">Manage Products</h1>
            <button onClick={openNew} className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Product
            </button>
          </div>

          <div className="bg-card rounded-lg border border-border overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground border-b border-border">
                  <th className="p-3">Name</th><th className="p-3">Brand</th><th className="p-3">Price</th>
                  <th className="p-3">Stock</th><th className="p-3">EMI</th><th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id} className="border-b border-border last:border-0">
                    <td className="p-3 text-foreground font-medium">{p.name}</td>
                    <td className="p-3 text-muted-foreground">{p.brand}</td>
                    <td className="p-3 text-foreground">₹{p.price.toLocaleString()}</td>
                    <td className="p-3"><span className={p.stock < 5 ? 'text-destructive font-bold' : 'text-muted-foreground'}>{p.stock}</span></td>
                    <td className="p-3">{p.emi_available ? '✓' : '—'}</td>
                    <td className="p-3 flex gap-2">
                      <button onClick={() => openEdit(p)} className="text-muted-foreground hover:text-primary transition-colors"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => remove(p.id)} className="text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {showForm && (
            <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-card rounded-lg border border-border w-full max-w-lg max-h-[85vh] overflow-y-auto p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-foreground">{editingId ? 'Edit' : 'Add'} Product</h2>
                  <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
                </div>
                <div className="space-y-3">
                  <input placeholder="Name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                  <input placeholder="Brand *" value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                  <div className="grid grid-cols-2 gap-3">
                    <input placeholder="Price *" type="number" value={form.price || ''} onChange={e => setForm({ ...form, price: Number(e.target.value) })}
                      className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                    <input placeholder="Original Price" type="number" value={form.original_price || ''} onChange={e => setForm({ ...form, original_price: Number(e.target.value) || null })}
                      className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input placeholder="Discount %" type="number" value={form.discount || ''} onChange={e => setForm({ ...form, discount: Number(e.target.value) })}
                      className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                    <input placeholder="Stock" type="number" value={form.stock || ''} onChange={e => setForm({ ...form, stock: Number(e.target.value) })}
                      className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                  </div>
                  <textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring min-h-[60px]" />
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                    <option value="mobile">Mobile</option><option value="accessory">Accessory</option>
                  </select>
                  <label className="flex items-center gap-2 text-sm text-foreground">
                    <input type="checkbox" checked={form.emi_available} onChange={e => setForm({ ...form, emi_available: e.target.checked })} className="rounded" /> EMI Available
                  </label>

                  {/* Image URLs */}
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1">Images</label>
                    <div className="flex gap-2 mb-2">
                      <input placeholder="Image URL" value={imageUrl} onChange={e => setImageUrl(e.target.value)}
                        className="flex-1 h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                      <button type="button" onClick={addImage} className="bg-accent text-accent-foreground px-3 rounded-md text-sm">Add</button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {form.images.map((img, i) => (
                        <div key={i} className="relative w-16 h-16 rounded overflow-hidden border border-border">
                          <img src={img} alt="" className="w-full h-full object-cover" />
                          <button onClick={() => setForm({ ...form, images: form.images.filter((_, j) => j !== i) })}
                            className="absolute top-0 right-0 bg-destructive text-destructive-foreground text-xs w-4 h-4 flex items-center justify-center">×</button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button onClick={save} className="w-full h-10 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
                    {editingId ? 'Update' : 'Add'} Product
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ManageMobiles;
