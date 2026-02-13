import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/lib/cart-context";
import { getProductById, getProducts } from "@/lib/api";
import { Product } from "@/lib/products-data";
import { Star, Minus, Plus, ShoppingCart, ArrowLeft, Truck, Shield, Leaf } from "lucide-react";
import { toast } from "sonner";
import { MagneticButton } from "@/components/ui/MagneticButton";
import ProductCard from "@/components/ProductCard";

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addItem } = useCart();
    const [product, setProduct] = useState<Product | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState<"description" | "ingredients" | "reviews">("description");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const [productData, allProducts] = await Promise.all([
                    getProductById(id),
                    getProducts()
                ]);
                setProduct(productData);
                setRelatedProducts(allProducts.filter((p: Product) => p._id !== id && p.id !== id).slice(0, 4));
            } catch (error) {
                console.error("Failed to fetch product data", error);
                toast.error("Failed to load product details");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleAdd = () => {
        if (!product) return;
        addItem({
            id: product._id || product.id || '',
            name: product.name,
            price: product.price,
            image: product.image,
            weight: product.weight,
            quantity: quantity
        });
        toast.success(`${quantity} x ${product.name} added to cart`);
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-gold border-t-transparent"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
                <h2 className="text-2xl font-bold">Product not found</h2>
                <Link to="/products" className="mt-4 text-gold hover:underline">Back to Products</Link>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-background py-20">
            <div className="container mx-auto px-4">
                {/* Breadcrumb / Back */}
                <Link to="/products" className="mb-8 flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-gold">
                    <ArrowLeft className="h-4 w-4" /> Back to Products
                </Link>

                <div className="grid gap-12 lg:grid-cols-2">
                    {/* Image Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="relative overflow-hidden rounded-3xl border border-white/10 bg-card/30 backdrop-blur-md"
                    >
                        <div className="aspect-square w-full">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                            />
                        </div>
                        {product.badge && (
                            <span className="absolute left-6 top-6 rounded-full bg-gold px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-black shadow-lg">
                                {product.badge}
                            </span>
                        )}
                    </motion.div>

                    {/* Details Section */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col"
                    >
                        <div className="mb-4 flex items-center gap-2">
                            <span className="text-xs font-bold uppercase tracking-widest text-gold">{product.category}</span>
                            <span className="text-muted-foreground">•</span>
                            <div className="flex items-center gap-1 text-gold">
                                <Star className="h-3.5 w-3.5 fill-gold" />
                                <span className="text-xs font-bold text-foreground">4.8</span>
                                <span className="text-xs text-muted-foreground">(24 reviews)</span>
                            </div>
                        </div>

                        <h1 className="font-display text-3xl font-bold leading-tight text-foreground md:text-4xl">
                            {product.name}
                        </h1>

                        <div className="mt-6 flex items-baseline gap-4">
                            <span className="font-display text-3xl font-bold text-foreground">₹{product.price}</span>
                            {product.originalPrice && (
                                <span className="text-lg text-muted-foreground line-through">₹{product.originalPrice}</span>
                            )}
                            {product.originalPrice && (
                                <span className="rounded-md bg-green-500/10 px-2 py-1 text-xs font-bold text-green-500">
                                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                                </span>
                            )}
                        </div>

                        <p className="mt-6 text-base leading-relaxed text-muted-foreground">
                            {product.description} Experience the finest quality sourced directly from our trusted farms.
                            Taste the difference of authentic, premium ingredients in every bite.
                        </p>

                        <div className="mt-8">
                            <h3 className="mb-4 font-display text-lg font-bold text-foreground">Choose your offer</h3>
                            <div className="flex flex-col gap-4">
                                {[
                                    { count: 3, discount: 5, label: "Pack of 3", save: "You save 5%" },
                                    { count: 1, discount: 0, label: "Pack of 1", save: "Standard price" },
                                    { count: 6, discount: 10, label: "Pack of 6", save: "You save 10%", popular: true },
                                ].map((pack) => {
                                    const packPrice = (product.price * pack.count * (1 - pack.discount / 100));
                                    const originalPackPrice = product.price * pack.count;
                                    const isSelected = quantity === pack.count;

                                    return (
                                        <div
                                            key={pack.count}
                                            onClick={() => setQuantity(pack.count)}
                                            className={`relative flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-all ${isSelected
                                                ? "border-green-600 bg-green-950/10 ring-1 ring-green-600"
                                                : "border-white/10 bg-card/50 hover:border-gold/30 hover:bg-card/80"
                                                }`}
                                        >
                                            {pack.popular && (
                                                <div className="absolute -top-3 right-4 bg-green-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                                                    Most Popular
                                                </div>
                                            )}
                                            <div className="flex items-center gap-3">
                                                <div className={`flex h-5 w-5 items-center justify-center rounded-full border ${isSelected ? "border-green-600" : "border-muted-foreground"}`}>
                                                    {isSelected && <div className="h-2.5 w-2.5 rounded-full bg-green-600" />}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-foreground">{pack.label}</h4>
                                                    <span className={`text-xs ${pack.discount > 0 ? "text-green-500 font-bold" : "text-muted-foreground"}`}>
                                                        {pack.save}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-bold text-foreground">₹{Math.round(packPrice)}</div>
                                                {pack.discount > 0 && (
                                                    <div className="text-xs text-muted-foreground line-through">₹{originalPackPrice}</div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="mt-8 flex flex-col gap-4 md:flex">
                            <div className="hidden md:flex items-center gap-4 rounded-xl border border-white/10 bg-card/50 p-4">
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="rounded-lg bg-secondary p-2 text-foreground hover:bg-secondary/80"
                                    >
                                        <Minus className="h-4 w-4" />
                                    </button>
                                    <span className="min-w-[2rem] text-center font-bold text-foreground">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="rounded-lg bg-secondary p-2 text-foreground hover:bg-secondary/80"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </button>
                                </div>
                                <button
                                    onClick={handleAdd}
                                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-600 px-8 py-3 text-sm font-bold uppercase tracking-wider text-white transition-all hover:bg-green-700 active:scale-95 shadow-lg shadow-green-900/20"
                                >
                                    <ShoppingCart className="h-5 w-5" />
                                    Add to Cart
                                </button>
                            </div>
                            <button
                                onClick={() => {
                                    handleAdd();
                                    navigate("/cart");
                                }}
                                className="hidden md:block w-full rounded-xl bg-gold py-4 text-sm font-bold uppercase tracking-wider text-black transition-all hover:bg-gold-light shadow-lg hover:shadow-gold/20 active:scale-95"
                            >
                                Buy It Now
                            </button>
                        </div>

                        {/* Mobile Fixed Bottom Bar */}
                        <div className="fixed bottom-0 left-0 right-0 z-[100] border-t border-white/10 bg-black/80 p-4 backdrop-blur-xl md:hidden">
                            <div className="container mx-auto flex items-center gap-3">
                                <div className="flex h-12 items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-2">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white"
                                    >
                                        <Minus className="h-4 w-4" />
                                    </button>
                                    <span className="min-w-[1.5rem] text-center text-sm font-bold text-white">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </button>
                                </div>
                                <button
                                    onClick={() => {
                                        handleAdd();
                                        navigate("/cart");
                                    }}
                                    className="flex-1 rounded-xl bg-gold py-3 text-xs font-black uppercase tracking-widest text-black shadow-lg shadow-gold/20 active:scale-95 transition-transform"
                                >
                                    Buy It Now
                                </button>
                            </div>
                        </div>

                        <div className="mt-10 grid grid-cols-2 gap-4">
                            <div className="flex items-start gap-3 rounded-2xl border border-white/5 bg-card/20 p-4">
                                <Truck className="h-5 w-5 shrink-0 text-gold" />
                                <div>
                                    <h4 className="text-sm font-bold text-foreground">Free Delivery</h4>
                                    <p className="text-[10px] text-muted-foreground">On orders above ₹699</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 rounded-2xl border border-white/5 bg-card/20 p-4">
                                <Shield className="h-5 w-5 shrink-0 text-gold" />
                                <div>
                                    <h4 className="text-sm font-bold text-foreground">Secure Payment</h4>
                                    <p className="text-[10px] text-muted-foreground">100% secure checkout</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 rounded-2xl border border-white/5 bg-card/20 p-4">
                                <Leaf className="h-5 w-5 shrink-0 text-gold" />
                                <div>
                                    <h4 className="text-sm font-bold text-foreground">100% Natural</h4>
                                    <p className="text-[10px] text-muted-foreground">No preservatives</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Info Tabs */}
                <div className="mt-20">
                    <div className="flex gap-8 border-b border-white/10 pb-1">
                        {["description", "ingredients", "reviews"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                className={`relative pb-4 text-sm font-bold uppercase tracking-wider transition-colors ${activeTab === tab ? "text-gold" : "text-muted-foreground hover:text-foreground"
                                    }`}
                            >
                                {tab}
                                {activeTab === tab && (
                                    <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 h-0.5 w-full bg-gold" />
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="mt-8 min-h-[200px] text-muted-foreground">
                        <AnimatePresence mode="wait">
                            {activeTab === "description" && (
                                <motion.div
                                    key="description"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-4 leading-relaxed"
                                >
                                    <p>{product.description}</p>
                                    <p>
                                        Unlock the secret to healthier meals with MRL Foods. Our products are traditionally processed
                                        to retain maximum nutrients and flavor. Sourced from the best farms in Tamil Nadu,
                                        we ensure that every pack delivers authentic taste and quality.
                                    </p>
                                    <p>
                                        Perfect for daily consumption, suitable for all ages. Store in a cool, dry place
                                        away from direct sunlight.
                                    </p>
                                </motion.div>
                            )}
                            {activeTab === "ingredients" && (
                                <motion.div
                                    key="ingredients"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                >
                                    <ul className="list-disc space-y-2 pl-5">
                                        <li>Premium Quality {product.name.split(" ")[0]}</li>
                                        <li>Natural Spices and Herbs</li>
                                        <li>No Artificial Colors or Flavors</li>
                                        <li>No Preservatives</li>
                                        <li>Traditionally Processed</li>
                                    </ul>
                                </motion.div>
                            )}
                            {activeTab === "reviews" && (
                                <motion.div
                                    key="reviews"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                >
                                    <div className="rounded-2xl border border-white/5 bg-card/20 p-6">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Star className="h-4 w-4 fill-gold text-gold" />
                                            <Star className="h-4 w-4 fill-gold text-gold" />
                                            <Star className="h-4 w-4 fill-gold text-gold" />
                                            <Star className="h-4 w-4 fill-gold text-gold" />
                                            <Star className="h-4 w-4 fill-gold text-gold" />
                                        </div>
                                        <h4 className="font-bold text-foreground">Excellent Quality</h4>
                                        <p className="text-sm mt-1">Really loved the taste and packaging. Will order again!</p>
                                        <p className="text-xs text-muted-foreground mt-2">- Verified Customer</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Related Products */}
                <div className="mt-20">
                    <h2 className="mb-8 font-display text-2xl font-bold text-foreground">You might also like</h2>
                    <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
                        {relatedProducts.map((p) => (
                            <ProductCard key={p._id || p.id} product={p} />
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default ProductDetails;
