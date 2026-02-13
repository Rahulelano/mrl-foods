import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { CartProvider } from "@/lib/cart-context";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductDetails from "./pages/ProductDetails";
import Index from "./pages/Index";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Account from "./pages/Account";
import Login from "./pages/Login";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Refund from "./pages/Refund";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/Login";
import MockPayment from "./pages/MockPayment";
import AdminDashboard from "./pages/admin/Dashboard";
import ProductForm from "./pages/admin/ProductForm";

import ProtectedAdmin from "./components/ProtectedAdmin";

const queryClient = new QueryClient();



const PublicLayout = () => (
  <>
    <Navbar />
    <Outlet />
    <Footer />

  </>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={
              <ProtectedAdmin>
                <AdminDashboard />
              </ProtectedAdmin>
            } />
            <Route path="/admin/products/new" element={
              <ProtectedAdmin>
                <ProductForm />
              </ProtectedAdmin>
            } />
            <Route path="/admin/products/edit/:id" element={
              <ProtectedAdmin>
                <ProductForm />
              </ProtectedAdmin>
            } />

            <Route path="/payment/mock" element={<MockPayment />} />

            <Route element={<PublicLayout />}>
              <Route path="/" element={<Index />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/account" element={<Account />} />
              <Route path="/login" element={<Login />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/about" element={<About />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/refund" element={<Refund />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
