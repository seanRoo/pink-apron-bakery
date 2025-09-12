import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";

export function CartEmptyState({
  className = "",
  buttonHref = "/",
  buttonText = "Continue shopping",
  message = "Looks like you haven't added anything yet.",
  iconSize = 64,
  onCloseDrawer,
}: {
  className?: string;
  buttonHref?: string;
  buttonText?: string;
  message?: string;
  iconSize?: number;
  onCloseDrawer?: () => void;
}) {
  const navigate = useNavigate();
  return (
    <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
      <div
        className={`bg-rose/10 mb-4 flex items-center justify-center rounded-full`}
        style={{ width: iconSize, height: iconSize }}
      >
        <svg
          width={iconSize / 2}
          height={iconSize / 2}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="text-rose"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 2.7A2 2 0 007.48 19h9.04a2 2 0 001.83-1.3L17 13M7 13V6h13"
          />
        </svg>
      </div>
      <div className="text-rose mb-1 text-xl font-semibold">Your cart is empty</div>
      <div className="text-warmgray mb-4 text-center text-sm">{message}</div>
      <Button
        className="bg-apron hover:bg-rose cursor-pointer rounded-full px-6 py-2 font-semibold text-white shadow transition-colors"
        onClick={() => {
          if (onCloseDrawer) onCloseDrawer();
          navigate(buttonHref);
        }}
      >
        {buttonText}
      </Button>
    </div>
  );
}
