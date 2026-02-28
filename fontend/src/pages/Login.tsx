import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Loader2, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { requestOTP, verifyOTP, getSiteSettings } from "@/lib/api";

const Login = () => {
  const [step, setStep] = useState<"input" | "otp">("input");
  const [inputValue, setInputValue] = useState("");
  const [inputType, setInputType] = useState<"email" | "phone" | null>(null);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [logoUrl, setLogoUrl] = useState("/logo.png");
  const navigate = useNavigate();

  useEffect(() => {
    getSiteSettings().then(data => {
      if (data && data.logoUrl) setLogoUrl(data.logoUrl);
    }).catch(err => console.error(err));
  }, []);

  const validateInput = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    if (emailRegex.test(value)) return "email";
    if (phoneRegex.test(value)) return "phone";
    return null;
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const type = validateInput(inputValue);

    if (!type) {
      toast.error("Please enter a valid email or 10-digit phone number");
      return;
    }

    setInputType(type);
    setLoading(true);
    try {
      const payload = type === "email" ? { email: inputValue } : { phone: inputValue };
      await requestOTP(payload);
      setStep("otp");
      toast.success(`OTP sent to your ${type}!`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) {
      toast.error("Please enter the 6-digit OTP");
      return;
    }
    setLoading(true);
    try {
      const payload = inputType === "email" ? { email: inputValue } : { phone: inputValue };
      const data = await verifyOTP(payload, otp);
      localStorage.setItem("userToken", data.token);
      if (data.email) localStorage.setItem("userEmail", data.email);
      if (data.phone) localStorage.setItem("userPhone", data.phone);

      toast.success("Logged in successfully!");
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="rounded-3xl border border-white/10 bg-card/40 p-8 backdrop-blur-xl md:p-10 shadow-2xl shadow-warm/10">
          <div className="text-center mb-8">
            <Link to="/" className="inline-block">
              <img
                src={logoUrl}
                alt="MRL FOODS"
                className="mx-auto h-20 w-auto object-contain"
              />
            </Link>
          </div>

          <AnimatePresence mode="wait">
            {step === "input" ? (
              <motion.form
                key="input"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleSendOtp}
                className="mt-8"
              >
                <h2 className="font-display text-xl font-bold text-foreground">Welcome Back</h2>
                <p className="mt-2 text-sm text-muted-foreground">Enter your email or mobile to continue</p>

                <div className="mt-6">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Email / Phone
                  </label>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="rounded-xl border border-white/10 bg-secondary/50 px-4 py-3.5 text-sm font-medium text-muted-foreground">
                      <User className="h-5 w-5" />
                    </div>
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="user@example.com or 9876543210"
                      className="flex-1 rounded-xl border border-white/10 bg-secondary/50 px-4 py-3.5 text-sm text-foreground outline-none transition-all focus:border-gold/50 focus:ring-1 focus:ring-gold/50"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-gold py-4 text-sm font-bold uppercase tracking-wider text-black transition-all hover:bg-gold-light hover:shadow-lg hover:shadow-gold/20 disabled:opacity-60"
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  Send OTP
                </button>
              </motion.form>
            ) : (
              <motion.form
                key="otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleVerifyOtp}
                className="mt-8"
              >
                <button
                  type="button"
                  onClick={() => setStep("input")}
                  className="mb-6 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground transition-colors hover:text-gold"
                >
                  <ArrowLeft className="h-3 w-3" /> Back
                </button>

                <h2 className="font-display text-xl font-bold text-foreground">Verify OTP</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Enter the 6-digit code sent to {inputValue}
                </p>

                <div className="mt-6">
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="000000"
                    maxLength={6}
                    className="w-full rounded-xl border border-white/10 bg-secondary/50 px-4 py-3.5 text-center text-2xl font-bold tracking-[0.5em] text-foreground outline-none transition-all focus:border-gold/50 focus:ring-1 focus:ring-gold/50"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-gold py-4 text-sm font-bold uppercase tracking-wider text-black transition-all hover:bg-gold-light hover:shadow-lg hover:shadow-gold/20 disabled:opacity-60"
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  Verify & Sign In
                </button>

                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="mt-6 w-full text-xs font-medium text-muted-foreground transition-colors hover:text-gold"
                >
                  Resend OTP
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </main>
  );
};

export default Login;
