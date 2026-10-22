import Link from "next/link";
import { site } from "@/lib/site";

export function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <Link href="/" className="inline-flex items-center gap-2.5" aria-label={`${site.name} home`}>
      <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
        <rect width="22" height="22" rx="5" fill={inverted ? "#f7f5f1" : "#2f4943"} />
        <path d="M9 5.5h4v3.5h3.5v4H13v3.5H9V13H5.5V9H9z" fill={inverted ? "#2f4943" : "#f7f5f1"} />
      </svg>
      <span
        className={`font-display font-semibold text-[1.35rem] leading-none tracking-tight ${inverted ? "text-paper" : "text-ink"}`}
      >
        {site.name}
      </span>
    </Link>
  );
}
