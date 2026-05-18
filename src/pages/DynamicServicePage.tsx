import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { SeoInjectedLinks } from "@/components/SeoInjectedLinks";
import { SeoReviewBlocks } from "@/components/SeoReviewBlocks";
import { SeoContentOverrides } from "@/components/SeoContentOverrides";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import PageHero from "@/components/PageHero";
import { Link } from "react-router-dom";
import { GALLERY } from "@/lib/images";
import { servicePages } from "@/data/servicePages";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const relatedServices = [
  { label: "Interior Detail Only", href: "/services/interior-detail", anchors: ["Interior Detail Only"] },
  { label: "Exterior Wash Only", href: "/services/exterior-wash", anchors: ["Exterior Wash Only", "exterior wash"] },
  { label: "Drippy Diamond Package", href: "/services/drippy-diamond-package", anchors: ["Drippy Diamond Package", "full package", "full detail"] },
  { label: "Ceramic Coatings", href: "/services/ceramic-coatings", anchors: ["Ceramic Coatings", "ceramic coating"] },
];

const serviceAreaLinks = [
  { label: "Sacramento", href: "/mobile-detailing-sacramento", anchors: ["Sacramento mobile detailing", "mobile detailing in Sacramento", "Sacramento"] },
  { label: "Elk Grove", href: "/mobile-detailing-elk-grove", anchors: ["Elk Grove mobile detailing", "mobile detailing in Elk Grove", "Elk Grove"] },
  { label: "Folsom", href: "/mobile-detailing-folsom", anchors: ["Folsom mobile detailing", "mobile detailing in Folsom", "Folsom"] },
  { label: "Roseville", href: "/mobile-detailing-roseville", anchors: ["Roseville mobile detailing", "mobile detailing in Roseville", "Roseville"] },
];

const serviceHeroImages: Record<string, string> = {
  "interior-detail": GALLERY.interiorClean,
  "exterior-wash": GALLERY.premiumWash,
  "drippy-diamond-package": GALLERY.exteriorSedan,
  "ceramic-coatings": GALLERY.ceramicCoating,
};

const serviceHeroDescriptions: Record<string, string> = {
  "interior-detail": "Deep cabin cleaning for carpets, seats, vents, leather, glass, pet hair, odors, and high-touch surfaces — handled at your location.",
  "exterior-wash": "A proper mobile hand wash for paint, wheels, tires, and glass without the swirl marks and shortcuts of a drive-through wash.",
  "drippy-diamond-package": "A complete interior and exterior reset for daily drivers, family vehicles, and SUVs that need everything handled in one visit.",
  "ceramic-coatings": "Long-term paint protection that adds gloss, slickness, UV resistance, and easier maintenance for Sacramento daily drivers.",
};

const serviceInlineImages: Record<string, string[]> = {
  "interior-detail": [GALLERY.interiorClean, GALLERY.beforeFloor, GALLERY.afterFloor],
  "exterior-wash": [GALLERY.premiumWash, GALLERY.exteriorWhite, GALLERY.wheelDetail],
  "drippy-diamond-package": [GALLERY.exteriorSedan, GALLERY.interiorClean, GALLERY.waxFinish],
  "ceramic-coatings": [GALLERY.ceramicCoating, GALLERY.exteriorSedanDark, GALLERY.exteriorRed],
};

const variantEyebrows = ["Inside the service", "Honest answer", "How it works"];

// Slots (0-indexed section positions) where an inline gallery image is inserted AFTER the section
const IMAGE_SLOTS = [1, 3, 5];

function InlineGalleryImage({ src, alt }: { src: string; alt: string }) {
  return (
    <motion.div
      className="mb-10 overflow-hidden rounded-none"
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="aspect-[16/9] md:aspect-[21/9] w-full object-cover"
      />
    </motion.div>
  );
}

function SectionBlock({
  section,
  index,
  pagePath,
  asSubheading = false,
  children,
}: {
  section: { heading: string; content: string };
  index: number;
  pagePath: string;
  asSubheading?: boolean;
  children?: React.ReactNode;
}) {
  // Cycle: A, B, C, A, D, B, C, A, ...
  const cycle = ["A", "B", "C", "A", "D", "B", "C", "A"];
  const variant = cycle[index % cycle.length];

  const HeadingTag = asSubheading ? "h3" : "h2";
  const headingSize = asSubheading ? "text-xl" : "text-2xl";

  // Variant D — pull-quote: split first sentence
  if (variant === "D") {
    const match = section.content.match(/^([^.!?]+[.!?])\s+([\s\S]+)$/);
    if (match) {
      const [, lead, rest] = match;
      return (
        <motion.div
          className="mb-10"
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <HeadingTag className={`font-heading ${headingSize} font-bold text-foreground mb-4`}>
            {section.heading}
          </HeadingTag>
          <p className="font-heading text-xl md:text-2xl leading-snug text-foreground mb-4">
            {lead}
          </p>
          <div className="border-t border-border pt-4 text-muted-foreground leading-relaxed whitespace-pre-line">
            {renderLinkedContent(rest, pagePath)}
          </div>
          {children}
        </motion.div>
      );
    }
    // fall through to Variant A if split fails
  }

  // Variant C — card panel with eyebrow
  if (variant === "C") {
    const eyebrow = variantEyebrows[Math.floor(index / 4) % variantEyebrows.length];
    return (
      <motion.div
        className="mb-10 bg-card border border-border rounded-none p-6 md:p-8"
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className="block font-body text-xs uppercase tracking-[0.3em] font-bold text-primary mb-3">
          {eyebrow}
        </span>
        <HeadingTag className={`font-heading ${headingSize} font-bold text-foreground mb-3`}>
          {section.heading}
        </HeadingTag>
        <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
          {renderLinkedContent(section.content, pagePath)}
        </div>
        {children}
      </motion.div>
    );
  }

  // Variant B — accent rail
  if (variant === "B") {
    return (
      <motion.div
        className="mb-10 border-l-2 border-primary pl-6"
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <HeadingTag className={`font-heading ${headingSize} md:text-3xl font-bold text-foreground mb-3`}>
          {section.heading}
        </HeadingTag>
        <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
          {renderLinkedContent(section.content, pagePath)}
        </div>
        {children}
      </motion.div>
    );
  }

  // Variant A — standard (default)
  return (
    <motion.div
      className="mb-10"
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <HeadingTag className={`font-heading ${headingSize} font-bold text-foreground mb-3`}>
        {section.heading}
      </HeadingTag>
      <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
        {renderLinkedContent(section.content, pagePath)}
      </div>
      {children}
    </motion.div>
  );
}

const drippyDiamondWorthItSections = [
  {
    heading: "Is a Full Mobile Detail Actually Worth It? (A Straight Answer for Sacramento Drivers)",
    content: `Short version: yes, but not as often as some shops want you to believe. A full detail every three to four months is the sweet spot for most daily drivers in the Sacramento area. Garaged weekend cars can stretch to twice a year. If you're parking outside in Roseville or commuting daily from Elk Grove or Folsom into downtown, lean toward the shorter end of that window.

The reason the timing matters is that cars don't get dirty at a steady pace around here. They get dirty in waves. Spring dumps pollen into every seam and vent. Summer bakes bug splatter and tree sap onto the clear coat, and a 110-degree hood in July can turn a bird dropping into permanent paint etching in under 24 hours. Fall brings the ash and smoke haze the valley has gotten used to. Winter adds tule fog grime and the road film that kicks up off I-5, Highway 50, and I-80 every morning. A full mobile detail resets all of it at once instead of letting the damage compound.`,
  },
  {
    heading: "What a full detail actually covers that a car wash doesn't",
    content: `A drive-through wash touches the paint and nothing else. A full detail is a completely different service. Inside the cabin, that means a real vacuum through the seats, mats, floor edges, and the crevices where crumbs actually live — not a courtesy pass with a shop vac. Leather and plastics get cleaned and protected. Vents, consoles, cupholders, door panels, the steering wheel, and every high-touch surface get handled. Door jambs too, because a clean interior feels unfinished the second you open the door on a grimy jamb.

Outside, it starts with a proper hand wash using a premium shampoo, not an automated brush pass that slowly scratches your clear coat over time. Rims get degreased to cut through the brake dust that builds up from stop-and-go traffic. Tires get cleaned down to actual rubber and then dressed for that deep black finish. Paint gets ceramic sealant applied after the wash, which adds slickness, gloss, and a few months of real protection against water spots, sap, and contaminants.`,
  },
  {
    heading: "How much does a full detail cost and how long does it take?",
    content: "A full mobile detail through Drippy Suds is typically scheduled around a two-hour appointment window, and pricing varies based on vehicle size and condition. A clean-ish sedan that just needs a refresh sits at one end of the range. A three-row SUV with kids, a dog, and six months of neglect sits at the other. The honest answer on price is that anyone quoting you an exact number without seeing the vehicle is guessing. Book the service and we'll confirm the price when we see what we're working with.",
  },
  {
    heading: "Why people book the full package instead of picking services à la carte",
    content: "Interior and exterior condition feed off each other in a way that's hard to appreciate until you see both handled at once. Clean paint looks twice as sharp when the glass is streak-free and the tires are dressed. A fresh cabin feels finished when the door jambs aren't grimy. Splitting it into separate appointments costs more in total, takes more of your time, and usually means one half of the car is always playing catch-up to the other. The full detail exists because handling everything in a single visit is both cheaper and more effective than doing it piecemeal.",
  },
  {
    heading: "Mobile detailing vs. taking it to a shop",
    content: "The case for mobile is mostly about your time. A shop detail means driving a dirty car across town, sitting in a waiting room for two to three hours, then driving home. A mobile detail means we come to your driveway, office parking lot, or apartment complex, run the full interior and exterior process, and leave. You get the afternoon back. The quality is the same either way — the work is identical to what a good shop delivers, just done at your address.",
  },
  {
    heading: "Service area",
    content: `Drippy Suds runs full mobile detailing across Sacramento, Elk Grove, Folsom, and Roseville, plus most of the surrounding neighborhoods in between. If you're inside the greater Sacramento metro, we can get to you.

If it's been more than four months since the last real detail, it's probably time. Book the Drippy Diamond Package and we'll come to you.`,
  },
];

const interiorDetailCleanSections = [
  {
    heading: "How Often Should You Detail the Inside of Your Car? (And What Actually Gets It Clean)",
    content: `Most people underestimate how dirty their car's interior really is. A 2014 study out of Queen Mary University tested car interiors against public toilets and found the average steering wheel, gear shifter, and seatbelt buckle carried more bacteria than a toilet seat. The culprits are obvious once you think about them: food, drinks, sweat, pet hair, kid mess, hands that touched a gas pump and then touched the wheel, shoes that walked through a parking lot and then sat on the carpet.

For most Sacramento drivers, a full interior detail every four to six months keeps the cabin genuinely clean instead of just visually passable. Families with young kids, dog owners, rideshare drivers, and anyone eating lunch in the car should shorten that to every three months. Single-driver commuters with clean habits can stretch it to twice a year without it getting out of hand. The wrong move is waiting until it looks bad, because by then the mess has already worked its way into the carpet fibers, the seat stitching, and the vents, and it takes more to get it out.`,
  },
  {
    heading: "What an interior detail actually includes",
    content: `A real interior detail is not a vacuum and a wipe-down. It's a methodical pass through every surface in the cabin using different products and techniques for different materials — because leather, vinyl, cloth, plastic, and carpet all need to be treated differently. Use the wrong product on leather and you'll dry it out. Use a generic all-purpose cleaner on a screen and you'll haze the coating. Use too much water on cloth seats and you'll trap moisture that smells worse a week later than whatever you were trying to remove.

The process starts with a full debris removal — everything out of the car, floor mats pulled, seats moved through their full range so the tracks and the areas underneath actually get reached. Then a deep vacuum through the carpets, seats, seams, storage pockets, and the crevices where crumbs hide. Vents get blown out because dust settles deep into the HVAC system and most people never touch it. Cupholders get pulled and scrubbed, not swiped at. The steering wheel, gear shifter, door handles, buttons, screens, and every other high-touch surface get cleaned and disinfected because those are the surfaces your hands actually live on.

Carpets and upholstery get treated based on condition. Light soiling gets a different approach than deep stains. Leather gets cleaned and conditioned. Plastics and trim get cleaned and finished with a controlled, non-greasy shine. Door jambs get wiped down because a clean cabin feels unfinished the second you open a grimy door. Windows and mirrors get done from the inside for streak-free glass.`,
  },
  {
    heading: "Does interior detailing get pet hair out?",
    content: "Yes, and this is one of the biggest reasons dog owners book the service. Pet hair works itself into cloth and carpet in a way that a home vacuum genuinely cannot pull out — the fibers grip the hair and hold onto it. Getting it out takes the right tools, extraction, and time. It's one of those jobs where the difference between a home vacuum attempt and a professional interior detail is not subtle. You'll see the hair pulled out that you didn't know was still there.",
  },
  {
    heading: "Does interior detailing remove smells?",
    content: "Most of the time, yes — and more importantly, it removes them the right way. Air fresheners and sprays don't remove odors, they just cover them for a day or two until the source comes back. A real interior detail removes the source: the milk that spilled under the seat three weeks ago, the gym bag that lived in the back, the dog that got caught in the rain. Once the source is gone, the smell is gone. If a smoke or pet odor is deeply embedded, that may need an additional ozone or enzyme treatment beyond a standard detail, and we'll tell you that honestly when we see the vehicle.",
  },
  {
    heading: "How long does an interior detail take?",
    content: "Most interior-only appointments run around ninety minutes to two hours depending on the size of the vehicle and what we're working with. A clean-ish commuter sedan sits at one end. A family SUV with three kids, a dog, and a few months of accumulation sits at the other. The service is mobile, so we handle it at your home, your office, your apartment lot, or wherever the car is parked. You don't lose your afternoon.",
  },
  {
    heading: "When to book Interior Detail Only versus the full package",
    content: "Book Interior Detail Only when the outside can wait but the inside can't. That's the service for a spill, a road trip recovery, a pet hair problem, a smell you can't get rid of, or the point where the cabin just stops feeling like yours. If the paint also needs attention, the Drippy Diamond Package handles both at once for less than booking them separately.",
  },
  {
    heading: "Service area",
    content: `Drippy Suds runs mobile interior detailing across Sacramento, Elk Grove, Folsom, Roseville, and the surrounding neighborhoods. If you're inside the greater Sacramento metro, we can get the cabin clean at your address — no shop visit, no waiting room, no driving a dirty car across town to make it a clean one.

If the inside of your car has been bothering you for a while, it's probably time. Book Interior Detail Only and we'll come to you.`,
  },
];

const exteriorWashHandWashSections = [
  {
    heading: "Why Hand Washing Your Car Matters More Than You Think (The Case Against the Drive-Through)",
    content: `Here's the uncomfortable truth most drivers don't want to hear: automatic car washes scratch your paint. Not maybe, not sometimes. They scratch it every time. Those spinning brushes and cloth strips pick up dirt, grit, and metal particles from the hundreds of cars that went through before yours, and then they drag that abrasive cocktail across your clear coat at speed. The result is called swirl marks or spider-webbing, and once you see them in direct sunlight you can't unsee them. Over a few years of weekly tunnel washes, a car's paint can lose a noticeable amount of its original gloss and depth — not from age, but from how it's been washed.

Touchless washes are gentler on the surface but come with their own problem: they rely on harsh alkaline chemicals to strip dirt without physical contact, and those chemicals strip wax, sealants, and trim coatings right along with it. You end up with a car that's technically clean but has zero protection left on the paint.

A proper hand wash avoids both problems. That's the whole argument for booking an exterior detail instead of rolling through the tunnel on 16th Street one more time.`,
  },
  {
    heading: "How often should you wash your car in Sacramento?",
    content: `Every two weeks is the general rule for a daily driver, but the Sacramento climate pushes that tighter in certain seasons. In spring, pollen coats every car in the valley within 48 hours of a wash — a biweekly rhythm is the minimum. Summer adds bug splatter from highway driving and tree sap from parking under anything with leaves, both of which etch clear coat if they sit too long in the heat. Fall brings ash and smoke residue from whatever the wildfire season is doing. Winter is actually the easiest stretch, but tule fog grime and road film still build up on lower panels from I-5, Highway 50, and I-80 commutes.

The fastest way to damage your paint in this climate is to let contaminants sit. Bird droppings are the worst offender — the acidity combined with a 100-degree hood can etch permanent marks into clear coat in less than 48 hours. Bug residue and tree sap work the same way, just slower. A regular exterior wash isn't just about looking clean. It's about not letting the paint degrade while you're not paying attention.`,
  },
  {
    heading: "What a real hand wash actually involves",
    content: `The process matters more than people realize, because a bad hand wash can actually do more damage than a good automatic wash. Drippy Suds uses what's called the two-bucket method — one bucket for clean soapy water, one bucket for rinsing the dirt off the wash mitt before it touches the paint again. That single step is the difference between washing a car and grinding dirt into the clear coat with every pass.

The full process: a pre-rinse to knock loose surface grime, a foam application to lift contaminants off the paint before contact, a hand wash with a soft mitt working top-down so dirtier lower panels get touched last, a thorough rinse, wheels and tires cleaned separately with dedicated tools so brake dust doesn't cross-contaminate the paint, glass cleaned inside-out for streak-free clarity, and a careful dry with clean microfiber to prevent water spots. Tires get dressed cleanly — applied to the rubber, not slopped up the sidewall where it attracts dust and looks amateur a day later.

The whole thing takes longer than five minutes in a tunnel, which is the point. The extra time is where the paint protection happens.`,
  },
  {
    heading: "Does an exterior wash include wax or ceramic coating?",
    content: "A standard Exterior Wash Only cleans the paint but does not include a long-term paint sealant. If you want added protection — slickness, gloss, water-beading, resistance to sap and bug residue — you want either a wax application, a spray sealant, or a proper ceramic coating layered on top of a clean surface. Ceramic coating is the longest-lasting of the three, typically running one to three years of real protection depending on the product. For drivers who park outside in Roseville summers or leave the car on the street in Folsom under trees, it's the single best upgrade you can make to reduce how often you need to wash.",
  },
  {
    heading: "How long does a mobile exterior wash take?",
    content: "Most exterior-only appointments run about 60 to 90 minutes depending on vehicle size and condition. A sedan in decent shape sits at the shorter end. A dusty three-row SUV that hasn't been washed in two months sits at the longer end. The service is mobile, which means it happens at your driveway, your office lot, or wherever the vehicle is parked. No drive across town, no waiting room.",
  },
  {
    heading: "When to book Exterior Wash Only versus the full package",
    content: "Book Exterior Wash Only when the inside of the cabin is already clean and only the outside needs attention. It's the right service before a weekend trip, before picking up a client, after a dusty drive, after rain spots the windows, or when the car has been sitting outside long enough to look tired. If the interior also needs work, the Drippy Diamond Package handles both for less than booking the two services separately.",
  },
  {
    heading: "Service area",
    content: `Drippy Suds provides mobile exterior washes and hand detailing across Sacramento, Elk Grove, Folsom, Roseville, and the surrounding neighborhoods. We come to your address, wash the vehicle properly by hand, and leave you with paint that actually looks cared for instead of processed.

If the paint is looking flat, the wheels are dark, or the glass never seems clear, book an Exterior Wash Only appointment and we'll handle it at your location.`,
  },
];

const ceramicCoatingWorthItSections = [
  {
    heading: "Is Ceramic Coating Worth It in Sacramento? (An Honest Breakdown Before You Spend the Money)",
    content: `Ceramic coating is the most oversold service in the detailing industry. You've probably seen ads claiming it makes your car scratch-proof, permanent, impervious to damage, or bulletproof against rock chips. None of that is true. What ceramic coating actually does is useful, significant, and worth the money for the right owner — but only if you understand what you're actually buying.

Here's the straight answer: a professional ceramic coating is a liquid polymer that chemically bonds to your clear coat, creating a semi-permanent protective layer that adds hydrophobic water behavior, UV resistance, chemical resistance, and depth of gloss. A good one lasts two to five years depending on the product tier, the quality of the application, and how the vehicle is maintained. It makes washing dramatically easier, helps the paint stay glossier longer, and gives real protection against bird droppings, tree sap, bug residue, water spots, and UV fading. It does not prevent rock chips. It does not prevent scratches from improper washing. It does not eliminate the need to wash the car.

For Sacramento drivers, the climate argument for ceramic coating is stronger than it is in most parts of the country. Here's why.`,
  },
  {
    heading: "Why the Central Valley is hard on paint",
    content: `Sacramento paint takes a beating that drivers in cooler, cloudier regions just don't deal with. The valley averages over 260 sunny days a year, and UV radiation is the single biggest long-term killer of automotive clear coat. Sun exposure causes oxidation, which is what turns a formerly glossy finish flat, chalky, and faded — especially on red, black, and dark blue paint. A ceramic coating blocks a significant portion of UV before it reaches the clear coat, which meaningfully slows that fading process.

On top of UV, you've got summer heat that regularly pushes surface temperatures on a parked car's hood past 160°F. Bird droppings on a 160°F hood can etch through clear coat in under 48 hours. Tree sap from the valley's oaks, sycamores, and pines bonds to hot paint and is a nightmare to remove without damaging the finish underneath. Sprinkler water with the hard mineral content we have in this region leaves calcium spots that can etch in permanently if left in the sun. Pollen in March and April gets acidic when it absorbs moisture. Ash from fire season settles into every seam.

Ceramic coating doesn't make any of that go away. What it does is buy you time — in many cases, it gives you enough of a window to wash off contaminants before they damage the paint, where an uncoated car might already be etched by the time you notice.`,
  },
  {
    heading: "How long does ceramic coating actually last?",
    content: `This is where most of the confusion in the market comes from. The honest breakdown:

Entry-level professional coatings — roughly 1 to 2 years of real protection. Good for lease cars, daily drivers on a budget, or anyone testing the waters before committing to a longer-term coating.

Mid-tier professional coatings — 2 to 4 years of real protection. The sweet spot for most daily drivers. Strong gloss, reliable hydrophobic behavior, and enough durability to genuinely outlast the alternatives.

Multi-year premium coatings — 5+ years with proper maintenance. Best for garaged vehicles, enthusiast cars, and owners who plan to keep the vehicle long-term.

The catch nobody advertises: those durability numbers assume proper application, proper prep, and proper maintenance. A coating that's advertised as 5-year can fail in 18 months if it was applied over contaminated paint, rushed, or skipped steps during prep. This is why prep work is roughly half the job and half the reason professional coatings cost what they cost.`,
  },
  {
    heading: "Ceramic coating vs. wax vs. paint sealant",
    content: "Wax lasts two to three months. Paint sealant lasts four to six months. Ceramic coating lasts years. Wax and sealant sit on top of the paint and wash off over time. Ceramic coating chemically bonds to the clear coat and only degrades through UV exposure and chemical breakdown. The gloss level on a fresh ceramic coating is also noticeably deeper than wax — it adds what detailers call \"candy\" to the paint, a wet, reflective depth that's hard to get any other way.\n\nIf you wash your car monthly and don't mind reapplying protection a few times a year, wax or sealant is fine. If you'd rather apply protection once and not think about it for two to five years, ceramic is the move. The math usually favors ceramic for anyone keeping their vehicle more than two years.",
  },
  {
    heading: "Why prep work matters more than the coating itself",
    content: `The single biggest reason ceramic coating jobs fail early is bad prep. A coating is only as good as the surface it bonds to. If there's any wax, sealant, polish residue, embedded contamination, or dust on the paint when the coating goes down, the coating bonds to that contaminant instead of the clear coat. When the contaminant washes off or breaks down, the coating goes with it.

Proper prep means a thorough wash, a clay bar treatment or iron decontamination to pull embedded contaminants out of the clear coat, usually some level of paint correction or polish depending on the paint's condition, and a panel wipe to remove any oils before the coating is applied. That prep process is typically more labor-intensive than the coating application itself, and it's where the difference between a $400 coating job and an $1,800 coating job actually lives.

Drippy Suds does not skip prep. If the paint isn't ready for coating, we'll tell you — and in some cases we'll recommend starting with a Drippy Diamond Package or paint correction first, because coating over a dirty or damaged surface is a waste of your money.`,
  },
  {
    heading: "How much does ceramic coating cost in Sacramento?",
    content: "Professional ceramic coating pricing varies significantly based on vehicle size, paint condition, the tier of coating being applied, and how much prep work the paint needs. An entry-level coating on a small car with paint in good condition sits at the lower end. A premium multi-year coating on a large SUV that needs paint correction first sits at the higher end. Anyone quoting you a flat number without seeing the vehicle is either lowballing to book the appointment or selling a product that skips prep. Send us photos or book a consultation and we'll give you an honest quote.",
  },
  {
    heading: "Is ceramic coating worth it for you?",
    content: `It's worth it if you keep your vehicles more than two years, if you care about long-term paint appearance, if the car is parked outside regularly, if you have darker paint that shows swirl marks and fading more easily, or if you're just tired of waxing every few months. It's less worth it for short-term lease vehicles with less than 18 months remaining, for owners who never wash their cars anyway, or for drivers who don't mind a car that slowly goes matte over time.

The best time to ceramic coat a car is right after you buy it, when the paint is at its freshest. The second-best time is now, after proper prep, before another summer of Central Valley sun takes more out of the finish.`,
  },
  {
    heading: "Service area",
    content: `Drippy Suds applies professional ceramic coatings across Sacramento, Elk Grove, Folsom, Roseville, and the surrounding neighborhoods. The service is mobile, which is unusual for ceramic coating — most shops require you to leave the vehicle overnight. We bring the work to your driveway, garage, or covered parking, complete the prep and application in a controlled environment, and walk you through the cure window and maintenance process before we leave.

If you want the finish actually protected instead of just cleaned, book a Ceramic Coatings appointment and we'll handle the prep, the application, and the honest conversation about what tier of coating makes sense for your vehicle.`,
  },
];

const renderLinkedContent = (content: string, currentPath: string) => {
  const linkTargets = [
    ...relatedServices,
    ...serviceAreaLinks,
    { label: "mobile detailing services", href: "/services", anchors: ["mobile detailing services"] },
  ].filter((link) => link.href !== currentPath);
  const anchorTargets = linkTargets
    .flatMap((link) => link.anchors.map((anchor) => ({ anchor, href: link.href })))
    .sort((a, b) => b.anchor.length - a.anchor.length);
  const linkedHrefs = new Set<string>();
  const pattern = new RegExp(`(${anchorTargets.map((link) => link.anchor.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi");

  return content.split(pattern).map((part, index) => {
    const match = anchorTargets.find((link) => link.anchor.toLowerCase() === part.toLowerCase());
    if (!match || linkedHrefs.has(match.href)) return part;
    linkedHrefs.add(match.href);
    return (
      <Link key={`${match.href}-${index}`} to={match.href} className="text-primary hover:underline underline-offset-4">
        {part}
      </Link>
    );
  });
};

export default function DynamicServicePage() {
  const { serviceSlug } = useParams();
  const pagePath = `/services/${serviceSlug}`;
  const serviceEntry = servicePages.find((service) => service.slug === serviceSlug);

  if (!serviceEntry) {
    return (
      <Layout>
        <div className="container max-w-4xl py-16 text-center">
          <h1 className="font-heading text-3xl font-bold text-foreground mb-4">Page Not Found</h1>
          <p className="text-muted-foreground mb-6">This service page hasn't been created yet.</p>
          <Link to="/services" className="text-primary hover:underline">← Back to Services</Link>
        </div>
      </Layout>
    );
  }

  const page = {
    title_tag: serviceEntry.seoTitle,
    meta_description: serviceEntry.seoDescription,
    h1: serviceEntry.heroTitle,
    intro_paragraph: serviceEntry.introParagraphs[0] || serviceEntry.seoDescription,
    body_sections: serviceEntry.sections,
    faq: serviceEntry.faqs,
    cta_text: serviceEntry.ctaText,
    relatedLinks: serviceEntry.relatedLinks,
    service_slug: serviceEntry.slug,
    service_schema: {
      "@context": "https://schema.org",
      "@type": "Service",
      name: serviceEntry.heroTitle,
      description: serviceEntry.seoDescription,
      url: serviceEntry.canonical,
      areaServed: "Sacramento, CA",
      provider: {
        "@type": "LocalBusiness",
        name: "Drippy Suds Mobile Detailing",
      },
    },
  };

  const bodySections = page.body_sections.filter((s) => !s.heading?.endsWith('?'));
  const sectionFaqs = page.body_sections
    .filter((s) => s.heading?.endsWith('?'))
    .map((s) => ({ question: s.heading, answer: s.content || '' }));

  const bonusSectionsBySlug: Record<string, { heading: string; content: string }[]> = {
    'drippy-diamond-package': drippyDiamondWorthItSections,
    'interior-detail': interiorDetailCleanSections,
    'exterior-wash': exteriorWashHandWashSections,
    'ceramic-coatings': ceramicCoatingWorthItSections,
  };
  const bonusSections = bonusSectionsBySlug[serviceSlug || ''] || [];
  const bonusBodySections: typeof bonusSections = []; // editorial body sections duplicated main sections — removed to fix indexing
  const bonusSectionFaqs = bonusSections
    .filter((s) => s.heading.endsWith('?'))
    .map((s) => ({ question: s.heading, answer: s.content }));

  const _allFaqsRaw = [...sectionFaqs, ...bonusSectionFaqs, ...(page.faq || [])];
  const _seenQ = new Set<string>();
  const allFaqs = _allFaqsRaw.filter((item) => {
    if (_seenQ.has(item.question)) return false;
    _seenQ.add(item.question);
    return true;
  });

  const faqSchema = allFaqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: allFaqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  } : null;

  return (
    <Layout>
      <SEO
        title={page.title_tag || page.h1}
        description={page.meta_description}
        canonical={serviceEntry.canonical}
      />

      <PageHero
        title={page.h1}
        subtitle={serviceHeroDescriptions[page.service_slug] || page.meta_description}
        backgroundImage={serviceHeroImages[page.service_slug] || GALLERY.waxFinish}
        ctaLabel="Book Now"
        ctaHref="/s/appointments"
      />

      <section className="py-16 md:py-24">
        <div className="container max-w-4xl">
          {page.intro_paragraph && (
            <div className="mb-10">
              <h2 className="font-heading text-2xl font-bold text-foreground mb-3">{page.h1}</h2>
              <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {renderLinkedContent(page.intro_paragraph, pagePath)}
              </div>
            </div>
          )}

          {(() => {
            const inlineImages = serviceInlineImages[page.service_slug] || [];
            const altBase = page.h1;
            const nodes: React.ReactNode[] = [];
            bodySections.forEach((section, i) => {
              nodes.push(
                <SectionBlock key={`sec-${i}`} section={section} index={i} pagePath={pagePath}>
                  {i === 0 && (
                    <div className="mt-6 flex flex-col gap-3 border-l-2 border-primary pl-5 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-foreground leading-relaxed">
                        We come to your home, workplace, apartment lot, or wherever the vehicle is parked, so your car gets handled without rearranging your day.
                      </p>
                      <Link
                        to="/s/appointments"
                        className="inline-flex shrink-0 items-center justify-center rounded-none bg-primary px-5 py-3 font-bold text-primary-foreground transition-colors hover:bg-primary/90"
                      >
                        Book Now
                      </Link>
                    </div>
                  )}
                </SectionBlock>
              );
              const slotIdx = IMAGE_SLOTS.indexOf(i);
              if (slotIdx !== -1 && inlineImages[slotIdx]) {
                nodes.push(
                  <InlineGalleryImage
                    key={`img-${i}`}
                    src={inlineImages[slotIdx]}
                    alt={`${altBase} — work sample ${slotIdx + 1}`}
                  />
                );
              }
            });
            return nodes;
          })()}

          {allFaqs.length > 0 && (
            <div className="mb-10">
              <h2 className="font-heading text-2xl font-bold text-foreground mb-6">Frequently Asked Questions</h2>
              <dl className="divide-y divide-border">
                {allFaqs.map((item, i) => (
                  <div key={i} className="py-6">
                    <dt className="text-base font-semibold font-body text-foreground mb-2">{item.question}</dt>
                    <dd className="text-sm text-muted-foreground font-body leading-relaxed">{item.answer}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {((page.relatedLinks && page.relatedLinks.length > 0) || (serviceEntry?.relatedLinks && serviceEntry.relatedLinks.length > 0)) && (
            <div className="mb-10">
              <h2 className="font-heading text-2xl font-bold text-foreground mb-4">We Also Serve</h2>
              <ul className="grid gap-2 sm:grid-cols-2">
                {(page.relatedLinks || serviceEntry?.relatedLinks || []).map((link) => (
                  <li key={`${link.href}-${link.text}`}>
                    <a href={link.href} className="text-primary hover:underline underline-offset-4">
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <a href="/services" className="mb-10 inline-block text-primary hover:underline underline-offset-4">
            View all mobile detailing services
          </a>

          {bonusBodySections.length > 0 && (
            <div className="mb-10 border-y border-border py-10">
              {(() => {
                const inlineImages = serviceInlineImages[page.service_slug] || [];
                const altBase = page.h1;
                const baseIdx = bodySections.length;
                const nodes: React.ReactNode[] = [];
                bonusBodySections.forEach((section, i) => {
                  const continuousIdx = baseIdx + i;
                  nodes.push(
                    <SectionBlock
                      key={`bonus-${i}`}
                      section={section}
                      index={continuousIdx}
                      pagePath={pagePath}
                      asSubheading={i !== 0}
                    />
                  );
                  // Inline image after bonus index 1 (i.e. second bonus section), using slot 2
                  if (i === 1 && inlineImages[2]) {
                    nodes.push(
                      <InlineGalleryImage
                        key={`bonus-img-${i}`}
                        src={inlineImages[2]}
                        alt={`${altBase} — work sample 3`}
                      />
                    );
                  }
                });
                return nodes;
              })()}
            </div>
          )}

          <div className="mb-10 grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-3">Related Services</h2>
              <div className="grid gap-2">
                {relatedServices.filter((service) => service.href !== pagePath).map((service) => (
                  <Link key={service.href} to={service.href} className="text-primary hover:underline underline-offset-4">
                    {service.label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-3">Popular Service Areas</h2>
              <div className="grid gap-2">
                {serviceAreaLinks.map((area) => (
                  <Link key={area.href} to={area.href} className="text-primary hover:underline underline-offset-4">
                    {area.label} mobile detailing
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {page.cta_text && (
            <div className="mt-12 p-8 rounded-none bg-primary/5 border border-primary/20 text-center">
              <p className="text-lg font-medium text-foreground">{page.cta_text}</p>
              <Link
                to="/s/appointments"
                className="inline-block mt-4 bg-primary text-primary-foreground px-6 py-3 rounded-none font-bold hover:bg-primary/90 transition-colors"
              >
                Book Now
              </Link>
            </div>
          )}

          <SeoInjectedLinks pagePath={pagePath} />
          <SeoReviewBlocks pagePath={pagePath} />
          <SeoContentOverrides pagePath={pagePath} />

          <Breadcrumb className="mt-12 pt-8 border-t border-border">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/services">Services</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to={pagePath}>{page.h1}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </section>

    </Layout>
  );
}


