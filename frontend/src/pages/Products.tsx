import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/lib/products-data";
import { GrainOverlay } from "@/components/ui/GrainOverlay";
import { Search } from "lucide-react";
import { getProducts } from "@/lib/api";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";
  const initialSearch = searchParams.get("search") || "";
  const [products, setProducts] = useState<Product[]>([]);
  const [active, setActive] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [shopOurRange, setShopOurRange] = useState<{ title: string; image: string }[]>([]);

  useEffect(() => {
    const categoryFromUrl = searchParams.get("category");
    if (categoryFromUrl) {
      setActive(categoryFromUrl);
    }

    const searchFromUrl = searchParams.get("search");
    if (searchFromUrl !== null) {
      setSearchQuery(searchFromUrl);
    }
  }, [searchParams]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Update URL params
    setSearchParams(prev => {
      if (query) {
        prev.set("search", query);
      } else {
        prev.delete("search");
      }
      return prev;
    });
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    };
    fetchProducts();
  }, []);

  // Derive unique categories from products, ensuring "All" is first
  const dynamicCategories = ["All", ...Array.from(new Set(products.map((p) => p.category).filter(Boolean)))];

  // Filter by category AND search query
  const filtered = products.filter((p) => {
    const matchesCategory = active === "All" || p.category === active;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-background relative flex flex-col lg:flex-row pt-24 lg:pt-0">
      <GrainOverlay />

      {/* Sidebar / Header Section */}
      <aside className="relative lg:w-1/3 xl:w-1/4 lg:h-screen lg:sticky lg:top-0 border-b lg:border-r border-white/10 bg-zinc-950 z-30 flex flex-col justify-between p-8 lg:p-12 lg:pt-28 overflow-y-auto scrollbar-hide">
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="mb-4 inline-block text-xs font-bold uppercase tracking-[0.2em] text-gold/80">
              Best Sellers
            </span>
            <h1 className="font-display text-5xl font-black text-white leading-none tracking-tighter lg:text-7xl">
              Pantry<br /><span className="text-gray-600">Essentials.</span>
            </h1>
            <p className="mt-6 text-sm text-gray-400 font-light leading-relaxed max-w-xs">
              Handpicked, organic produce from the heart of Tamil Nadu. Curated for the modern kitchen.
            </p>
          </motion.div>

          {/* Desktop Filter (Vertical) */}
          <div className="hidden lg:block space-y-2 pt-8 border-t border-white/5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-6">Filter By</h3>
            <button
              onClick={() => setActive("All")}
              className={`block w-full text-left text-lg font-display font-medium transition-all duration-300 ${active === "All" ? "text-gold translate-x-2" : "text-gray-500 hover:text-white hover:translate-x-1"
                }`}
            >
              All Products
            </button>
            {dynamicCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`block w-full text-left text-lg font-display font-medium transition-all duration-300 ${active === cat ? "text-gold translate-x-2" : "text-gray-500 hover:text-white hover:translate-x-1"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Filter & Search */}
        <div className="lg:hidden w-full space-y-4">
          <div className="overflow-x-auto pb-2 scrollbar-none">
            <div className="flex gap-4 min-w-max">
              <button
                onClick={() => setActive("All")}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-colors ${active === "All" ? "bg-gold text-black" : "bg-white/5 text-white border border-white/10"
                  }`}
              >
                All
              </button>
              {dynamicCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActive(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-colors ${active === cat ? "bg-gold text-black" : "bg-white/5 text-white border border-white/10"
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-gold/50 transition-colors"
            />
          </div>
        </div>

        <div className="hidden lg:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-10 pr-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-gold/50 transition-colors"
            />
          </div>
          <p className="mt-6 text-[10px] text-gray-600 uppercase tracking-widest">
            © {new Date().getFullYear()} MRL Foods
          </p>
        </div>
      </aside>

      {/* Main Content Grid */}
      <div className="flex-1 p-4 md:p-8 lg:p-12 lg:pt-28 lg:min-h-screen">
        {/* Shop Our Range Carousel (Tiny) */}
        {shopOurRange.length > 0 && (
          <div className="mb-12">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">Shop Our Range</h3>
            <div className="range-carousel-container flex gap-2 overflow-x-auto pb-4 scrollbar-hide scroll-smooth">
              {shopOurRange.map((item, i) => (
                <div
                  key={i}
                  className="w-[45px] md:w-[55px] lg:w-[65px] flex-shrink-0"
                >
                  <button
                    onClick={() => setActive(item.title)}
                    className="group block text-center w-full"
                  >
                    <div className={`w-[45px] h-[45px] md:w-[55px] md:h-[55px] lg:w-[65px] lg:h-[65px] mb-1 relative overflow-hidden rounded-md transition-all ${active === item.title ? "border-gold bg-gold/20" : "bg-[#f5e9d9] border-white/5"} border flex items-center justify-center`}>
                      <img
                        src={item.image}
                        alt={item.title}
                        className="max-w-full max-h-full object-contain p-1 transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                    <span className={`block font-display text-[6px] font-bold group-hover:text-gold transition-colors truncate px-0.5 ${active === item.title ? "text-gold" : "text-foreground"}`}>{item.title}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <motion.div
          layout
          className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((p) => (
              <motion.div
                layout
                key={p._id || p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
              >
                <ProductCard product={p} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <div className="h-full flex items-center justify-center min-h-[50vh]">
            <p className="text-xl text-gray-500 font-light">No products found in this category.</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default Products;
