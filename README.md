# CarePoint

A symptom checker and clinic locator built for the Software Engineering Studio (SIWES I), Project 06.

Users select their symptoms and get a rule-based triage suggestion, then find nearby hospitals and clinics on an OpenStreetMap map. Emergency guidance points to **112**, Nigeria's toll-free emergency number.

**Live site:** https://hea22.vercel.app

> CarePoint is an educational project. It does not diagnose conditions and is not a substitute for a qualified health worker.

## Features

### Landing page
- Header that gains a shadow on scroll, with a persistent "Emergency 112" link and a mobile menu
- Hero with an example result card that cycles through four real scenarios run through the rule engine
- How it works, Responsible use and emergency sections that reveal as you scroll
- Footer with the disclaimer and OpenStreetMap attribution

### Dashboard
- **Overview:** shortcuts to both tools and a guide to the four levels of advice
- **Symptom check:** a three-step flow (symptoms, then details, then result)
  - Searchable symptom list, grouped by body area
  - Age group, duration and severity questions
  - A result showing the level, the reasons behind it, what to do now, and a link to find care nearby
- **Clinic finder:** hospitals, clinics and doctors' offices sorted by distance, with filters, a choice of radius (2 to 20 km), directions and call links
  - An Emergency result opens the finder with hospitals only

### Precise location
Desktop browsers often estimate location from the network. In Nigeria that can place a user in Lagos when they are elsewhere. The clinic finder deals with this by:
- **Watching for a better reading:** it checks the device position for up to 12 seconds and keeps the most accurate reading, not the first cached estimate.
- **Showing what it found:** it displays the detected place name (for example "Osogbo, Osun State") and how accurate the reading is.
- **Warning when unsure:** if the reading is only accurate to more than 1.5 km, it shows a warning.
- **Letting users correct it:** users can search for a town, drag the location pin, or tap the map to set their position.

Browsers only allow location access over HTTPS or on `localhost`.

### Responsible UX
- Red-flag rules are checked before anything else
- Every suggestion explains its reasoning
- Nothing the user enters is stored. Location is used only in the browser, and only with permission.
- The 112 number is visible on every page

## Design

- **Typography:** Bricolage Grotesque (semibold) for headings and IBM Plex Sans for body text
- **Colour:** warm stone neutrals with soft gradients, one muted green accent, and a separate colour for each triage level
- **Motion:**
  - A staggered entrance on the hero
  - Reveals as sections scroll into view
  - Feedback on buttons and cards when hovered or pressed
  - Transitions between checker steps, and a result bar that fills in

  All motion is turned off when the user's device is set to reduce motion.
- No emoji are used anywhere in the interface.

## Tech stack

| Area | Choice |
| --- | --- |
| Framework | Next.js 15 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS 4 |
| Map | Leaflet, react-leaflet, OpenStreetMap tiles |
| Place search and names | Nominatim (OpenStreetMap) |
| Facility data | Overpass API (OpenStreetMap) |
| Tests | Vitest |
| Hosting | Vercel |

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
    api/clinics/route.ts      Nearby facilities (Overpass API)
    api/geocode/route.ts      Place search (Nominatim)
    api/reverse/route.ts      Place name for coordinates (Nominatim)
  components/
    landing/                  Landing page sections and the example result card
    dashboard/                Sidebar and page header
    checker/                  Symptom checker steps and result view
    clinics/                  Map and clinic finder
    reveal.tsx                Scroll reveal animation
  lib/
    triage/                   Symptoms, rules, level guidance and the rule engine
    geo/                      Distance, Overpass parsing and precise location
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

If nothing matches, the result is Self-care. The rules draw on common public red-flag guidance and include local context, such as getting a malaria test for fever. They have not been clinically validated.

## Tests

`npm test` runs 24 unit tests covering:
- the rule engine and the integrity of the rules (unknown symptoms, duplicate ids)
- distance calculation and Overpass response parsing
- precise location: ignoring a coarse first reading, using the best reading when time runs out, and handling denied permission

## Deployment

The app is deployed on Vercel at https://hea22.vercel.app. To deploy from the command line:

```bash
npx vercel deploy --prod
```

To redeploy automatically on every push, connect this GitHub repository to the Vercel project under **Settings → Git**.

## Data sources and usage

- Map tiles and facility data are from OpenStreetMap contributors, under the [ODbL](https://www.openstreetmap.org/copyright).
- Calls to Nominatim and Overpass go through the app's own API routes. These send an identifying User-Agent, as both services require, and cache responses so that repeat searches do not hit the public servers again.
- Public Overpass servers queue requests at busy times, so the first search for an area can take up to a minute. Repeat searches load instantly from the cache.
