"use client";

import { useMemo, useState } from "react";
import { Check } from "@/components/icons";
import { symptomCategories, symptoms } from "@/lib/triage/symptoms";

export function SymptomStep({ selected, onToggle }: { selected: string[]; onToggle: (id: string) => void }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? symptoms.filter((s) => s.label.toLowerCase().includes(q)) : symptoms;
  }, [query]);

  return (
    <div>
      <label htmlFor="symptom-search" className="sr-only">
        Search symptoms
      </label>
      <input
        id="symptom-search"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search, for example: fever, cough, rash"
        className="w-full rounded-md border border-line bg-paper px-4 py-3 text-sm placeholder:text-muted/80 focus:border-ink/40 focus:outline-none"
      />

      <div className="mt-6 space-y-7">
        {symptomCategories.map((category) => {
          const items = filtered.filter((s) => s.category === category);
          if (items.length === 0) return null;
          return (
            <fieldset key={category}>
              <legend className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{category}</legend>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {items.map((s) => {
                  const isSelected = selected.includes(s.id);
                  return (
                    <button
                      key={s.id}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => onToggle(s.id)}
                      className={`flex items-start gap-3 rounded-lg border px-3.5 py-3 text-left text-sm transition-[background-color,border-color,color,transform] duration-200 active:scale-[0.98] ${
                        isSelected
                          ? "border-ink bg-ink text-paper"
                          : "border-line bg-paper text-ink hover:border-ink/30"
                      }`}
                    >
                      <span
                        className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border ${
                          isSelected ? "border-paper bg-paper text-ink" : "border-ink/30"
                        }`}
                        aria-hidden="true"
                      >
                        {isSelected && <Check className="h-3 w-3 animate-pop" />}
                      </span>
                      <span>
                        <span className="block">{s.label}</span>
                        {s.hint && (
                          <span className={`mt-0.5 block text-xs ${isSelected ? "text-paper/70" : "text-muted"}`}>
                            {s.hint}
                          </span>
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            </fieldset>
          );
        })}
        {filtered.length === 0 && (
          <p className="rounded-md border border-dashed border-line px-4 py-6 text-center text-sm text-muted">
            No symptom matches &ldquo;{query}&rdquo;. Try a simpler word, or pick the closest match from the full list.
          </p>
        )}
      </div>
    </div>
  );
}
