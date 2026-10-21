export function PageHeader({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return (
    <header className="border-b border-line bg-[linear-gradient(180deg,#f7f5f1_0%,#efebe4_100%)]">
      <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 sm:py-10">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">{eyebrow}</p>
        <h1 className="mt-3 font-serif text-3xl tracking-tight sm:text-4xl">{title}</h1>
        {description && <p className="mt-3 max-w-2xl text-ink-2">{description}</p>}
      </div>
    </header>
  );
}
