
import { api } from "./api";

export const initiatePhonePePayment = async (amount: number, mobileNumber?: string) => {
    try {
        const response = await api.post('/payment/initiate', {
            amount,
            mobileNumber,
            redirectUrl: window.location.origin + "/payment/callback"
        });

        const data = response.data;

        if (data?.url) {
            window.location.href = data.url;
        } else {
            throw new Error("No payment URL returned");
        }
    } catch (error) {
        console.error("Error initiating payment:", error);
        throw error;
    }
};
