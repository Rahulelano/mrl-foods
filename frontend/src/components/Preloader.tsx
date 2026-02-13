import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { getSiteSettings } from "@/lib/api";

export const Preloader = () => {
    const [percent, setPercent] = useState(0);
    const [complete, setComplete] = useState(false);
    const [loadingSettings, setLoadingSettings] = useState({
        text: "MRL FOODS",
        imageUrl: "/logo.png"
    });

    useEffect(() => {
        getSiteSettings().then((data) => {
            if (data) {
                setLoadingSettings({
                    text: data.loadingPage?.text || "MRL FOODS",
                    imageUrl: data.loadingPage?.imageUrl || data.logoUrl || "/logo.png"
                });
            }
        }).catch(err => console.error("Failed to load settings", err));

        const timer = setInterval(() => {
            setPercent((prev) => {
                if (prev >= 100) {
                    clearInterval(timer);
                    setTimeout(() => setComplete(true), 500);
                    return 100;
                }
                return prev + 1;
            });
        }, 20); // Duration of loader

        return () => clearInterval(timer);
    }, []);

    return (
        <AnimatePresence>
            {!complete && (
                <motion.div
                    initial={{ y: 0 }}
                    exit={{ y: "-100%" }}
                    transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                    className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-secondary"
                >
                    <div className="relative overflow-hidden mb-8 flex flex-col items-center gap-4">
                        <motion.img
                            src={loadingSettings.imageUrl}
                            alt="MRL Foods"
                            initial={{ y: 50, opacity: 0, scale: 0.8 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="h-32 w-auto object-contain"
                        />
                        <motion.h1
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                            className="text-2xl font-display font-bold text-foreground tracking-[0.2em] uppercase"
                        >
                            {loadingSettings.text}
                        </motion.h1>
                    </div>

                    {/* Optional: Keep progress bar or percentage, or remove if user wants NO text at all. 
                        User said "text vena", implying the big brand name. I'll keep the percentage small or remove it?
                        Let's keep a subtle progress bar at the bottom and remove the big percentage text for a cleaner look if "text vena" meant all text.
                        Actually, I'll keep the percentage but style it elegantly, or just remove it if I want to be safe.
                        Let's remove the large percentage number and just keep the bottom bar.
                    */}
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percent}%` }}
                        className="absolute bottom-0 left-0 h-1 bg-gold"
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
};
