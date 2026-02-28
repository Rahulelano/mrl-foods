import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

const PaymentCallback = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const params = Object.fromEntries(searchParams.entries());
        console.log("Full Payment Callback Params:", params);

        const code = searchParams.get("code");
        const transactionId = searchParams.get("transactionId");

        // If in Sandbox, PhonePe might return different codes or we might Just want to see what's there
        if (code === "PAYMENT_SUCCESS" || code === "SUCCESS") {
            toast.success("Payment Successful!");
            navigate("/account?tab=orders");
        } else if (!code && transactionId) {
            // Minimal check if code is missing but transactionId exists
            toast.success("Payment Received (Verifying...)");
            navigate("/account?tab=orders");
        } else {
            console.error("Payment Failure Code:", code);
            toast.error(`Payment Status: ${code || 'Unknown'}. Please check your orders.`);
            // Don't navigate away immediately so user can see logs if they have console open
            setTimeout(() => navigate("/cart"), 5000);
        }
    }, [searchParams, navigate]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-4">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-gold border-t-transparent"></div>
                <p className="font-display text-xl font-bold text-foreground">Verifying Payment...</p>
            </div>
        </div>
    );
};

export default PaymentCallback;
