<!-- AUTO-FROM-DB:START — sourced from clients.business_info_json; do not edit by hand -->
# Verified Business Facts

- **Owner:** Harvey Alvarez
- **Phone:** 916-507-4802
- **Address:** 2101 53rd Ave
<!-- AUTO-FROM-DB:END -->

# AGENT_GUIDE.md — Drippy Suds Mobile Detailing

External SEO content agent briefing. Every fact in this document is taken directly
from the codebase. If a credential, claim, or detail is not in this file, it is
not in the codebase — do not invent it.

Before generating any content, read `site-map.json` and `AI_SOP.md`. This document
covers brand facts and content rules; those documents cover file structure and
the surgical change protocol.

---

## 1. Business Overview

### Identity and services

Drippy Suds Mobile Detailing is a mobile auto-detailing business operating out of
Sacramento, California. Trade category: **mobile auto detailing** (interior and
exterior vehicle detailing, paint protection, ceramic coatings). The business is
fully mobile — the team brings all equipment, water, and supplies to the
customer's home, office, or parking lot. There is no shop location customers
visit.

The four service offerings, taken directly from `src/data/servicePages.ts`, are:

- **Interior Detail Only** (`/services/interior-detail`) — full interior cabin
  detail including deep vacuum, pet hair removal, leather and upholstery
  cleaning, plastic and trim cleaning, glass and vents, and odor mitigation.
- **Exterior Wash Only** (`/services/exterior-wash`) — hand wash, two-bucket
  method, contact-safe alternative to automatic tunnels and touchless washes.
- **Drippy Diamond Package** (`/services/drippy-diamond-package`) — combined
  full interior + full exterior detail.
- **Ceramic Coatings** (`/services/ceramic-coatings`) — professional-grade
  ceramic coating application with 2–5 year durability depending on tier.

There is no claim of emergency or 24/7 service anywhere in the codebase — do not
write content suggesting either. The business is appointment-based and booking
runs through `/s/appointments`.

What differentiates the business, per the existing copy: it is fully mobile
("we come to you — anywhere, anytime"), uses eco-friendly biodegradable products,
focuses on hand-finishing rather than automated equipment, and explicitly
positions itself as "detailers, not a car wash" with an obsession for the craft.
First-time clients receive $25 off their first appointment (per
`src/components/home/HeroSection.tsx`).

### Service area

The service area is the **twelve cities** listed in `src/data/cityPages.ts`.
This is the exact and only set of locations the agent is authorized to write
about as service-area cities. Do not expand it. Do not abbreviate it.

1. Sacramento, CA (primary)
2. Elk Grove, CA
3. Rancho Cordova, CA
4. Natomas, CA
5. Folsom, CA
6. Roseville, CA
7. Citrus Heights, CA
8. West Sacramento, CA
9. Carmichael, CA
10. Fair Oaks, CA
11. Arden-Arcade, CA
12. North Highlands, CA

Region: greater Sacramento metropolitan area, Sacramento County and adjacent
Placer / Yolo county communities. State: California.

Business address (per `src/pages/Contact.tsx` and `src/components/SEO.tsx`):
**2101 53rd Ave, Sacramento, CA 95822**.

### Trust signals and credentials

Every credential and trust signal that appears literally in the codebase:

- **Phone:** (916) 539-2062 — primary line in `src/components/SEO.tsx`,
  `src/pages/Contact.tsx`, and `src/components/home/ContactSection.tsx`
- **Alternate phone:** (916) 507-4802 — listed in `src/components/Footer.tsx`
  and `src/components/home/ContactSection.tsx`
- **Email:** drippysudsllc@gmail.com (per `src/components/SEO.tsx` and
  `src/pages/Contact.tsx`)
- **Yelp profile:** https://www.yelp.com/biz/drippy-suds-mobile-detailing-sacramento
- **Facebook:** https://www.facebook.com/profile.php?id=61583284144373
- **Instagram:** https://www.instagram.com/_drippy_suds/
- **Schema.org type:** `LocalBusiness` (per `src/components/SEO.tsx`)
- **Price range:** `$$` (per `src/components/SEO.tsx`)
- **Satisfaction guarantee** — per `src/components/home/WhyChooseSection.tsx`:
  "If you're not completely satisfied, we'll make it right."
- **First-time client offer** — per `src/components/home/HeroSection.tsx`:
  "First-time clients get $25 off."

Drop-in sentences the agent may use verbatim:

- "Reach Drippy Suds Mobile Detailing at (916) 539-2062 or
  drippysudsllc@gmail.com to book."
- "Drippy Suds is based at 2101 53rd Ave, Sacramento, CA 95822 and runs fully
  mobile across the greater Sacramento area."
- "First-time Drippy Suds clients receive $25 off their first appointment."
- "Every Drippy Suds detail is backed by a satisfaction guarantee — if you're
  not completely satisfied, we'll make it right."

Credentials that are **not** in the codebase and must not be claimed:
license number, contractor's license, BBB rating, years-in-business count,
bonded status, formal insurance language, IDA / IDA-certified status, ceramic
coating manufacturer authorizations (e.g. Gtechniq, Ceramic Pro, IGL), or any
specific years-of-experience number. None of these appear anywhere in the
source — do not assert them.

---

## 2. Tone and Voice

Derived from existing copy in `HeroSection.tsx`, `AboutSection.tsx`,
`SEOContentSection.tsx`, `WhyChooseSection.tsx`, and the service entries in
`src/data/servicePages.ts`.

- **Reading level:** plain, direct, conversational. Service-page bodies use
  short declarative sentences and explicitly call out "uncomfortable truths"
  and "the straight answer." Avoid academic phrasing, marketing jargon, and
  trade buzzwords stacked together.
- **Pronoun choice:** first person plural — "we" and "our." Hero subtitle:
  *"Sacramento's trusted mobile detailing service. We come to you."* About
  body: *"We're not a car wash. We're detailers."* Never refer to the business
  in third person ("Drippy Suds provides...").
- **Sentence structure:** mix short declarative openers with longer explanatory
  sentences. The Ceramic Coatings page opens *"Ceramic coating is the most
  oversold service in the detailing industry."* That blunt opener pattern is
  the brand's signature — use it on pages that explain a service in depth.
- **Verbatim brand phrases that must be available for reuse:**
  - "Your Car, Our Obsession" (hero headline)
  - "Premium Mobile Detailing" (hero eyebrow)
  - "Luxury Mobile Detailing — Any Place, Any Time" (footer tagline)
  - "We come to you — anywhere, anytime" (hero subtitle pattern)
  - "We're not a car wash. We're detailers." (about body)
  - "The details aren't just details. They're the whole point." (about body)
  - "The Drippy Difference" (Why Choose eyebrow)
  - "Born from a Passion for Cars" (about headline)
- **Phrases to avoid** because they would sound generic or like a different
  trade: "your trusted partner," "one-stop shop," "state-of-the-art facility"
  (the business has no facility customers visit), "industry-leading" without
  a specific claim behind it, "fully licensed and insured" (not stated in
  code — do not claim), "decades of experience" or any specific year count,
  "free estimates" (not offered in code), "24/7 emergency service" (not
  offered).
- **Local references the copy already uses and that should keep appearing:**
  Sacramento neighborhoods named in existing copy include Midtown, East Sac,
  Land Park, Natomas, Pocket, Arden-Arcade, downtown Sacramento, and 16th
  Street (referenced in the Exterior Wash page). The American River, Folsom
  Lake corridor, Douglas Boulevard (Granite Bay area), Citrus Heights
  light-rail stops, and the Fair Oaks historic village all appear in city
  copy and should be reused where geographically accurate. Climate references
  the copy uses: Sacramento triple-digit summers, Central Valley UV, brake
  dust and rail dust on commuter routes, valley oak pollen, agricultural dust
  near Rancho Cordova, tree sap from mature street trees, mineral deposits
  from well water in Fair Oaks.
- **What would make content sound wrong:** any reference to snow, ice melt,
  road salt, freeze-thaw damage, hail, hurricane preparation, or coastal salt
  spray. Sacramento has none of those. Any reference to a shop or waiting
  room. Any reference to a fleet of branded trucks (the codebase doesn't
  describe vehicles or crew size). Any reference to franchise locations.
  Pricing other than the $25 first-time offer.

---

## 3. Service-Specific Content Rules

One rule block per service in `src/data/servicePages.ts`. These are the rules
the content agent must apply when generating or enriching each service page.

- **Interior Detail Only (`interior-detail`, category: Interior Detailing):**
  Always mention that the service is mobile and runs at the customer's home,
  office, or apartment lot — no shop visit. Always reference the cadence
  guidance already established on the page (every 4–6 months for typical
  Sacramento drivers, every 3 months for families / pet owners / rideshare
  drivers / people who eat in the car). Always disclose honestly that deep
  smoke or pet odor may need an additional ozone or enzyme treatment beyond
  the standard service. Never claim the service permanently removes odors,
  never quote a fixed price, and never claim a time guarantee shorter than
  the 90-minute-to-2-hour range already documented. Never imply leather
  reconditioning or dye repair — the existing copy describes cleaning and
  conditioning only.

- **Exterior Wash Only (`exterior-wash`, category: Exterior Detailing):**
  Always frame the service against the two existing comparison points already
  on the page: automatic tunnel washes (cause swirl marks and spider-webbing)
  and touchless washes (strip wax and sealants with alkaline chemicals). The
  16th Street tunnel wash reference is the established local touchpoint and
  should be reused. Always note that Exterior Wash Only does not include a
  long-term sealant — that upsell path goes to wax, spray sealant, or
  ceramic coating. Never claim the wash removes scratches, never claim it
  prevents future swirls without proper drying technique, and never claim
  ceramic coating is included. The Roseville-summer / Folsom-tree-shade
  parking pattern is the existing geographic anchor — keep using it.

- **Drippy Diamond Package (`drippy-diamond-package`, category: Full Detail
  Package):** Always present this as the bundled interior + exterior service
  for less than booking both separately. Reference the same mobile-only
  delivery model. Never claim it includes ceramic coating (ceramic is a
  separate service); never quote a duration shorter than the combined
  realistic time of the two component services. Position it as the "if both
  the inside and outside need attention" choice.

- **Ceramic Coatings (`ceramic-coatings`, category: Paint Protection):**
  Always lead with the existing honest framing: ceramic coating is the most
  oversold service in the detailing industry, and the page's job is to tell
  the straight answer. Always state the realistic durability range (2–5
  years depending on product tier, application quality, and maintenance) and
  the four real benefits the existing copy lists: hydrophobic water behavior,
  UV resistance, chemical resistance, and depth of gloss. Always state the
  three things ceramic coating does **not** do (per the existing copy):
  prevent rock chips, prevent scratches from improper washing, eliminate
  the need to wash the car. Always reference the Sacramento climate argument
  (intense UV and heat) as the reason the coating's value is stronger here
  than in milder markets. Never use the words "permanent," "scratch-proof,"
  "bulletproof," or "impervious" in any positive claim — the existing copy
  explicitly debunks those marketing phrases. Never claim a manufacturer
  authorization that is not in the codebase.

---

## 4. City-Specific Content Rules

Rules below apply when generating any of the twelve city landing pages listed
in Section 1.

### Regional conditions to weave into city content

- **Climate:** Sacramento Valley climate — triple-digit summer highs,
  intense UV exposure, low summer humidity, mild wet winters with no snow
  or freeze-thaw. The existing copy treats UV, heat, and sun damage as the
  primary paint stressors — keep that framing. Do not reference snow, ice
  melt, road salt, freeze-thaw cycles, hail, or coastal salt spray.
- **Environmental contaminants the existing copy already names:** Central
  Valley agricultural dust (Rancho Cordova), heavy valley-oak pollen (Elk
  Grove, Fair Oaks), tannic acid and tree sap from mature street trees
  (Citrus Heights, Elk Grove, Granite Bay-area shading), brake dust and rail
  dust near light-rail stops (Citrus Heights), mineral deposits from well
  water (Fair Oaks ranch properties), and freeway commuter grime
  (Rancho Cordova).
- **Housing and parking patterns visible in the copy:** mix of downtown
  garage parking (Sacramento), suburban driveways (Elk Grove, Roseville,
  Fair Oaks), and street parking under mature trees (Folsom, Citrus
  Heights). Several city pages reference families with young kids and
  family SUVs as a dominant customer profile in the suburban cities.

### Specific neighborhoods, districts, and landmarks already named in the codebase

Reuse only these — do not invent new place names.

- **Sacramento:** Midtown, East Sac, Land Park, Natomas, Pocket,
  Arden-Arcade, downtown Sacramento, 16th Street.
- **Folsom:** Folsom Lake corridor.
- **Granite Bay area (referenced in copy patterns):** Douglas Boulevard.
- **Fair Oaks:** historic village, American River proximity, equestrian /
  ranch properties.
- **Citrus Heights:** light-rail stops, mature tree-lined streets.
- **Rancho Cordova:** freeway commute corridor, agricultural-edge dust.
- **Elk Grove:** mature suburban neighborhoods, family-oriented community.

### Local utilities, municipalities, and permit context

The codebase does not name any specific utility, AHJ, permit office, or
municipal department. Mobile auto detailing in California is not a permitted
trade in the way electrical or plumbing work is, and the existing copy makes
no utility or permit claims. **Do not invent utility names, code citations,
or permit references on city pages.** If a city-specific regulatory point
needs to be made and it is not already in the codebase, omit it.

### Cities with distinct local character worth calling out

- **Sacramento** — the urban core, treated as the primary service market
  with the broadest neighborhood list.
- **Folsom** — Folsom Lake corridor is the established geographic hook;
  shaded street parking is the established detailing relevance.
- **Fair Oaks** — historic village, American River, equestrian properties
  and well-water mineral deposits are the established hooks.
- **Rancho Cordova** — agricultural dust and freeway commuter grime are
  the established detailing-relevant conditions; fleet-vehicle programs
  are explicitly mentioned in the existing copy.
- **Citrus Heights** — light-rail rail-dust and tree-lined streets are the
  established hooks.
- **Elk Grove** — family-oriented suburban community with kids and pets is
  the established customer-profile hook.
- **Arden-Arcade and North Highlands** — included in the service area and
  referenced as Sacramento-adjacent neighborhoods, but no distinct local
  hooks appear in the existing copy. Keep new content for these conservative
  and grounded in the same valley-climate framing rather than inventing
  neighborhood-specific landmarks.

### Generic city-filler vs genuinely local

Generic filler that this brand should never publish on city pages:

- "Serving all of [City] and the surrounding areas with pride."
- "Family-owned and operated for generations." (no years-in-business in code)
- "Your local trusted [trade] experts." (third-person voice, generic)
- "We treat your home like our own." (wrong trade — this is a vehicle
  service, not a residential trade)
- Pricing for any service other than the $25 first-time offer.

What makes content actually local for this brand:

- Naming an actual neighborhood from the list above instead of "your
  neighborhood."
- Citing a specific local environmental factor from the regional-conditions
  list instead of a generic "harsh weather."
- Using the established climate framing (UV, summer heat, valley dust, tree
  sap, well water) instead of generic seasonal framing.
- Tying the service recommendation back to a real Sacramento driving
  pattern — commuter on the freeway, parked under valley oaks, garaged
  downtown, family SUV in Elk Grove, ranch property in Fair Oaks.
- Using the brand's first-person voice and the established blunt-honest
  service-page tone, not generic SEO city-page boilerplate.
