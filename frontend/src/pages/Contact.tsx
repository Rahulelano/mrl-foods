import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill all fields");
      return;
    }
    setLoading(true);
    // Simulate generic loading
    setTimeout(() => {
      toast.success("Message sent! We'll get back to you soon.");
      setForm({ name: "", email: "", message: "" });
      setLoading(false);
    }, 1000);
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-hero py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container mx-auto px-4"
        >
          <h1 className="font-display text-4xl font-bold text-primary-foreground md:text-5xl">
            Get in <span className="text-gradient-gold">Touch</span>
          </h1>
          <p className="mt-4 text-lg text-primary-foreground/80">
            We'd love to hear from you. Reach out for queries, orders, or just to say hello.
          </p>
        </motion.div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="rounded-3xl border border-white/10 bg-card/50 p-8 backdrop-blur-xl md:p-10">
              <h2 className="mb-6 font-display text-2xl font-bold text-foreground">Send us a message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Name</label>
                    <input
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full rounded-xl border border-border/50 bg-background/50 px-4 py-3 text-sm outline-none transition-all focus:border-gold focus:ring-1 focus:ring-gold"
                      placeholder="Your name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full rounded-xl border border-border/50 bg-background/50 px-4 py-3 text-sm outline-none transition-all focus:border-gold focus:ring-1 focus:ring-gold"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Message</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    rows={4}
                    className="w-full rounded-xl border border-border/50 bg-background/50 px-4 py-3 text-sm outline-none transition-all focus:border-gold focus:ring-1 focus:ring-gold resize-none"
                    placeholder="How can we help?"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-gold py-4 text-sm font-bold uppercase tracking-wider text-black transition-all hover:bg-gold-light hover:shadow-lg hover:shadow-gold/20 disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col justify-center space-y-8"
          >
            {[
              { icon: MapPin, title: "Visit Us", text: "No: 76, No: 431/10, Thatchur Village, Neduvarambakkam, Ponneri, Tamil Nadu 601204" },
              { icon: Phone, title: "Call Us", text: "+91 98765 43210" },
              { icon: Mail, title: "Email Us", text: "mrlfoods2023@gmail.com" },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + (i * 0.1) }}
                className="group flex gap-6 rounded-2xl border border-transparent p-6 transition-all hover:border-gold/20 hover:bg-gold/5"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold/10 text-gold transition-all group-hover:bg-gold group-hover:text-black">
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground group-hover:text-foreground">{item.text}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </main>
  );
};

export default Contact;
