import { motion } from "framer-motion";
import { ShoppingCart, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Product } from "@/lib/products-data";
import { useCart } from "@/lib/cart-context";
import { toast } from "sonner";

const ProductCard = ({ product }: { product: Product }) => {
  const { addItem } = useCart();

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id: product._id || product.id || '',
      name: product.name,
      price: product.price,
      image: product.image,
      weight: product.weight,
    });
    toast.success(`${product.name} added to cart`);
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="group relative h-full overflow-hidden rounded-2xl border border-white/5 bg-card/40 backdrop-blur-sm transition-all hover:border-gold/30 hover:shadow-xl hover:shadow-gold/10"
    >
      {product.badge && (
        <span className="absolute left-3 top-3 z-20 rounded-full bg-gold px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-black shadow-sm">
          {product.badge}
        </span>
      )}

      <Link to={`/products/${product._id || product.id}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-secondary/20">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-110"
          />

          {/* Quick Add Overlay */}
          <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/80 to-transparent p-4 transition-transform duration-300 group-hover:translate-y-0">
            <button
              onClick={(e) => {
                e.preventDefault();
                handleAdd(e);
              }}
              className="w-full rounded-xl bg-white py-3 text-sm font-bold text-black shadow-lg transition-transform active:scale-95"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </Link>

      <div className="p-5">
        <div className="mb-2 flex items-center gap-1">
          <Star className="h-3 w-3 fill-gold text-gold" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-gold">{product.category}</span>
        </div>

        <Link to={`/products/${product._id || product.id}`}>
          <h3 className="font-display text-lg font-bold leading-tight text-foreground transition-colors group-hover:text-primary">
            {product.name}
          </h3>
        </Link>

        <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{product.description}</p>

        <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-3">
          <span className="text-xs font-medium text-muted-foreground">{product.weight}</span>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-lg font-bold text-foreground">₹{product.price}</span>
            {product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through">₹{product.originalPrice}</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
