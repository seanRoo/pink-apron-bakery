import { Routes, Route, Navigate } from "react-router-dom";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Cart from "@/routes/Cart";
import Enquiry from "@/routes/Enquiry";
import Home from "@/routes/Home";
import Product from "@/routes/Product";
import Products from "@/routes/Products";
import StaticPage from "@/routes/StaticPage";
import Success from "@/routes/Success";

export default function App() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/enquiry" element={<Enquiry />} />
          <Route path="/product/:slug" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/success" element={<Success />} />
          <Route path="/terms" element={<StaticPage title="Terms" />} />
          <Route path="/privacy" element={<StaticPage title="Privacy" />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
