import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: "/", label: "Home", end: true },
    { to: "/enquiry", label: "Cake Enquiry" },
    { to: "/weddings", label: "Let's talk weddings" },
    { to: "/flavours", label: "Flavours" },
    { to: "/gallery", label: "Gallery" },
    { to: "/faq", label: "FAQ" },
  ];

  return (
    <header className="border-rose/15 bg-cream/85 supports-[backdrop-filter]:bg-cream/70 sticky top-0 z-50 border-b backdrop-blur">
      <div className="mx-auto max-w-[1400px] px-4">
        <div className="flex items-center gap-6 py-3">
          {/* Left: logo */}
          <Link to="/" className="flex shrink-0 items-center" aria-label="Pink Apron Bakery home">
            <span className="border-rose bg-cream inline-flex h-16 w-16 items-center justify-center rounded-full border-2 shadow-sm">
              <img
                src="/img/logo.svg"
                alt="Pink Apron Bakery logo"
                width={72}
                height={72}
                className="h-14 w-14 object-contain"
                loading="eager"
                decoding="sync"
                fetchPriority="high"
              />
            </span>
            <span className="sr-only">Pink Apron Bakery</span>
          </Link>

          {/* Desktop nav - centered */}
          <nav className="hidden flex-1 flex-wrap items-center justify-center gap-2 font-body md:flex">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                {...(link.end !== undefined && { end: link.end })}
                to={link.to}
                className={({ isActive }) =>
                  `px-5 py-2.5 rounded-full text-base font-semibold transition-all duration-200 no-underline hover:no-underline ${
                    isActive 
                      ? "bg-rose text-white shadow-md" 
                      : "text-apron hover:bg-rose/10 hover:text-rose"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Spacer to balance logo on desktop, push mobile menu button to the right on mobile */}
          <div className="flex-1 md:w-12 md:flex-none" />

          {/* Mobile menu button */}
          <button
            className="text-apron hover:text-rose md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
          </button>
        </div>

        {/* Mobile nav dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="border-rose/15 overflow-hidden border-t font-body md:hidden"
            >
              <div className="flex flex-col gap-2 py-4">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.2 }}
                  >
                    <NavLink
                      {...(link.end !== undefined && { end: link.end })}
                      to={link.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `block py-3 px-4 rounded-full text-lg font-semibold transition-all duration-200 no-underline hover:no-underline ${
                          isActive 
                            ? "bg-rose text-white shadow-md" 
                            : "text-apron hover:bg-rose/10 hover:text-rose"
                        }`
                      }
                    >
                      {link.label}
                    </NavLink>
                  </motion.div>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
