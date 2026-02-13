import { motion } from "framer-motion";
import { Anchor, Wheat, Truck, ShieldCheck, Heart, Leaf } from "lucide-react";
import { GrainOverlay } from "@/components/ui/GrainOverlay";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { useState, useEffect } from "react";
import { getSiteSettings } from "@/lib/api";

const About = () => {
    const [aboutHero, setAboutHero] = useState({
        tagline: "The Captain's Log",
        title: "From High Seas to",
        titleSuffix: "Wholesome Grains"
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const settings = await getSiteSettings();
                if (settings && settings.aboutHero) {
                    setAboutHero(prev => ({ ...prev, ...settings.aboutHero }));
                }
            } catch (error) {
                console.error("Failed to fetch settings", error);
            }
        };
        fetchSettings();
    }, []);

    return (
        <>
            <GrainOverlay />
            <CustomCursor />
            <main className="relative overflow-hidden bg-background">

                {/* Hero Section */}
                <section className="relative h-[60vh] min-h-[500px] w-full flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        {/* Placeholder image until user provides one, using a generic nature/farm one */}
                        <img
                            src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
                            alt="MRL Foods Farm"
                            className="h-full w-full object-cover brightness-[0.7]"
                        />
                        <div className="absolute inset-0 bg-black/40" />
                    </div>

                    <div className="relative z-10 container mx-auto px-4 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <span className="inline-block rounded-full border border-white/20 bg-white/10 px-6 py-2 text-xs font-bold uppercase tracking-[0.3em] text-gold backdrop-blur-md mb-6">
                                {aboutHero.tagline}
                            </span>
                            <h1 className="font-display text-5xl md:text-7xl font-black text-white leading-tight tracking-tighter">
                                {aboutHero.title} <br />
                                <span className="text-gold italic">{aboutHero.titleSuffix}</span>
                            </h1>
                        </motion.div>
                    </div>
                </section>

                {/* Our Story */}
                <section className="py-24 md:py-32">
                    <div className="container mx-auto px-4">
                        <div className="grid md:grid-cols-2 gap-16 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                            >
                                <div className="relative">
                                    <div className="absolute -inset-4 bg-gold/10 rounded-[2rem] transform -rotate-2" />
                                    <img
                                        src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1974&auto=format&fit=crop"
                                        alt="Maritime Heritage"
                                        className="relative rounded-[2rem] shadow-2xl w-full object-cover h-[600px]"
                                    />
                                    <div className="absolute bottom-8 right-8 bg-background p-6 rounded-2xl shadow-xl max-w-xs">
                                        <p className="font-display font-bold text-xl text-primary mb-2">"The world needs better fuel."</p>
                                        <p className="text-sm text-muted-foreground">- Founder's Vision</p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                                className="space-y-8"
                            >
                                <div>
                                    <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">A Mariner’s Manifesto for <span className="text-primary">Clean Food</span></h2>
                                    <div className="h-1 w-20 bg-gold rounded-full" />
                                </div>

                                <p className="text-lg text-muted-foreground leading-relaxed">
                                    Founded by a nautical graduate from the world-renowned Maersk shipping line, MRL Foods was born at the intersection of maritime discipline and a passion for pure nutrition. After years of navigating the globe, our founder recognized a universal need: the world didn't need more "packaged food"—it needed better fuel.
                                </p>
                                <p className="text-lg text-muted-foreground leading-relaxed">
                                    Trading the deck for the kitchen, we’ve pivoted from shipping global cargo to crafting "Clean Label" sustenance. We believe that what you eat should be as reliable and resilient as the crew on a long voyage.
                                </p>

                                <div className="grid grid-cols-2 gap-6 pt-8">
                                    {[
                                        { icon: Anchor, title: "Maritime Roots", desc: "Disciplined approach" },
                                        { icon: ShieldCheck, title: "Zero Error", desc: "Safety mindset" },
                                    ].map((item, i) => (
                                        <div key={i} className="flex gap-4">
                                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                                <item.icon className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-foreground">{item.title}</h4>
                                                <p className="text-sm text-muted-foreground">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* The Philosophy */}
                <section className="py-24 bg-secondary/30 border-y border-border">
                    <div className="container mx-auto px-4 text-center max-w-4xl">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <span className="text-gold font-bold uppercase tracking-widest text-sm mb-4 block">The MRL Philosophy</span>
                            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-8">The "Pristine" Standard</h2>
                            <p className="text-xl text-muted-foreground leading-relaxed">
                                At MRL Foods, we’ve reimagined modern pantry staples using Millets—the ancient, climate-smart superfood of India. We eliminate the "adversities" of modern processing—no synthetic fillers, no hidden chemicals, and absolutely no compromises.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Product Lineup */}
                <section className="py-24">
                    <div className="container mx-auto px-4">
                        <div className="mb-16 text-center">
                            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">Our Product Lineup</h2>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                {
                                    title: "Millet Pasta & Vermicelli",
                                    desc: "The comfort of Italian and Indian classics, reimagined with the high-fiber, gluten-free power of Barnyard, Foxtail, and Finger millets.",
                                    icon: Wheat
                                },
                                {
                                    title: "Protein Bars",
                                    desc: "On-the-go nutrition that stays true to its name—raw, clean, and packed with sustained energy.",
                                    icon: Heart
                                },
                                {
                                    title: "And More",
                                    desc: "A growing range of snacks and staples designed for the health-conscious 'Challenger.'",
                                    icon: Leaf
                                }
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-card p-10 rounded-3xl border border-border hover:border-gold/50 transition-colors group"
                                >
                                    <div className="h-16 w-16 bg-secondary rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-white transition-colors">
                                        <item.icon className="w-8 h-8" />
                                    </div>
                                    <h3 className="font-display text-2xl font-bold text-foreground mb-4">{item.title}</h3>
                                    <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Why MRL */}
                <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                    <div className="container mx-auto px-4 relative z-10">
                        <div className="grid md:grid-cols-2 gap-16">
                            <div>
                                <h2 className="font-display text-4xl md:text-5xl font-bold mb-12">Why MRL?</h2>
                                <div className="space-y-8">
                                    {[
                                        { title: "Nautical Precision", desc: "We bring a 'zero-error' mindset to food safety and ingredient sourcing." },
                                        { title: "100% Transparent", desc: "If it’s not found in nature, it’s not found in our food." },
                                        { title: "Millet-First", desc: "Championing the grains that are good for both your body and the planet." }
                                    ].map((reason, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -30 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: i * 0.1 }}
                                            className="flex gap-6 pb-6 border-b border-white/20 last:border-0"
                                        >
                                            <span className="text-4xl font-black text-white/20 font-display">0{i + 1}</span>
                                            <div>
                                                <h3 className="font-bold text-xl mb-2">{reason.title}</h3>
                                                <p className="text-white/80">{reason.desc}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center justify-center">
                                <div className="text-center">
                                    <p className="font-display text-3xl md:text-4xl font-bold italic leading-tight mb-8">
                                        "We spent years navigating the world. Now, we're helping you navigate your health."
                                    </p>
                                    <div className="flex flex-wrap justify-center gap-4 text-sm font-mono tracking-wider opacity-80">
                                        <span>#TheMRLWay</span>
                                        <span>#CleanMilletMission</span>
                                        <span>#PristineNutrition</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

            </main>
        </>
    );
};

export default About;
