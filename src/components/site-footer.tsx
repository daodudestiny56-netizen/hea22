import Link from "next/link";
import { site } from "@/lib/site";
import { Logo } from "./logo";

export function SiteFooter() {
  return (
    <footer className="bg-[linear-gradient(160deg,#262521_0%,#34322d_100%)] text-paper/80">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="max-w-sm">
          <Logo inverted />
          <p className="mt-4 text-sm leading-relaxed text-paper/65">
            A student project that suggests how soon to seek care and helps you find nearby clinics. It does not
            diagnose and does not replace a health worker.
          </p>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-paper/50">Use the tool</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link href="/dashboard/check" className="hover:text-paper">Check symptoms</Link></li>
            <li><Link href="/dashboard/clinics" className="hover:text-paper">Find a clinic</Link></li>
            <li><Link href="/#responsible-use" className="hover:text-paper">Responsible use</Link></li>
          </ul>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-paper/50">In an emergency</h2>
          <p className="mt-4 text-sm leading-relaxed">
            Call <a href={`tel:${site.emergencyNumber}`} className="font-semibold text-paper underline underline-offset-4">{site.emergencyNumber}</a>{" "}
            from any phone in {site.country}, free of charge, or go to the nearest hospital emergency department.
          </p>
        </div>
      </div>

      <div className="border-t border-paper/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-6 text-xs text-paper/50 sm:flex-row sm:justify-between sm:px-8">
          <p>&copy; {new Date().getFullYear()} {site.name}. For educational use only.</p>
          <p>
            Map data &copy;{" "}
            <a href="https://www.openstreetmap.org/copyright" className="underline underline-offset-2 hover:text-paper/80">
              OpenStreetMap contributors
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
