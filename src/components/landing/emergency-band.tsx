import { Phone } from "@/components/icons";
import { site } from "@/lib/site";

const redFlags = [
  "Chest pain with difficulty breathing",
  "Face drooping, arm weakness or slurred speech",
  "A seizure, or sudden confusion",
  "Heavy bleeding that will not stop",
  "Fever with a stiff neck or a rash that does not fade",
  "A sudden, very severe headache",
];

export function EmergencyBand() {
  return (
    <section className="bg-[linear-gradient(135deg,#3a1d19_0%,#5a2a23_100%)] text-paper">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 sm:px-8 md:grid-cols-[1fr_1.3fr] md:py-20">
        <div>
          <h2 className="font-display font-semibold text-3xl leading-tight tracking-tight sm:text-4xl">Some symptoms cannot wait.</h2>
          <p className="mt-4 max-w-sm text-paper/75">
            If you or someone near you has any of these, skip the checker and call for help now.
          </p>
          <a
            href={`tel:${site.emergencyNumber}`}
            className="mt-8 inline-flex items-center gap-3 rounded-md bg-paper px-6 py-3.5 font-semibold text-emergency transition-colors hover:bg-paper-2"
          >
            <Phone />
            Call {site.emergencyNumber}
          </a>
        </div>
        <ul className="grid content-start gap-x-8 sm:grid-cols-2">
          {redFlags.map((flag) => (
            <li key={flag} className="border-b border-paper/15 py-3.5 text-paper/90">
              {flag}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
