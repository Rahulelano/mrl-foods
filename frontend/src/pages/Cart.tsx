import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const Cart = () => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, totalPrice } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    street: "",
    city: "",
    zip: ""
  });

  const handleProceedToPay = () => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      toast.error("Please login to place an order");
      navigate("/login");
      return;
    }
    setShowCheckout(true);
  };

  const handlePayment = async () => {
    // Validate form
    if (!formData.name || !formData.phone || !formData.street || !formData.city || !formData.zip) {
      toast.error("Please fill in all details");
      return;
    }

    const token = localStorage.getItem("userToken");
    setIsProcessing(true);
    try {
      // Store order details for mock payment success notification
      localStorage.setItem("pendingOrder", JSON.stringify({
        customerDetails: formData,
        items: items.map(i => ({ name: i.name, quantity: i.quantity, price: i.price }))
      }));

      // Call our backend API instead of Supabase
      const response = await fetch('/api/payment/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: totalPrice
        })
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Order placed successfully! (Mock)");
        window.location.href = data.url || "/account";
      } else {
        throw new Error(data.message || "Payment failed");
      }

    } catch (error) {
      toast.error("Failed to initiate payment. Please try again.");
      console.error(error);
    } finally {
      setIsProcessing(false);
      setShowCheckout(false);
    }
  };

  if (items.length === 0) {
    return (
      <main className="flex min-h-[70vh] flex-col items-center justify-center bg-background px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex h-24 w-24 items-center justify-center rounded-full bg-secondary/30 text-muted-foreground"
        >
          <ShoppingBag className="h-10 w-10 opacity-50" />
        </motion.div>
        <h2 className="mt-6 font-display text-2xl font-bold text-foreground">Your cart is empty</h2>
        <p className="mt-2 text-muted-foreground">Looks like you haven't added anything yet.</p>
        <Link
          to="/products"
          className="mt-8 rounded-full bg-gold px-8 py-3 text-sm font-bold uppercase tracking-wider text-black transition-all hover:bg-gold-light hover:shadow-lg hover:shadow-gold/20"
        >
          Start Shopping
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background py-16">
      <div className="container mx-auto px-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-3xl font-bold text-foreground md:text-4xl"
        >
          Your <span className="text-gradient-gold">Cart</span>
        </motion.h1>

        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {items.map((item, i) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-4 rounded-2xl border border-white/5 bg-card/40 p-4 backdrop-blur-md sm:gap-6 sm:p-6"
              >
                <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-secondary/20">
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                </div>

                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <div className="flex justify-between">
                      <h3 className="font-display text-base font-bold text-foreground sm:text-lg">{item.name}</h3>
                      <p className="font-display text-base font-bold text-foreground">₹{item.price * item.quantity}</p>
                    </div>
                    <p className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">{item.weight}</p>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-secondary/50 p-1">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="rounded-md p-1.5 text-foreground hover:bg-white/10"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="rounded-md p-1.5 text-foreground hover:bg-white/10"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="group flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-400/10"
                    >
                      <Trash2 className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
                      <span className="hidden sm:inline">Remove</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="h-fit rounded-3xl border border-white/10 bg-card/60 p-6 backdrop-blur-xl md:p-8"
          >
            <h3 className="font-display text-xl font-bold text-foreground">Order Summary</h3>
            <div className="mt-6 space-y-4">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Subtotal</span><span>₹{totalPrice}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Delivery</span><span className="text-gold font-bold">Free</span>
              </div>
              <div className="my-4 h-[1px] bg-white/10" />
              <div className="flex justify-between text-lg font-bold text-foreground">
                <span>Total</span><span>₹{totalPrice}</span>
              </div>
            </div>
            <button
              onClick={handleProceedToPay}
              disabled={isProcessing}
              className="mt-8 w-full rounded-xl bg-gold py-4 text-sm font-bold uppercase tracking-wider text-black transition-all hover:bg-gold-light hover:shadow-lg hover:shadow-gold/20 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <span className="flex items-center justify-center gap-2">
                {isProcessing ? "Processing..." : "Proceed to Pay"}
                {!isProcessing && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
              </span>
            </button>
            <p className="mt-4 text-center text-[10px] text-muted-foreground">
              Secured by PhonePe. 100% Safe & Secure.
            </p>
          </motion.div>
          <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Checkout Details</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter email (optional)"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="street">Street Address</Label>
                  <Textarea
                    id="street"
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    placeholder="Enter street address"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="City"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="zip">ZIP Code</Label>
                    <Input
                      id="zip"
                      value={formData.zip}
                      onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                      placeholder="ZIP"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full rounded-xl bg-gold py-3 text-sm font-bold uppercase tracking-wider text-black transition-all hover:bg-gold-light hover:shadow-lg disabled:opacity-50"
                >
                  {isProcessing ? "Processing..." : "Pay Now"}
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </main>
  );
};

export default Cart;
