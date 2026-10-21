# CarePoint

A symptom checker and clinic locator built for the Software Engineering Studio (SIWES I), Project 06.

Users select their symptoms and get a rule-based triage suggestion, then find nearby hospitals and clinics on an OpenStreetMap map. Emergency guidance points to **112**, Nigeria's toll-free emergency number.

> CarePoint is an educational project. It does not diagnose conditions and is not a substitute for a qualified health worker.

## Features

- **Landing page** with a header, hero section, how-it-works, responsible-use and emergency sections, and a footer
- **Dashboard** with an overview, the symptom checker and the clinic finder
- **Rule-based triage engine** that checks red-flag rules first and returns one of four levels (Emergency, Urgent, Soon, Self-care) together with the reasons behind it
- **Clinic finder** that uses browser geolocation or place search (Nominatim), facility data from the Overpass API, and a Leaflet map with OpenStreetMap tiles
- **Responsible UX**: persistent 112 links, disclaimers, explained results, and no storage of user input

## Tech stack

| Area | Choice |
| --- | --- |
| Framework | Next.js 15 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS 4 |
| Map | Leaflet, react-leaflet, OpenStreetMap tiles |
| Geocoding | Nominatim (OpenStreetMap) |
| Facility data | Overpass API (OpenStreetMap) |
| Tests | Vitest |

## Getting started

Requires Node.js 20 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

| Script | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm start` | Serve the production build |
| `npm test` | Run the unit tests |
| `npm run lint` | Run ESLint |

No API keys or environment variables are needed.

## Project structure

```
src/
  app/
    page.tsx                  Landing page
    dashboard/                Overview, symptom check and clinic finder pages
    api/clinics/route.ts      Facility search (Overpass API)
    api/geocode/route.ts      Place search (Nominatim)
  components/
    landing/                  Landing page sections
    dashboard/                Sidebar and page header
    checker/                  Symptom checker steps and result view
    clinics/                  Map and clinic finder
  lib/
    triage/                   Symptoms, rules, level guidance and the rule engine
    geo/                      Distance helpers and Overpass parsing
    site.ts                   Site name, emergency number and default map centre
```

## How the triage engine works

Each rule in `src/lib/triage/rules.ts` has a condition and a level:

```ts
{
  id: "chest-pain-breathless",
  level: "emergency",
  when: { all: ["chest_pain", "shortness_of_breath"] },
  reason: "Chest pain together with difficulty breathing can point to a heart or lung emergency.",
}
```

A condition can require `all` of a set of symptoms, `any` of them, specific `ageGroups`, a `minDurationDays`, or certain `severities`. The engine in `src/lib/triage/engine.ts` evaluates every rule and returns:

- the **most severe** matching level
- the **reasons** from the rules at that level
- any **lower-level findings**, shown as extra context

If nothing matches, the result is Self-care. The rules draw on common public red-flag guidance and include local context such as malaria testing for fever. They have not been clinically validated.

## Data sources and usage

- Map tiles and facility data are from OpenStreetMap contributors, under the [ODbL](https://www.openstreetmap.org/copyright).
- Calls to Nominatim and Overpass go through the app's own API routes. These send an identifying User-Agent, as both services require, and cache responses so that repeat searches do not hit the public servers again.
- Public Overpass servers can be slow at busy times, so the first search for an area may take up to a minute.
