import { Link } from "react-router-dom";

import ResponsiveProductImage from "@/components/ResponsiveProductImage";

function InstagramIcon({ className = "w-5 h-5 inline-block align-text-bottom mr-1" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <rect width="18" height="18" x="3" y="3" rx="5" strokeWidth="2" />
      <circle cx="12" cy="12" r="4" strokeWidth="2" />
      <circle cx="17" cy="7" r="1.2" fill="currentColor" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-cream border-rose/10 border-t">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:flex-row sm:items-center sm:justify-between">
        {/* Branding & tagline */}
        <div className="flex items-center gap-4">
          <ResponsiveProductImage
            src="/img/logo.svg"
            alt="Pink Apron Bakery logo"
            className="border-rose/20 h-10 w-10 rounded-full border bg-white shadow-sm"
            width={40}
            height={40}
          />
          <div>
            <div className="font-script text-rose text-xl leading-tight">Pink Apron Bakery</div>
            <div className="text-warmgray text-xs">Handcrafted cakes & cupcakes in Kildare</div>
          </div>
        </div>
        {/* Navigation */}
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <Link to="/products" className="hover:text-rose transition-colors">
            All products
          </Link>
          <Link to="/enquiry" className="hover:text-rose transition-colors">
            Cake enquiry
          </Link>
          <Link to="/terms" className="hover:text-rose transition-colors">
            Terms
          </Link>
          <Link to="/privacy" className="hover:text-rose transition-colors">
            Privacy
          </Link>
        </div>
        {/* Social & contact */}
        <div className="flex min-w-[160px] flex-col items-end gap-1 text-sm">
          <a
            href="https://instagram.com/pinkapron_bakery"
            target="_blank"
            rel="noreferrer"
            className="hover:text-rose flex cursor-pointer items-center transition-colors"
          >
            <InstagramIcon />
            <span>@pinkapron_bakery</span>
          </a>
          <span className="text-warmgray text-xs">Kildare, Ireland</span>
        </div>
      </div>
    </footer>
  );
}
