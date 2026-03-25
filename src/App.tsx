import { AnimatePresence, motion } from "framer-motion";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Cart from "@/routes/Cart";
// import CupcakeEnquiry from "@/routes/CupcakeEnquiry";
import Enquiry from "@/routes/Enquiry";
import FAQ from "@/routes/FAQ";
import Flavours from "@/routes/Flavours";
import Gallery from "@/routes/Gallery";
import Home from "@/routes/Home";
import Product from "@/routes/Product";
// import Products from "@/routes/Products";
import StaticPage from "@/routes/StaticPage";
import Success from "@/routes/Success";
import Terms from "@/routes/Terms";
import Weddings from "@/routes/Weddings";

// Page transition wrapper
function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  const location = useLocation();

  return (
    <div className="flex min-h-dvh flex-col">
      <ScrollToTop />
      <Header />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
            {/* <Route path="/products" element={<PageTransition><Products /></PageTransition>} /> */}
            <Route path="/enquiry" element={<PageTransition><Enquiry /></PageTransition>} />
            {/* <Route path="/cupcake-enquiry" element={<PageTransition><CupcakeEnquiry /></PageTransition>} /> */}
            <Route path="/weddings" element={<PageTransition><Weddings /></PageTransition>} />
            <Route path="/flavours" element={<PageTransition><Flavours /></PageTransition>} />
            <Route path="/gallery" element={<PageTransition><Gallery /></PageTransition>} />
            <Route path="/faq" element={<PageTransition><FAQ /></PageTransition>} />
            <Route path="/terms" element={<PageTransition><Terms /></PageTransition>} />
            <Route path="/product/:slug" element={<PageTransition><Product /></PageTransition>} />
            <Route path="/cart" element={<PageTransition><Cart /></PageTransition>} />
            <Route path="/success" element={<PageTransition><Success /></PageTransition>} />
            <Route path="/privacy" element={<PageTransition><StaticPage title="Privacy" /></PageTransition>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
