import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, Menu, X, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/lib/cart-context";
import { getSiteSettings } from "@/lib/api";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { items } = useCart();
  const cartCount = items.reduce((acc, item) => acc + (item.quantity || 1), 0);
  const isAdmin = location.pathname.startsWith("/admin");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [logoUrl, setLogoUrl] = useState("/logo.png");

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    setIsLoggedIn(!!token);
  }, [location.pathname]); // Re-check on route change (e.g. after login/logout)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setIsOpen(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    // Fetch categories for the dropdown
    import("@/lib/api").then(({ getProducts, getSiteSettings }) => {
      getProducts().then((data) => {
        const uniqueCategories = Array.from(new Set(data.map((p: any) => p.category).filter(Boolean)));
        setCategories(uniqueCategories as string[]);
      }).catch(err => console.error("Failed to load categories", err));

      getSiteSettings().then((data) => {
        if (data && data.logoUrl) {
          setLogoUrl(data.logoUrl);
        }
      }).catch(err => console.error("Failed to load settings", err));
    });
  }, []);

  if (isAdmin) return null;

  const [showMobileSearch, setShowMobileSearch] = useState(false);

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${scrolled ? "bg-background/80 backdrop-blur-md shadow-sm" : "bg-transparent"
        }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between relative">

          {/* Mobile Menu Button - Left */}
          <button
            className="md:hidden p-2 text-foreground z-50"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Desktop Navigation - Left */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-medium hover:text-gold transition-colors">
              Home
            </Link>

            <div className="relative group">
              <button className="text-sm font-medium hover:text-gold transition-colors flex items-center gap-1">
                Categories
              </button>
              <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="bg-card border border-white/10 rounded-lg shadow-xl p-2 min-w-[200px] flex flex-col gap-1">
                  {categories.map((cat) => (
                    <Link
                      key={cat}
                      to={`/products?category=${encodeURIComponent(cat)}`}
                      className="px-4 py-2 text-sm hover:bg-white/5 rounded-md text-foreground hover:text-gold transition-colors text-left"
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <Link to="/products" className="text-sm font-medium hover:text-gold transition-colors">
              Products
            </Link>
          </nav>

          {/* Logo - Center Absolute */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Link to="/" className="flex items-center gap-2">
              <img src={logoUrl} alt="MRL Foods" className="h-12 w-auto object-contain" />
            </Link>
          </div>

          {/* Icons - Right */}
          <div className="flex items-center gap-4">
            {/* Desktop Search */}
            <form onSubmit={handleSearch} className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                className="h-10 w-[200px] rounded-full border border-input bg-background pl-10 pr-4 text-sm focus:border-gold focus:outline-none focus:border-gold transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>

            {/* Mobile Search Toggle */}
            <button
              className="md:hidden p-2 rounded-full hover:bg-secondary/80 transition-colors"
              onClick={() => setShowMobileSearch(!showMobileSearch)}
            >
              <Search className="h-5 w-5 text-foreground" />
            </button>

            <Link to="/contact" className="hidden md:block text-sm font-medium hover:text-gold transition-colors">
              Contact
            </Link>

            <Link to="/cart" className="relative group">
              <div className="p-2 rounded-full hover:bg-secondary/80 transition-colors">
                <ShoppingCart className="h-5 w-5 text-foreground group-hover:text-gold transition-colors" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-black animate-in zoom-in">
                    {cartCount}
                  </span>
                )}
              </div>
            </Link>

            <Link to={isLoggedIn ? "/account" : "/login"} className="hidden sm:block p-2 rounded-full hover:bg-secondary/80 transition-colors group">
              <User className={`h-5 w-5 transition-colors ${isLoggedIn ? "text-gold" : "text-foreground group-hover:text-gold"}`} />
            </Link>
          </div>
        </div>

        {/* Mobile Search Bar (Expandable) */}
        <AnimatePresence>
          {showMobileSearch && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden py-2"
            >
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full h-10 rounded-full border border-input bg-secondary/50 pl-10 pr-4 text-sm focus:border-gold focus:outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-[70] w-[85%] max-w-sm p-8 shadow-2xl flex flex-col"
              style={{ backgroundColor: "#FFFFFF", opacity: 1 }}
            >
              <div className="flex items-center justify-between mb-12">
                <Link to="/" onClick={() => setIsOpen(false)}>
                  <img src="/logo.png" alt="MRL Foods" className="h-10 w-auto" />
                </Link>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full bg-zinc-100 text-zinc-900"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="flex flex-col gap-6 flex-1">
                <Link to="/" className="text-2xl font-display font-bold text-zinc-900 hover:text-gold transition-colors">Home</Link>
                <Link to="/products" className="text-2xl font-display font-bold text-zinc-900 hover:text-gold transition-colors">Products</Link>

                <div className="space-y-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Categories</p>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <Link
                        key={cat}
                        to={`/products?category=${encodeURIComponent(cat)}`}
                        className="px-4 py-2 bg-zinc-100 rounded-full text-sm font-medium text-zinc-800 hover:bg-gold hover:text-black transition-all"
                        onClick={() => setIsOpen(false)}
                      >
                        {cat}
                      </Link>
                    ))}
                  </div>
                </div>

                <Link to="/about" className="text-2xl font-display font-bold text-zinc-900 hover:text-gold transition-colors">About</Link>
                <Link to="/contact" className="text-2xl font-display font-bold text-zinc-900 hover:text-gold transition-colors">Contact</Link>
              </nav>

              <div className="pt-8 border-t border-white/10 mt-auto">
                <Link
                  to={isLoggedIn ? "/account" : "/login"}
                  className="flex items-center gap-4 p-4 bg-gold rounded-2xl text-black font-bold uppercase tracking-wider text-sm justify-center"
                  onClick={() => setIsOpen(false)}
                >
                  <User className="h-5 w-5" />
                  {isLoggedIn ? "My Account" : "Login / Register"}
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
