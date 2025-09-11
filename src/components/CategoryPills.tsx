import clsx from "clsx";

import { CATEGORIES, type CategoryFilter } from "@/config/app";

type Props = {
  value: CategoryFilter;
  onChange: (c: CategoryFilter) => void;
};

export default function CategoryPills({ value, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORIES.map((c) => (
        <button
          key={c}
          type="button"
          onClick={() => onChange(c)}
          className={clsx(
            "cursor-pointer rounded-full border px-3 py-1.5 text-sm",
            value === c
              ? "bg-apron border-apron text-white"
              : "bg-cream border-rose/20 hover:border-rose/40",
          )}
        >
          {c}
        </button>
      ))}
    </div>
  );
}
