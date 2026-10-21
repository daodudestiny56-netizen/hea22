"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Grid, Phone, Pin, Pulse } from "@/components/icons";
import { Logo } from "@/components/logo";
import { site } from "@/lib/site";

const nav = [
  { href: "/dashboard", label: "Overview", icon: Grid },
  { href: "/dashboard/check", label: "Symptom check", icon: Pulse },
  { href: "/dashboard/clinics", label: "Clinic finder", icon: Pin },
];

function NavLinks({ compact = false }: { compact?: boolean }) {
  const pathname = usePathname();

  return (
    <>
      {nav.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`flex items-center gap-3 rounded-md text-sm transition-colors ${
              compact ? "shrink-0 px-3 py-2" : "px-3 py-2.5"
            } ${active ? "bg-ink text-paper" : "text-ink-2 hover:bg-sand/60 hover:text-ink"}`}
          >
            <Icon className={active ? "text-paper" : "text-muted"} />
            {label}
          </Link>
        );
      })}
    </>
  );
}

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-line bg-[linear-gradient(180deg,#f7f5f1_0%,#eee9e1_100%)] lg:flex">
      <div className="flex h-16 items-center px-6">
        <Logo />
      </div>
      <nav className="flex flex-1 flex-col gap-1 px-3 pt-4" aria-label="Dashboard">
        <NavLinks />
      </nav>
      <div className="m-3 rounded-lg border border-emergency/20 bg-emergency-soft p-4">
        <p className="text-sm font-semibold text-emergency">Life-threatening?</p>
        <p className="mt-1 text-xs leading-relaxed text-ink-2">Do not use this tool. Call for help straight away.</p>
        <a
          href={`tel:${site.emergencyNumber}`}
          className="mt-3 flex items-center justify-center gap-2 rounded-md bg-emergency px-3 py-2 text-sm font-semibold text-paper hover:bg-emergency/90"
        >
          <Phone />
          Call {site.emergencyNumber}
        </a>
      </div>
    </aside>
  );
}

export function MobileNav() {
  return (
    <div className="border-b border-line bg-paper lg:hidden">
      <div className="flex h-14 items-center justify-between px-5">
        <Logo />
        <a href={`tel:${site.emergencyNumber}`} className="text-sm font-semibold text-emergency">
          Call {site.emergencyNumber}
        </a>
      </div>
      <nav className="flex gap-1 overflow-x-auto px-3 pb-3" aria-label="Dashboard">
        <NavLinks compact />
      </nav>
    </div>
  );
}
