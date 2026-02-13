import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowRight, Truck, Shield, Leaf, Star, Heart, CheckCircle, Sparkles, Sprout, ChevronLeft, ChevronRight } from "lucide-react";

import ProductCard from "@/components/ProductCard";
import { categories } from "@/lib/products-data";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Lenis from "lenis";
import { TextReveal } from "@/components/ui/TextReveal";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Preloader } from "@/components/Preloader";
import { GrainOverlay } from "@/components/ui/GrainOverlay";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { getProducts, getSiteSettings } from "@/lib/api";
import { Product } from "@/lib/products-data"; // Import type

const defaultFeatures = [
  { icon: "Leaf", title: "100% Natural", desc: "Pure, preservative-free goodness." },
  { icon: "Truck", title: "Free Shipping", desc: "On orders above ₹699." },
  { icon: "Shield", title: "Secure Payment", desc: "100% secure transactions." },
];

const iconMap: { [key: string]: any } = {
  Leaf,
  Truck,
  Shield,
  Star,
  Heart
};

const testimonials = [
  { name: "Priya R.", text: "The millet noodles are a game changer! My kids love them.", rating: 5 },
  { name: "Suresh K.", text: "Authentic taste of the palm jaggery. Reminds me of my village.", rating: 5 },
  { name: "Anitha M.", text: "Fast delivery and amazing packaging. The honey is pure gold.", rating: 4 },
];

const marqueeText = ["100% ORGANIC", "SUSTAINABLE FARMING", "HANDCRAFTED QUALITY", "PURE INGREDIENTS", "TRADITIONAL RECIPES", "HEALTHY LIVING", "NATURE'S FINEST"];

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);

  const [marqueeList, setMarqueeList] = useState<string[]>(marqueeText);

  const [heroImages, setHeroImages] = useState<string[]>(["/WhatsApp Image 2026-02-11 at 4.00.30 PM.jpeg"]);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [currentPosterIndex, setCurrentPosterIndex] = useState(0);

  const [homeHero, setHomeHero] = useState({
    title: "From Soil to Soul.",
    subtitle: "Authentic. Unadulterated.",
    description: "Eat like your ancestors, live for the future. Handcrafted essentials for the modern households."
  });

  const [newsletterSection, setNewsletterSection] = useState({
    title: "Global distribution & Third- Party Manufacturing",
    tagline: "Partner with Us",
    buttonText: "Subscribe"
  });

  const [shopOurRange, setShopOurRange] = useState<{ title: string; image: string }[]>([]);
  const [trendingVideos, setTrendingVideos] = useState<string[]>([]);
  const [posters, setPosters] = useState<string[]>([]);
  const [featuresList, setFeaturesList] = useState(defaultFeatures);
  const [brandsList, setBrandsList] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, settingsData] = await Promise.all([
          getProducts(),
          getSiteSettings()
        ]);

        setProducts(productsData);
        if (settingsData) {
          if (settingsData.heroImages && settingsData.heroImages.length > 0) {
            setHeroImages(settingsData.heroImages);
          } else if (settingsData.heroImage) {
            setHeroImages([settingsData.heroImage]);
          }
          if (settingsData.marqueeText) {
            // Split by comma and trim to create the list
            const list = settingsData.marqueeText.split(',').map((item: string) => item.trim()).filter((item: string) => item.length > 0);
            if (list.length > 0) {
              setMarqueeList(list);
            }
          }
          if (settingsData.homeHero) {
            setHomeHero(prev => ({ ...prev, ...settingsData.homeHero }));
          }
          if (settingsData.newsletterSection) {
            setNewsletterSection(prev => ({ ...prev, ...settingsData.newsletterSection }));
          }
          if (settingsData.shopOurRange) {
            setShopOurRange(settingsData.shopOurRange);
          }
          if (settingsData.trendingVideos) {
            setTrendingVideos(settingsData.trendingVideos);
          }
          if (settingsData.posters) {
            setPosters(settingsData.posters);
          }
          if (settingsData.features && settingsData.features.length > 0) {
            setFeaturesList(settingsData.features);
          }
          if (settingsData.brands && settingsData.brands.length > 0) {
            setBrandsList(settingsData.brands);
          }
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };
    fetchData();
  }, []);

  // Hero Slider Effect
  useEffect(() => {
    if (heroImages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [heroImages]);

  // Poster Slider Effect
  useEffect(() => {
    if (posters.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentPosterIndex((prev) => (prev + 1) % posters.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [posters]);

  const bestSellers = products.filter((p) => p.badge === "Bestseller").slice(0, 4);
  const newArrivals = products.filter((p) => p.badge === "New").slice(0, 4);

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const { scrollY } = useScroll();
  const yHero = useTransform(scrollY, [0, 1000], [0, 400]);
  const opacityHero = useTransform(scrollY, [0, 500], [1, 0]);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <>
      <Preloader />
      <GrainOverlay />
      <CustomCursor />

      <main ref={containerRef} className="relative overflow-hidden bg-background">

        {/* Cinematic Hero Slider */}
        <section className="relative h-screen min-h-[800px] w-full overflow-hidden">
          <motion.div style={{ y: yHero }} className="absolute inset-0 z-0">
            {heroImages.map((img, idx) => (
              <motion.img
                key={idx}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{
                  opacity: currentHeroIndex === idx ? 1 : 0,
                  scale: currentHeroIndex === idx ? 1 : 1.1
                }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                src={img}
                alt={`Premium Indian food products ${idx + 1} `}
                className="absolute inset-0 h-full w-full object-cover brightness-[0.7]"
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-transparent to-background" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.2)_100%)]" />
          </motion.div>

          <div className="relative z-10 flex h-full items-center justify-center px-4 text-center">
            <div className="container mx-auto">
              <div className="mx-auto max-w-6xl">
                <div className="mb-8 flex justify-center overflow-hidden">
                  <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 3.2, duration: 1, ease: "easeOut" }}
                    className="relative"
                  >
                    <span className="relative z-10 inline-block rounded-full border border-white/10 bg-white/5 px-6 py-2 text-xs font-bold uppercase tracking-[0.3em] text-gold backdrop-blur-md">
                      Est. 2023 • Premium
                    </span>
                    <div className="absolute -inset-1 blur-lg bg-gold/20 rounded-full" />
                  </motion.div>
                </div>

                <h1 className="font-display text-4xl font-black leading-tight text-white md:text-7xl lg:text-8xl tracking-tighter mix-blend-overlay">
                  <div className="overflow-hidden">
                    <TextReveal text={homeHero.title} className="justify-center text-4xl md:text-7xl lg:text-8xl" delay={3.5} />
                  </div>
                  <motion.div
                    initial={{ clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)" }}
                    animate={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)" }}
                    transition={{ delay: 4.2, duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                    className="block text-white/90 mt-2"
                  >
                    {homeHero.subtitle}
                  </motion.div>
                </h1>

                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 4.8, duration: 1 }}
                  className="mx-auto mt-10 max-w-3xl text-sm text-white/80 md:text-2xl font-light leading-relaxed tracking-wide px-4"
                >
                  {homeHero.description}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 5.0, duration: 1 }}
                  className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8"
                >
                  <MagneticButton>
                    <Link
                      to="/products"
                      className="group relative flex h-14 w-full sm:w-64 items-center justify-center overflow-hidden rounded-full bg-gold text-black transition-all hover:scale-105"
                    >
                      <span className="relative z-10 text-xs font-bold uppercase tracking-widest group-hover:text-white transition-colors duration-300">Start Shopping</span>
                      <div className="absolute inset-0 scale-x-0 origin-left bg-white transition-transform duration-500 will-change-transform group-hover:scale-x-100" />
                    </Link>
                  </MagneticButton>

                  <MagneticButton>
                    <Link
                      to="/products?category=Combo Packs"
                      className="group relative flex h-14 w-full sm:w-64 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-white/5 text-white backdrop-blur-sm transition-all hover:bg-white/10"
                    >
                      <span className="relative z-10 flex items-center gap-3 text-xs font-bold uppercase tracking-widest">
                        <Sparkles className="h-4 w-4 text-gold" />
                        View Combos
                      </span>
                    </Link>
                  </MagneticButton>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            style={{ opacity: opacityHero }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 5.5, duration: 2 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2"
          >
            <div className="flex flex-col items-center gap-4">
              <span className="text-[10px] uppercase tracking-[0.3em] text-white/40">Scroll</span>
              <div className="h-16 w-[1px] bg-gradient-to-b from-transparent via-white/40 to-transparent">
                <motion.div
                  animate={{ y: [0, 64, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="h-1/2 w-full bg-gold blur-[1px]"
                />
              </div>
            </div>
          </motion.div>
        </section>

        {/* Infinite Marquee */}
        <section className="relative z-20 overflow-hidden bg-gold py-6 -mt-1 transform rotate-1 scale-105 origin-left">
          <div className="flex w-max animate-marquee gap-12 whitespace-nowrap">
            {[...marqueeList, ...marqueeList, ...marqueeList, ...marqueeList].map((text, i) => (
              <div key={i} className="flex items-center gap-12 text-black">
                <span className="text-xl font-black uppercase tracking-tighter">{text}</span>
                <div className="h-3 w-3 rounded-full bg-black/50" />
              </div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-background border-b border-white/5">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {featuresList.map((feature, i) => {
                const IconComponent = iconMap[feature.icon] || Leaf;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex flex-col items-center text-center group"
                  >
                    <div className="mb-6 rounded-2xl bg-secondary/10 p-5 text-gold group-hover:bg-gold group-hover:text-black transition-all duration-500 transform group-hover:scale-110 shadow-lg shadow-gold/5">
                      <IconComponent className="h-8 w-8" />
                    </div>
                    <h3 className="mb-3 text-xl font-bold text-foreground">{feature.title}</h3>
                    <p className="max-w-[250px] text-zinc-500 font-medium leading-relaxed">
                      {feature.desc}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Our Brands Section */}
        {brandsList.length > 0 && (
          <section className="py-12 bg-white/5 border-b border-white/5 overflow-hidden">
            <div className="container mx-auto px-4 mb-8 text-center">
              <span className="text-[10px] uppercase tracking-[0.4em] text-gold font-black">Trusted By Brands</span>
            </div>
            <div className="flex w-max animate-marquee gap-24 items-center whitespace-nowrap">
              {[...brandsList, ...brandsList, ...brandsList, ...brandsList].map((brand, i) => (
                <div key={i} className="flex items-center group cursor-default h-16 w-32 md:w-48">
                  <img
                    src={brand}
                    alt="Brand Logo"
                    className="h-full w-full object-contain filter grayscale invert opacity-40 group-hover:opacity-100 group-hover:grayscale-0 group-hover:invert-0 transition-all duration-500 transform group-hover:scale-110"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Shop Our Range Section */}
        {shopOurRange.length > 0 && (
          <section className="py-24 relative overflow-hidden bg-background">
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-gold/5 blur-[100px] -ml-32" />
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                <div className="max-w-xl">
                  <motion.h2
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4"
                  >
                    Shop Our <span className="text-gold italic">Range</span>
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-muted-foreground text-lg"
                  >
                    Discover our carefully curated selection of premium, authentic food products.
                  </motion.p>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      const container = document.querySelector('.range-carousel-container');
                      container?.scrollBy({ left: -400, behavior: 'smooth' });
                    }}
                    className="h-12 w-12 rounded-full border border-gold/30 bg-gold/5 flex items-center justify-center text-gold transition-all"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={() => {
                      const container = document.querySelector('.range-carousel-container');
                      container?.scrollBy({ left: 400, behavior: 'smooth' });
                    }}
                    className="h-12 w-12 rounded-full border border-gold/30 bg-gold/5 flex items-center justify-center text-gold transition-all"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="relative">
                <div className="range-carousel-container flex gap-6 overflow-x-auto pb-8 scrollbar-hide scroll-smooth snap-x snap-mandatory">
                  {shopOurRange.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="w-[220px] md:w-[260px] lg:w-[300px] flex-shrink-0 snap-start"
                    >
                      <Link to="/products" className="group block space-y-4">
                        <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-[#f5e9d9] border border-white/5 flex items-center justify-center p-6">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="max-w-full max-h-full object-contain transition-transform duration-700"
                          />
                        </div>
                        <h3 className="font-display text-2xl font-bold text-center group-hover:text-gold transition-colors">{item.title}</h3>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )
        }

        {/* New Arrivals Section - Dynamic */}
        <section className="py-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-24 -mr-24 h-96 w-96 rounded-full bg-gold/5 blur-[100px]" />
          <div className="absolute bottom-0 left-0 -mb-24 -ml-24 h-96 w-96 rounded-full bg-blue-500/5 blur-[100px]" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="mb-12 flex flex-col items-center text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 mb-6"
              >
                <div className="h-[1px] w-8 bg-gold/50" />
                <span className="flex items-center gap-2 text-gold font-black uppercase tracking-[0.4em] text-[10px]">
                  <Sparkles className="h-3 w-3" /> Just Arrived
                </span>
                <div className="h-[1px] w-8 bg-gold/50" />
              </motion.div>
              <h2 className="font-display text-4xl font-black text-foreground md:text-7xl tracking-tighter mb-4">
                The New <span className="text-zinc-400 italic font-serif">Essentials.</span>
              </h2>
              <p className="max-w-xl text-muted-foreground text-sm uppercase tracking-widest font-medium">Freshly sourced batches of your favorite staples.</p>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-8 sm:gap-y-16 lg:grid-cols-4">
              {(newArrivals.length > 0 ? newArrivals : products.slice(0, 4)).map((p, i) => (
                <motion.div
                  key={p._id || p.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                >
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </div>

            <div className="mt-12 flex justify-center">
              <MagneticButton>
                <Link
                  to="/products"
                  className="flex items-center gap-4 group rounded-full border border-white/10 bg-white/5 px-10 py-4 text-xs font-bold uppercase tracking-widest text-foreground hover:bg-white/10 transition-colors"
                >
                  Explore Full Catalog
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </MagneticButton>
            </div>
          </div>
        </section>

        {/* Trending Videos Section */}
        {
          trendingVideos.length > 0 && (
            <section className="py-24 relative overflow-hidden bg-background/50 border-y border-white/5">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-full w-full bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.05)_0%,transparent_70%)] pointer-events-none" />

              <div className="container mx-auto px-4 relative z-10">
                <div className="mb-16 flex flex-col items-center text-center">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3 mb-6"
                  >
                    <div className="h-[1px] w-8 bg-gold/50" />
                    <span className="flex items-center gap-2 text-gold font-black uppercase tracking-[0.4em] text-[10px]">
                      <Sparkles className="h-3 w-3" /> Buzzing Now
                    </span>
                    <div className="h-[1px] w-8 bg-gold/50" />
                  </motion.div>
                  <h2 className="font-display text-5xl font-black text-foreground md:text-7xl tracking-tighter mb-4">
                    What's <span className="text-zinc-400 italic font-serif">Trending</span>
                  </h2>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                  {trendingVideos.map((video, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1, duration: 0.8 }}
                      className="relative aspect-[9/16] overflow-hidden rounded-2xl border border-white/10 bg-black group"
                    >
                      <video
                        src={video}
                        className="h-full w-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700"
                        autoPlay
                        muted
                        loop
                        playsInline
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                      <div className="absolute bottom-4 left-4">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
                          <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">Trending now</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          )
        }

        {/* Promotional Posters Slider Section */}
        {
          posters.length > 0 && (
            <section className="relative h-[70vh] md:h-[90vh] w-full overflow-hidden bg-background">
              <AnimatePresence initial={false}>
                <motion.div
                  key={currentPosterIndex}
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                  className="absolute inset-0"
                >
                  <img
                    src={posters[currentPosterIndex]}
                    alt={`Special Announcement ${currentPosterIndex + 1} `}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </motion.div>
              </AnimatePresence>

              {/* Slider Indicators */}
              {posters.length > 1 && (
                <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-3 z-20">
                  {posters.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPosterIndex(i)}
                      className={`h - 1.5 transition - all duration - 500 rounded - full ${currentPosterIndex === i ? "bg-gold w-8" : "bg-white/30 w-2 hover:bg-white/50"
                        } `}
                    />
                  ))}
                </div>
              )}

              {/* Arrow Navigation */}
              {posters.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentPosterIndex((prev) => (prev - 1 + posters.length) % posters.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 rounded-full bg-black/20 p-3 text-white backdrop-blur-md transition-all hover:bg-gold hover:text-black md:left-8"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={() => setCurrentPosterIndex((prev) => (prev + 1) % posters.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 rounded-full bg-black/20 p-3 text-white backdrop-blur-md transition-all hover:bg-gold hover:text-black md:right-8"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}
            </section>
          )
        }

        {/* Best Sellers */}
        <section className="py-12 bg-secondary/5 border-y border-white/5">
          <div className="container mx-auto px-4">
            <div className="mb-12 flex flex-wrap items-end justify-between gap-8">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <span className="mb-4 block font-mono text-xs uppercase tracking-[0.2em] text-gold">Most Loved</span>
                <h2 className="font-display text-5xl font-black text-foreground md:text-6xl tracking-tight">Best Sellers</h2>
              </motion.div>
              <MagneticButton>
                <Link to="/products" className="group flex items-center gap-3 text-base font-bold uppercase tracking-wider text-muted-foreground hover:text-gold transition-colors">
                  View All Products
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-2" />
                </Link>
              </MagneticButton>
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-16 md:grid-cols-4">
              {bestSellers.map((p, i) => (
                <motion.div
                  key={p._id || p.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Brand Story Section */}
        <section className="relative overflow-hidden py-16">
          <motion.div style={{ y: useTransform(scrollYProgress, [0, 1], [0, -200]) }} className="absolute inset-0 z-0">
            <img src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" className="h-full w-full object-cover opacity-20 filter grayscale contrast-125" alt="Farm" />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-transparent" />
          </motion.div>

          <div className="container relative z-10 mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-20">
              <div className="md:w-1/2">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center gap-6 mb-10">
                    <div className="h-[2px] w-20 bg-gold" />
                    <span className="text-primary font-black uppercase tracking-[0.3em] text-xs">The MRL Promise</span>
                  </div>
                  <h2 className="font-display text-5xl md:text-7xl font-black text-foreground leading-[0.9] mb-12 tracking-tighter">
                    From Soil to <br />
                    <span className="text-primary/20 italic font-serif">Soul.</span>
                  </h2>
                  <div className="space-y-8 text-lg text-zinc-600 font-medium leading-relaxed">
                    <p>
                      In a world of mass production, we act as the bridge to the ancestral way of life. MRL Foods isn't just about products; it's about reclaiming the purity that nature intended.
                    </p>
                    <p>
                      Sourced from the pristine lands of Tamil Nadu, verified by tradition, and delivered with integrity.
                    </p>
                  </div>
                  <div className="mt-16">
                    <MagneticButton>
                      <Link to="/about" className="inline-flex h-14 items-center justify-center gap-3 rounded-full border border-white/20 bg-transparent px-8 text-sm font-bold uppercase tracking-widest text-white transition-all hover:bg-white hover:text-black">
                        Discover Our Story
                      </Link>
                    </MagneticButton>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-24 bg-background relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 blur-[120px] -mr-48" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <span className="text-gold font-mono text-xs uppercase tracking-[0.3em] mb-4 block">Our Community</span>
              <h2 className="font-display text-5xl font-black text-foreground md:text-6xl tracking-tighter">Words of <span className="text-zinc-500 italic">Love</span></h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-[2rem] border border-white/5 bg-white/5 p-10 hover:border-gold/20 transition-all duration-500 group"
                >
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, index) => (
                      <Star key={index} className={`h - 4 w - 4 ${index < t.rating ? 'text-gold fill-gold' : 'text-zinc-600'} `} />
                    ))}
                  </div>
                  <p className="text-xl text-foreground font-medium mb-8 leading-relaxed italic group-hover:text-gold transition-colors duration-500">
                    "{t.text}"
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold">
                      {t.name[0]}
                    </div>
                    <span className="font-bold text-foreground">{t.name}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-16 bg-background relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="mx-auto max-w-5xl rounded-[3rem] border border-white/5 bg-white/5 p-2 shadow-2xl backdrop-blur-xl">
              <div className="rounded-[2.5rem] bg-secondary px-6 py-24 md:px-24 text-center border border-white/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
                <div className="relative z-10">
                  <h2 className="font-display text-4xl font-black text-foreground md:text-5xl tracking-tight mb-6">{newsletterSection.title}</h2>
                  <p className="mx-auto max-w-lg text-muted-foreground text-lg mb-12">
                    {newsletterSection.tagline}
                  </p>
                  <div className="mx-auto flex max-w-lg flex-col gap-4 sm:flex-row">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="flex-1 rounded-full border border-border bg-background px-8 py-5 text-foreground outline-none transition-all focus:border-gold/50 focus:bg-background"
                    />
                    <MagneticButton>
                      <button className="h-full w-full sm:w-auto rounded-full bg-gold px-10 py-5 font-bold text-black transition-all hover:scale-105">
                        {newsletterSection.buttonText}
                      </button>
                    </MagneticButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main >
    </>
  );
};

export default Index;
