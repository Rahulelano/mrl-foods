import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { adminLogin } from "@/lib/api";
import { MagneticButton } from "@/components/ui/MagneticButton";

const AdminLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = await adminLogin(email, password);
            localStorage.setItem("adminToken", data.token);
            toast.success("Login successful");
            navigate("/admin/dashboard");
        } catch (error: any) {
            console.error("Login failed", error);
            toast.error(error.response?.data?.message || "Invalid credentials");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-card p-8 shadow-xl backdrop-blur-sm">
                <div className="mb-8 text-center">
                    <h1 className="font-display text-3xl font-bold text-foreground">Admin Login</h1>
                    <p className="mt-2 text-sm text-muted-foreground">Enter your credentials to access the dashboard</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full rounded-lg border border-white/10 bg-background px-4 py-3 text-foreground outline-none transition-colors focus:border-gold/50"
                            placeholder="admin@mrlfoods.com"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full rounded-lg border border-white/10 bg-background px-4 py-3 text-foreground outline-none transition-colors focus:border-gold/50"
                            placeholder="••••••••"
                        />
                    </div>

                    <MagneticButton>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-full bg-gold py-4 text-sm font-bold uppercase tracking-wider text-black transition-all hover:bg-gold-light disabled:opacity-50"
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </MagneticButton>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
