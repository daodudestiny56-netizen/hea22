const steps = [
  {
    title: "Tell us how you feel",
    body: "Pick your symptoms from a plain-language list, then add your age group, how long it has lasted and how bad it is.",
  },
  {
    title: "Get a clear next step",
    body: "A transparent set of rules checks for warning signs first, then suggests one of four levels, from self-care to emergency.",
  },
  {
    title: "Find care nearby",
    body: "See hospitals and clinics around you on an OpenStreetMap map, with distances and directions.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20 border-t border-line bg-paper">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 md:py-28">
        <div className="grid gap-6 md:grid-cols-[1fr_1.4fr] md:items-end">
          <h2 className="font-display font-semibold text-4xl leading-tight tracking-tight sm:text-5xl">How it works</h2>
          <p className="max-w-xl text-ink-2 md:justify-self-end">
            The whole check takes about two minutes. Every suggestion comes with the reason behind it, so you can see
            exactly why it was made.
          </p>
        </div>

        <ol className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
          {steps.map((step, i) => (
            <li key={step.title} className="border-t border-ink pt-6">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Step 0{i + 1}</span>
              <h3 className="mt-3 text-lg font-semibold text-ink">{step.title}</h3>
              <p className="mt-2 leading-relaxed text-ink-2">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
