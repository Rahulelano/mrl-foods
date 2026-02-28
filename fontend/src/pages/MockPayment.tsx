import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, ArrowRight, CheckCircle2, ChevronLeft, CreditCard } from "lucide-react";

const MockPayment = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const amount = searchParams.get("amount") || "0";
    const [status, setStatus] = useState<"pending" | "success">("pending");

    const handleSuccess = async () => {
        try {
            const token = localStorage.getItem("userToken");
            const pendingOrderStr = localStorage.getItem("pendingOrder");
            const pendingOrder = pendingOrderStr ? JSON.parse(pendingOrderStr) : {};

            await fetch('/api/payment/success', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    amount,
                    customerDetails: pendingOrder.customerDetails,
                    items: pendingOrder.items
                })
            });

            // Cleanup
            localStorage.removeItem("pendingOrder");
        } catch (e) {
            console.error("Failed to notify backend", e);
        }

        setStatus("success");
        setTimeout(() => {
            navigate("/account?tab=orders");
        }, 3000);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#6739B7] font-sans">
            <div className="relative w-full max-w-md overflow-hidden bg-white shadow-2xl sm:rounded-[40px]">
                <AnimatePresence mode="wait">
                    {status === "pending" ? (
                        <motion.div
                            key="pending"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ x: -200, opacity: 0 }}
                            className="flex flex-col h-[90vh] sm:h-[800px]"
                        >
                            {/* Header */}
                            <div className="flex items-center gap-4 p-6 border-b">
                                <ChevronLeft className="h-6 w-6 text-gray-500" />
                                <div className="flex-1">
                                    <h1 className="text-lg font-bold text-gray-800">PhonePe</h1>
                                </div>
                                <div className="flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1">
                                    <ShieldCheck className="h-4 w-4 text-blue-600" />
                                    <span className="text-xs font-bold text-blue-600">Secure</span>
                                </div>
                            </div>

                            {/* Merchant Info */}
                            <div className="flex items-center justify-between bg-gray-50 p-8">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-600 font-bold text-lg">
                                        M
                                    </div>
                                    <div>
                                        <h2 className="text-base font-bold text-gray-800">MRL Foods</h2>
                                        <p className="text-xs text-gray-500">Merchant Code: MRL1023</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-gray-800">₹{amount}</div>
                                </div>
                            </div>

                            {/* Payment Options */}
                            <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Debit / Credit Card</h3>
                                <div className="rounded-2xl border-2 border-purple-100 bg-purple-50/30 p-4">
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm">
                                            <CreditCard className="h-6 w-6 text-purple-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-gray-800">HDFC Bank •••• 4410</p>
                                            <p className="text-xs text-gray-500">Save for faster checkout</p>
                                        </div>
                                        <div className="h-5 w-5 rounded-full border-2 border-purple-600 flex items-center justify-center">
                                            <div className="h-2.5 w-2.5 rounded-full bg-purple-600" />
                                        </div>
                                    </div>
                                </div>

                                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Other UPI Apps</h3>
                                <div className="space-y-4">
                                    {['Google Pay', 'Airtel Payments Bank', 'Paytm'].map(app => (
                                        <div key={app} className="flex items-center gap-4 p-4 border rounded-2xl grayscale opacity-50">
                                            <div className="h-10 w-10 rounded-lg bg-gray-100" />
                                            <span className="text-sm font-bold text-gray-800">{app}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Bottom Button */}
                            <div className="p-6 bg-white border-t">
                                <button
                                    onClick={handleSuccess}
                                    className="w-full rounded-2xl bg-[#6739B7] py-4 text-lg font-bold text-white shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                                >
                                    PAY ₹{amount}
                                    <ArrowRight className="h-5 w-5" />
                                </button>
                                <p className="mt-4 text-center text-xs text-gray-400 flex items-center justify-center gap-1">
                                    <ShieldCheck className="h-4 w-4" />
                                    100% Secure Payments powered by PhonePe
                                </p>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="success"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="flex flex-col items-center justify-center h-[90vh] sm:h-[800px] p-8 text-center"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", damping: 10, stiffness: 100 }}
                            >
                                <CheckCircle2 className="h-24 w-24 text-green-500" />
                            </motion.div>
                            <h1 className="mt-8 text-3xl font-bold text-gray-800">Payment Successful</h1>
                            <p className="mt-4 text-gray-500 text-lg">Your order with MRL Foods has been placed.</p>
                            <div className="mt-12 p-6 rounded-2xl bg-green-50 w-full">
                                <div className="flex justify-between text-sm text-green-800 mb-2">
                                    <span>Transaction ID</span>
                                    <span className="font-mono font-bold">T2402120000{Math.floor(Math.random() * 1000)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-green-800">
                                    <span>Amount Paid</span>
                                    <span className="font-bold">₹{amount}</span>
                                </div>
                            </div>
                            <div className="mt-20 flex items-center gap-2 text-gray-400">
                                <span className="h-2 w-2 rounded-full bg-gray-300 animate-bounce" />
                                <span className="h-2 w-2 rounded-full bg-gray-300 animate-bounce [animation-delay:0.2s]" />
                                <span className="h-2 w-2 rounded-full bg-gray-300 animate-bounce [animation-delay:0.4s]" />
                                <span className="text-xs font-bold uppercase tracking-widest ml-2">Redirecting to Orders</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default MockPayment;
