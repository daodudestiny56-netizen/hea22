"use client";

import Link from "next/link";
import { useState } from "react";
import { site } from "@/lib/site";
import { Logo } from "./logo";

const links = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#responsible-use", label: "Responsible use" },
  { href: "/dashboard/clinics", label: "Find a clinic" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Logo />

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm text-ink-2 transition-colors hover:text-ink">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-5 md:flex">
          <a href={`tel:${site.emergencyNumber}`} className="text-sm font-medium text-emergency">
            Emergency {site.emergencyNumber}
          </a>
          <Link
            href="/dashboard"
            className="rounded-md bg-ink px-4 py-2 text-sm font-medium text-paper transition-colors hover:bg-ink-2"
          >
            Open dashboard
          </Link>
        </div>

        <button
          type="button"
          className="-mr-2 p-2 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true" className="stroke-ink" strokeWidth="1.6">
            {open ? <path d="M5 5l12 12M17 5L5 17" /> : <path d="M3 7h16M3 11h16M3 15h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <nav id="mobile-nav" className="border-t border-line bg-paper px-5 pb-5 md:hidden" aria-label="Mobile">
          <ul className="divide-y divide-line">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="block py-3 text-ink-2" onClick={() => setOpen(false)}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex flex-col gap-3">
            <Link
              href="/dashboard"
              className="rounded-md bg-ink px-4 py-2.5 text-center text-sm font-medium text-paper"
              onClick={() => setOpen(false)}
            >
              Open dashboard
            </Link>
            <a
              href={`tel:${site.emergencyNumber}`}
              className="rounded-md border border-emergency/30 px-4 py-2.5 text-center text-sm font-medium text-emergency"
            >
              Emergency: call {site.emergencyNumber}
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
