import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { User, MapPin, Package, LogOut, Loader2, Plus, Trash2, Edit2, Check, CreditCard, ChevronRight, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { getUserProfile, updateUserProfile, addAddress, deleteAddress, getSiteSettings } from "@/lib/api";

const Account = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile"); // profile, address, orders
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: "", email: "", phone: "" });
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState({
    title: "", street: "", city: "", state: "", zip: "", phone: "", isDefault: false
  });
  const [logoUrl, setLogoUrl] = useState("/logo.png");

  const token = localStorage.getItem("userToken");

  useEffect(() => {
    if (!token) {
      setLoading(false);
      // Fetch logo even if not logged in for the fallback view
      getSiteSettings().then(data => {
        if (data && data.logoUrl) setLogoUrl(data.logoUrl);
      }).catch(err => console.error(err));
      return;
    }
    fetchProfile();
  }, [token]);

  const fetchProfile = async () => {
    try {
      const data = await getUserProfile(token!);
      setUser(data);
      setProfileForm({ name: data.name || "", email: data.email || "", phone: data.phone || "" });
    } catch (error) {
      console.error("Profile fetch error:", error);
      handleLogout();
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userPhone");
    navigate("/login");
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updated = await updateUserProfile(profileForm, token!);
      setUser(updated);
      setEditingProfile(false);
      toast.success("Profile updated!");
    } catch (error: any) {
      console.error(error);
      const message = error.response?.data?.message || "Failed to update profile";
      toast.error(message);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const addresses = await addAddress(addressForm, token!);
      setUser({ ...user, addresses });
      setShowAddressForm(false);
      setAddressForm({ title: "", street: "", city: "", state: "", zip: "", phone: "", isDefault: false });
      toast.success("Address added!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add address");
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const addresses = await deleteAddress(id, token!);
      setUser({ ...user, addresses });
      toast.success("Address deleted");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete address");
    }
  };

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-zinc-50"><Loader2 className="h-8 w-8 animate-spin text-gold" /></div>;
  }

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] opacity-5 bg-cover bg-center" />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 w-full max-w-sm rounded-[2rem] border border-zinc-200 bg-white/80 p-10 text-center backdrop-blur-xl shadow-2xl">
          <div className="mx-auto flex h-20 w-auto items-center justify-center overflow-hidden mb-6">
            <img src={logoUrl} alt="Logo" className="h-full w-auto object-contain" />
          </div>
          <h2 className="mt-6 font-display text-2xl font-bold text-zinc-900">Sign In Required</h2>
          <p className="mt-2 text-sm text-zinc-500">Please log in to manage your premium account.</p>
          <Link to="/login" className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-gold py-4 text-sm font-bold text-black uppercase tracking-wider hover:bg-gold-light hover:shadow-lg hover:shadow-gold/20 transition-all">
            Login Now
          </Link>
        </motion.div>
      </main>
    );
  }

  const tabs = [
    { id: "profile", label: "My Profile", icon: User },
    { id: "address", label: "Addresses", icon: MapPin },
    { id: "orders", label: "Orders", icon: Package },
  ];

  return (
    <main className="min-h-screen bg-zinc-50 pt-24 pb-20 relative">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-gold/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-blue-100/50 blur-[120px]" />
      </div>

      <div className="container relative z-10 mx-auto max-w-6xl px-4">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 flex flex-col gap-2 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <p className="text-sm font-medium text-gold uppercase tracking-wider">Welcome Back</p>
            <h1 className="mt-1 font-display text-4xl font-bold text-zinc-900">
              {user.name || "Valued Member"}
            </h1>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-zinc-200 bg-white/50 px-4 py-2 backdrop-blur-md shadow-sm">
            <ShieldCheck className="h-4 w-4 text-gold" />
            <span className="text-xs font-bold text-zinc-600 uppercase tracking-widest">Premium Member</span>
          </div>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* Mobile Tabs / Desktop Sidebar */}
          <aside className="lg:block sticky top-24 z-20">
            {/* Mobile Nav - Premium Tabs */}
            <div className="lg:hidden mb-8">
              <div className="flex p-1 bg-zinc-200/50 backdrop-blur-md rounded-2xl">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all ${activeTab === tab.id
                      ? "bg-white text-gold shadow-sm"
                      : "text-zinc-500 hover:text-zinc-900"
                      }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    <span className="hidden xs:inline">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Desktop Sidebar */}
            <div className="hidden space-y-2 lg:block">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group flex w-full items-center justify-between rounded-xl border px-5 py-4 text-sm font-bold transition-all ${activeTab === tab.id
                    ? "border-gold/50 bg-gold/10 text-yellow-700 shadow-sm"
                    : "border-transparent text-zinc-400 hover:bg-white hover:text-zinc-900 hover:shadow-sm"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <tab.icon className={`h-5 w-5 transition-colors ${activeTab === tab.id ? "text-gold" : "text-zinc-400 group-hover:text-zinc-900"}`} />
                    {tab.label}
                  </div>
                  {activeTab === tab.id && <ChevronRight className="h-4 w-4 text-gold" />}
                </button>
              ))}

              <div className="pt-6 mt-6 border-t border-zinc-200">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-bold text-red-500 transition-all hover:bg-red-100/50 hover:border-red-200"
                >
                  <LogOut className="h-5 w-5" />
                  Logout
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="min-h-[500px]">
            <AnimatePresence mode="wait">
              {/* PROFILE TAB */}
              {activeTab === "profile" && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="rounded-[2rem] border border-zinc-200 bg-white p-6 md:p-10 shadow-xl shadow-zinc-200/50">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h2 className="font-display text-2xl font-bold text-zinc-900">Personal Information</h2>
                        <p className="text-sm text-zinc-500">Manage your account details</p>
                      </div>
                      <button
                        onClick={() => setEditingProfile(!editingProfile)}
                        className="rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 text-xs font-bold text-gold hover:bg-zinc-100 transition-colors"
                      >
                        {editingProfile ? "Cancel Editing" : "Edit Details"}
                      </button>
                    </div>

                    {editingProfile ? (
                      <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-xl">
                        <div className="grid gap-6 md:grid-cols-2">
                          <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Full Name</label>
                            <input type="text" value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-zinc-900 outline-none focus:border-gold/50 focus:bg-white transition-all" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Email</label>
                            <input type="email" value={profileForm.email} onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })} className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-zinc-900 outline-none focus:border-gold/50 focus:bg-white transition-all" />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Phone Number</label>
                            <input type="text" value={profileForm.phone} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-zinc-900 outline-none focus:border-gold/50 focus:bg-white transition-all" />
                          </div>
                        </div>
                        <button type="submit" className="flex items-center gap-2 rounded-xl bg-gold px-8 py-3 text-sm font-bold text-black hover:bg-gold-light hover:shadow-lg hover:shadow-gold/20 transition-all">
                          <Check className="h-4 w-4" /> Save Changes
                        </button>
                      </form>
                    ) : (
                      <div className="grid gap-6">
                        {/* Digital Member Card - Premium Version */}
                        <div className="relative overflow-hidden rounded-[2.5rem] bg-zinc-900 p-8 md:p-12 text-white shadow-2xl">
                          <div className="absolute top-0 right-0 -mt-20 -mr-20 h-64 w-64 rounded-full bg-gold/20 blur-[80px]" />
                          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-64 w-64 rounded-full bg-blue-500/10 blur-[80px]" />

                          <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-8">
                            <div className="relative h-24 w-24 md:h-32 md:w-32 rounded-3xl bg-gradient-to-br from-gold to-yellow-600 p-[2px] shadow-2xl shadow-gold/20">
                              <div className="h-full w-full rounded-3xl bg-zinc-900 flex items-center justify-center">
                                <User className="h-10 w-10 md:h-12 md:w-12 text-gold" />
                              </div>
                            </div>

                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gold/80">Premium Access</span>
                                <div className="h-1 w-1 rounded-full bg-gold/50" />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">ID: MRL-{user._id?.slice(-6).toUpperCase() || "202401"}</span>
                              </div>
                              <h3 className="text-3xl md:text-5xl font-display font-bold text-white tracking-tight leading-none mb-6">
                                {user.name || "Valued Member"}
                              </h3>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 pt-6 border-t border-white/10 uppercase tracking-widest text-[10px] font-bold text-white/60">
                                <div className="space-y-1">
                                  <p className="text-gold/50 mb-1">Email Address</p>
                                  <p className="text-white">{user.email || "N/A"}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-gold/50 mb-1">Phone Number</p>
                                  <p className="text-white">{user.phone || "N/A"}</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="absolute bottom-12 right-12 hidden md:block">
                            <img src="/logo.png" alt="MRL" className="h-8 w-auto opacity-20 grayscale brightness-200" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* ADDRESS TAB */}
              {activeTab === "address" && (
                <motion.div
                  key="address"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="rounded-[2rem] border border-zinc-200 bg-white p-6 md:p-10 shadow-xl shadow-zinc-200/50">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h2 className="font-display text-2xl font-bold text-zinc-900">Address Book</h2>
                        <p className="text-sm text-zinc-500">Manage delivery locations</p>
                      </div>
                      <button onClick={() => setShowAddressForm(!showAddressForm)} className="flex items-center gap-2 rounded-xl bg-gold/10 px-4 py-2 text-sm font-bold text-gold hover:bg-gold hover:text-black transition-all">
                        <Plus className="h-4 w-4" /> Add New
                      </button>
                    </div>

                    <AnimatePresence>
                      {showAddressForm && (
                        <motion.form
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          onSubmit={handleAddAddress}
                          className="mb-8 overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50 p-6"
                        >
                          <div className="grid gap-4 sm:grid-cols-2">
                            <input placeholder="Title (e.g. Home)" value={addressForm.title} onChange={(e) => setAddressForm({ ...addressForm, title: e.target.value })} className="rounded-xl bg-white p-4 text-sm text-zinc-900 outline-none border border-zinc-200 focus:border-gold/50 transition-colors" required />
                            <input placeholder="Phone" value={addressForm.phone} onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })} className="rounded-xl bg-white p-4 text-sm text-zinc-900 outline-none border border-zinc-200 focus:border-gold/50 transition-colors" required />
                            <input placeholder="Street Address" value={addressForm.street} onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })} className="sm:col-span-2 rounded-xl bg-white p-4 text-sm text-zinc-900 outline-none border border-zinc-200 focus:border-gold/50 transition-colors" required />
                            <input placeholder="City" value={addressForm.city} onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })} className="rounded-xl bg-white p-4 text-sm text-zinc-900 outline-none border border-zinc-200 focus:border-gold/50 transition-colors" required />
                            <input placeholder="State" value={addressForm.state} onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })} className="rounded-xl bg-white p-4 text-sm text-zinc-900 outline-none border border-zinc-200 focus:border-gold/50 transition-colors" required />
                            <input placeholder="ZIP Code" value={addressForm.zip} onChange={(e) => setAddressForm({ ...addressForm, zip: e.target.value })} className="rounded-xl bg-white p-4 text-sm text-zinc-900 outline-none border border-zinc-200 focus:border-gold/50 transition-colors" required />
                          </div>
                          <div className="mt-6 flex gap-3">
                            <button type="submit" className="rounded-xl bg-gold px-6 py-2.5 text-sm font-bold text-black hover:bg-gold-light">Save Address</button>
                            <button type="button" onClick={() => setShowAddressForm(false)} className="rounded-xl bg-zinc-200 px-6 py-2.5 text-sm font-bold text-zinc-600 hover:bg-zinc-300">Cancel</button>
                          </div>
                        </motion.form>
                      )}
                    </AnimatePresence>

                    <div className="grid gap-4 md:grid-cols-2">
                      {user.addresses && user.addresses.length > 0 ? (
                        user.addresses.map((addr: any) => (
                          <div key={addr._id} className="group relative rounded-2xl border border-zinc-200 bg-zinc-50 p-6 transition-all hover:border-gold/30 hover:bg-white hover:shadow-lg hover:shadow-zinc-200/50">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-bold text-lg text-zinc-900 group-hover:text-gold transition-colors">{addr.title}</h3>
                                <p className="mt-2 text-sm text-zinc-500 leading-relaxed">{addr.street}, {addr.city}</p>
                                <p className="text-sm text-zinc-500">{addr.state} - {addr.zip}</p>
                                <p className="mt-3 text-xs font-bold text-gold flex items-center gap-1"><CreditCard className="h-3 w-3" /> {addr.phone}</p>
                              </div>
                              <button onClick={() => handleDeleteAddress(addr._id)} className="rounded-lg p-2 text-zinc-400 hover:bg-red-50 hover:text-red-500 transition-all"><Trash2 className="h-4 w-4" /></button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-full py-12 text-center border-2 border-dashed border-zinc-200 rounded-2xl">
                          <MapPin className="mx-auto h-12 w-12 text-zinc-300" />
                          <p className="mt-4 text-zinc-400">No addresses saved yet</p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ORDERS TAB */}
              {activeTab === "orders" && (
                <motion.div
                  key="orders"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="rounded-[2rem] border border-zinc-200 bg-white p-6 md:p-10 shadow-xl shadow-zinc-200/50">
                    <div className="mb-8">
                      <h2 className="font-display text-2xl font-bold text-zinc-900">Order History</h2>
                      <p className="text-sm text-zinc-500">Track your past purchases</p>
                    </div>

                    <div className="space-y-6">
                      {[
                        { id: "ORD-9921", date: "Feb 12, 2024", status: "Out for Delivery", total: 1240, items: ["Premium Jaggery", "Hand-crushed Spices"] },
                        { id: "ORD-8812", date: "Jan 28, 2024", status: "Delivered", total: 850, items: ["Millet Noodles", "Wild Honey"] },
                      ].map((order) => (
                        <div key={order.id} className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white transition-all hover:border-gold/30 hover:shadow-xl hover:shadow-zinc-200/50">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 border-b border-zinc-100 bg-zinc-50/50">
                            <div className="flex items-center gap-4 mb-4 sm:mb-0">
                              <div className="h-12 w-12 rounded-xl bg-white border border-zinc-200 flex items-center justify-center shadow-sm">
                                <Package className="h-6 w-6 text-gold" />
                              </div>
                              <div>
                                <h4 className="font-bold text-zinc-900">{order.id}</h4>
                                <p className="text-xs text-zinc-500">{order.date}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${order.status === "Delivered" ? "bg-green-100 text-green-700" : "bg-gold/10 text-gold"
                                }`}>
                                {order.status}
                              </span>
                              <ChevronRight className="h-4 w-4 text-zinc-300 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                          <div className="p-6">
                            <div className="flex justify-between items-end">
                              <div>
                                <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Items</p>
                                <p className="text-sm text-zinc-600 font-medium">{order.items.join(", ")}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-zinc-400 uppercase tracking-widest mb-1">Total</p>
                                <p className="text-lg font-bold text-zinc-900">₹{order.total}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Account;
