import { Link, useLocation } from "react-router-dom";
import { Mail, MapPin, Phone, Instagram, Facebook, Twitter } from "lucide-react";
import { useState, useEffect } from "react";
import { getSiteSettings } from "@/lib/api";

const Footer = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  const [logoUrl, setLogoUrl] = useState("/logo.png");

  useEffect(() => {
    getSiteSettings().then((data) => {
      if (data && data.logoUrl) {
        setLogoUrl(data.logoUrl);
      }
    }).catch(err => console.error("Failed to load settings", err));
  }, []);

  if (isAdmin) return null;

  return (
    <footer className="border-t border-border bg-secondary text-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-12 md:grid-cols-4 lg:gap-8">
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <Link to="/" className="inline-block">
              <img
                src={logoUrl}
                alt="MRL FOODS"
                className="h-16 w-auto object-contain"
              />
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Premium quality food products sourced directly from the finest farms of Tamil Nadu. Handcrafted with love and tradition.
            </p>
            <div className="mt-6 flex gap-4">
              {/* Social media links removed as requested */}
            </div>
          </div>

          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-widest text-gold text-primary">Shop</h4>
            <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
              <li><Link to="/products" className="hover:text-primary transition-colors">All Products</Link></li>
              <li><Link to="/products?badge=New" className="hover:text-primary transition-colors">New Arrivals</Link></li>
              <li><Link to="/products?badge=Bestseller" className="hover:text-primary transition-colors">Best Sellers</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-widest text-gold text-primary">Company</h4>
            <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
              <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-primary transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/refund" className="hover:text-primary transition-colors">Refund Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-widest text-gold text-primary">Contact</h4>
            <ul className="mt-6 space-y-4 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>No: 76, Thatchur Village,<br />Ponneri, Tamil Nadu 601204</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-primary" />
                <span>+91 7200697571</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-primary" />
                <span>mrlfoods2023@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-border pt-8 text-center">
          <p className="mb-4 text-xs font-medium text-muted-foreground/60 uppercase tracking-widest max-w-4xl mx-auto leading-relaxed">
            MANUFACTURING OF MACARONI, PASTA, NOODLES ,JAM, SPICES, PEANUT BUTTER, PROTEIN BAR, HEALTH MIX DRINKS, INSTANT FOOD MIX, SPICES, SEASONING POWDERS AND SIMILAR FARINACEOUS PRODUCTS RAW MATER
          </p>
          <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} MRL Foods. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
