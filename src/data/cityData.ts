// City-specific data for landing pages — Dan Keenan strategy: 50%+ unique per page
// Each city has unique headings, local anchors, climate refs, featured services, FAQs, and layout variant

import { GALLERY } from "@/lib/images";

const sedanAfter = GALLERY.compareSedanAfter;
const suvAfter = GALLERY.compareSuvAfter;
const sportsAfter = GALLERY.compareSportsAfter;
const interiorClean = GALLERY.interiorClean;
const ceramicCoating = GALLERY.ceramicCoating;
const premiumWash = GALLERY.premiumWash;
const waxFinish = GALLERY.waxFinish;
const exteriorSuv = GALLERY.exteriorSuv;
const wheelDetail = GALLERY.wheelDetail;
const truckRevive = GALLERY.truckRevive;
const exteriorWhite = GALLERY.exteriorWhite;
const exteriorSedan = GALLERY.exteriorSedan;

export interface CityFAQ {
  question: string;
  answer: string;
}

export interface CityData {
  slug: string;
  name: string;
  h1: string;
  subtitle: string;
  metaTitle: string;
  metaDescription: string;
  // Layout variant (1-4) determines block ordering for uniqueness
  layoutVariant: number;
  // Local anchors — brief, trade-relevant mentions
  localAnchor1: string;
  localAnchor2: string;
  // Climate/architecture hook
  climateHook: string;
  // Featured service tier for this area
  featuredService: string;
  featuredServiceDesc: string;
  // Unique intro paragraph
  introParagraph: string;
  // Accordion SEO content (hidden in UI, visible in DOM)
  accordionContent: string;
  // Gallery images to feature (rotated per city)
  heroImage: string;
  galleryImages: string[];
  // FAQs unique per city
  faqs: CityFAQ[];
  relatedLinks?: { href: string; text: string }[];
}

export const cityData: CityData[] = [
  {
    slug: "sacramento",
    name: "Sacramento",
    h1: "Premium Mobile Detailing in Sacramento",
    subtitle: "Showroom-quality detailing delivered to your driveway in California's capital city.",
    metaTitle: "Mobile Car Detailing in Sacramento | Drippy Suds",
    metaDescription: "Professional mobile car detailing in Sacramento, CA. Ceramic coatings, interior deep cleaning, and exterior restoration. We come to you — book today.",
    layoutVariant: 1,
    localAnchor1: "Serving vehicles throughout Midtown, East Sac, and the Greater Sacramento metro.",
    localAnchor2: "Conveniently located near the Capitol and surrounding business districts for same-day service.",
    climateHook: "Sacramento's intense summer heat and Central Valley dust demand protective ceramic coatings and regular wash maintenance to prevent paint oxidation and brake dust buildup.",
    featuredService: "Ceramic Coating",
    featuredServiceDesc: "Our multi-layer ceramic coating bonds to your paint at the molecular level, providing up to 5 years of UV and heat protection — critical in Sacramento's triple-digit summers.",
    introParagraph: "Drippy Suds brings luxury mobile detailing directly to Sacramento residents and professionals. Whether your vehicle sits in a downtown garage or a Land Park driveway, we deliver showroom results with eco-friendly products and precision craftsmanship.",
    accordionContent: "As Sacramento's trusted mobile detailing provider, we specialize in paint correction, ceramic coating application, and full interior restoration. Our technicians are trained in multi-stage decontamination processes that remove embedded brake dust, tree sap, and iron deposits common in the Central Valley. We use pH-neutral shampoos, clay bar treatments, and dual-action polishers to restore factory-fresh finishes. Every ceramic coating we apply meets 9H hardness ratings and includes a hydrophobic top layer rated for 100+ contact angles. For interior work, we employ hot-water extraction on carpets and seats, UV-safe leather conditioning, and ozone odor elimination. Sacramento fleet managers trust us for scheduled maintenance detailing that keeps company vehicles in client-ready condition year-round.",
    relatedLinks: [
      { href: "/services/ceramic-coatings", text: "Ceramic Coatings in Sacramento" },
      { href: "/services/interior-detail", text: "Interior Detail Only in Sacramento" },
      { href: "/services/drippy-diamond-package", text: "Drippy Diamond Package in Sacramento" },
      { href: "/", text: "Sacramento service areas hub" },
      { href: "/mobile-detailing-elk-grove", text: "Mobile detailing in Elk Grove" },
    ],
    heroImage: sedanAfter,
    galleryImages: [sedanAfter, interiorClean, ceramicCoating, premiumWash],
    faqs: [
      { question: "How long does a full detail take in Sacramento?", answer: "A full interior and exterior detail typically takes 3–5 hours depending on vehicle size. We work on-site at your Sacramento home or office." },
      { question: "Do you offer ceramic coatings in Sacramento?", answer: "Yes. We apply professional-grade ceramic coatings with 9H hardness ratings, ideal for Sacramento's extreme summer heat and UV exposure." },
      { question: "What areas of Sacramento do you serve?", answer: "We cover all Sacramento neighborhoods including Midtown, East Sac, Land Park, Natomas, Pocket, and Arden-Arcade." },
    ],
  },
  {
    slug: "elk-grove",
    name: "Elk Grove",
    h1: "Expert Mobile Auto Detailing in Elk Grove",
    subtitle: "Professional detailing that comes to your Elk Grove home — no drop-off needed.",
    metaTitle: "Mobile Auto Detailing in Elk Grove | Drippy Suds",
    metaDescription: "Top-rated mobile auto detailing in Elk Grove, CA. Interior deep clean, paint correction, and ceramic protection. Book your at-home detail today.",
    layoutVariant: 2,
    localAnchor1: "Providing premium detailing to families near Elk Grove Regional Park and the Laguna community.",
    localAnchor2: "Serving the growing Elk Grove corridor from Highway 99 to Sheldon Road.",
    climateHook: "Elk Grove's suburban streets and tree-lined neighborhoods mean heavy pollen and sap exposure in spring — our clay bar and sealant combos keep your paint protected season after season.",
    featuredService: "Interior Deep Clean",
    featuredServiceDesc: "Family vehicles in Elk Grove see it all — crumbs, pet hair, juice spills. Our hot-water extraction and steam cleaning process restores seats and carpets to like-new condition.",
    introParagraph: "Elk Grove families and commuters deserve detailing that fits their schedule. Drippy Suds arrives at your driveway equipped with everything needed for a full transformation — no water hookup required, no trip to a shop.",
    accordionContent: "Elk Grove's family-oriented community means our most popular services focus on interior restoration. We perform full-spectrum interior details including steam extraction of fabric seats, leather cleaning and UV-protective conditioning, and dashboard restoration using non-greasy, anti-static formulas. For exteriors, we address the heavy tree sap and bird dropping exposure common in Elk Grove's mature neighborhoods with targeted chemical decontamination followed by paint sealant application. Our two-bucket wash method with grit guards prevents swirl marks, and we finish with a carnauba or synthetic sealant rated for 6+ months of protection. We also offer headlight restoration services — critical for older vehicles that have developed yellowed, hazy lenses from UV exposure.",
    relatedLinks: [
      { href: "/services/interior-detail", text: "Interior Detail Only in Elk Grove" },
      { href: "/services/drippy-diamond-package", text: "Drippy Diamond Package in Elk Grove" },
      { href: "/services/exterior-wash", text: "Exterior Wash Only in Elk Grove" },
      { href: "/", text: "Sacramento service areas hub" },
      { href: "/mobile-detailing-sacramento", text: "Mobile detailing in Sacramento" },
    ],
    heroImage: exteriorSuv,
    galleryImages: [exteriorSuv, interiorClean, waxFinish, truckRevive],
    faqs: [
      { question: "Do you come to my house in Elk Grove?", answer: "Absolutely. We're a fully mobile operation — we bring all equipment, water, and supplies directly to your Elk Grove driveway or office parking lot." },
      { question: "How do you handle pet hair removal?", answer: "We use specialized rubber extraction tools and HEPA-filtered vacuums to remove embedded pet hair from seats, carpets, and cargo areas." },
      { question: "What's the best detailing package for family SUVs?", answer: "Our Full Interior + Exterior package is the most popular in Elk Grove. It covers deep extraction cleaning, leather conditioning, exterior wash, clay bar, and sealant." },
    ],
  },
  {
    slug: "rancho-cordova",
    name: "Rancho Cordova",
    h1: "Mobile Detailing Experts Serving Rancho Cordova",
    subtitle: "Precision auto care brought to your Rancho Cordova location.",
    metaTitle: "Mobile Detailing in Rancho Cordova | Drippy Suds",
    metaDescription: "Professional mobile detailing in Rancho Cordova, CA. Paint correction, ceramic coatings, and full interior restoration. We come to you.",
    layoutVariant: 3,
    localAnchor1: "Detailing vehicles near the Rancho Cordova business parks along Sunrise Boulevard.",
    localAnchor2: "Serving commuters and residents from Mather Field to the American River corridor.",
    climateHook: "Rancho Cordova's proximity to open grasslands brings seasonal dust storms that embed fine particulate into your paint's clear coat — regular decontamination washes are essential.",
    featuredService: "Paint Correction",
    featuredServiceDesc: "Our multi-stage paint correction process removes swirl marks, oxidation, and micro-scratches using dual-action polishers and professional-grade cutting compounds.",
    introParagraph: "Rancho Cordova's mix of commercial hubs and residential neighborhoods makes mobile detailing the perfect fit. Drippy Suds works around your schedule — whether that's your office parking lot on Sunrise or your driveway off Zinfandel.",
    accordionContent: "Rancho Cordova vehicles endure significant environmental stress from nearby agricultural dust, freeway commuting, and intense UV exposure. Our paint correction service addresses these challenges through a systematic multi-stage process: first, a thorough decontamination wash to remove bonded surface contaminants; second, clay bar treatment to extract embedded particles; third, machine polishing with progressive-grade compounds (starting at 1500 grit equivalent and finishing at 3000+). We measure paint thickness with a digital gauge before and after to ensure we never compromise clear coat integrity. Post-correction, we recommend our ceramic coating for long-term protection — the hydrophobic layer sheds water, dust, and road grime between maintenance washes. For Rancho Cordova fleet vehicles, we offer volume discount programs with scheduled monthly or bi-weekly service.",
    relatedLinks: [
      { href: "/services/drippy-diamond-package", text: "Drippy Diamond Package in Rancho Cordova" },
      { href: "/services/ceramic-coatings", text: "Ceramic Coatings in Rancho Cordova" },
      { href: "/services/exterior-wash", text: "Exterior Wash Only in Rancho Cordova" },
      { href: "/", text: "Sacramento service areas hub" },
      { href: "/mobile-detailing-carmichael", text: "Mobile detailing in Carmichael" },
    ],
    heroImage: sportsAfter,
    galleryImages: [sportsAfter, ceramicCoating, wheelDetail, premiumWash],
    faqs: [
      { question: "Can you detail my car at my office in Rancho Cordova?", answer: "Yes — we regularly service vehicles at office parks along Sunrise Boulevard, Data Drive, and the Rancho Cordova business corridor." },
      { question: "What is paint correction?", answer: "Paint correction is a machine polishing process that removes swirl marks, light scratches, and oxidation to restore your vehicle's original gloss and clarity." },
      { question: "How often should I get my car detailed in Rancho Cordova?", answer: "We recommend a full detail every 3–4 months and maintenance washes monthly, especially given the dust and heat exposure in the Rancho Cordova area." },
    ],
  },
  {
    slug: "natomas",
    name: "Natomas",
    h1: "Natomas Mobile Car Detailing Services",
    subtitle: "Luxury detailing delivered to North and South Natomas driveways.",
    metaTitle: "Car Detailing in Natomas | Drippy Suds",
    metaDescription: "Mobile car detailing in Natomas, Sacramento. Eco-friendly products, ceramic protection, and interior deep cleaning. Book your appointment.",
    layoutVariant: 4,
    localAnchor1: "Serving the Natomas community near Arena Boulevard and the Sleep Train Arena district.",
    localAnchor2: "Providing convenient at-home detailing for North Natomas families near Inderkum High School.",
    climateHook: "Natomas' flat terrain and wind exposure from the Sacramento River delta scatter fine dust and pollen across vehicles parked outdoors — our sealant packages keep your finish protected.",
    featuredService: "Eco-Friendly Wash & Seal",
    featuredServiceDesc: "Our waterless and low-water wash system uses biodegradable products that lift and encapsulate dirt without runoff — perfect for Natomas HOA communities with water-conscious policies.",
    introParagraph: "Natomas residents live fast — between commutes to downtown Sacramento and weekend errands, who has time for a car wash? Drippy Suds eliminates the trip entirely, bringing professional-grade detailing to your driveway.",
    accordionContent: "Natomas' newer construction and planned communities mean many residents park in driveways or shared lots where traditional detailing isn't practical. Our mobile setup requires zero water hookup — we carry our own water supply and use reclaim mats to capture runoff, meeting all local environmental regulations. Our eco-friendly wash formula is VOC-free and biodegradable, yet powerful enough to break down road film, bug splatter, and brake dust. After washing, we apply a spray sealant with SiO2 technology that creates a slick, hydrophobic barrier lasting 3–4 months. For Natomas clients who want maximum protection, we offer our full ceramic coating package — a two-day process that includes paint correction, surface prep, and multi-layer ceramic application cured under infrared lamps for optimal bond strength.",
    relatedLinks: [
      { href: "/services/exterior-wash", text: "Exterior Wash Only in Natomas" },
      { href: "/services/ceramic-coatings", text: "Ceramic Coatings in Natomas" },
      { href: "/services/drippy-diamond-package", text: "Drippy Diamond Package in Natomas" },
      { href: "/", text: "Sacramento service areas hub" },
      { href: "/mobile-detailing-sacramento", text: "Mobile detailing in Sacramento" },
    ],
    heroImage: premiumWash,
    galleryImages: [premiumWash, exteriorWhite, interiorClean, waxFinish],
    faqs: [
      { question: "Is your detailing process safe for Natomas HOA communities?", answer: "Yes. We use low-water methods with reclaim mats that capture all runoff — fully compliant with Natomas HOA water and environmental guidelines." },
      { question: "Do you use eco-friendly products?", answer: "100%. All our wash solutions are biodegradable, VOC-free, and safe for all surfaces including PPF and vinyl wraps." },
      { question: "Can I book same-day detailing in Natomas?", answer: "Same-day availability depends on our schedule, but we frequently have openings for Natomas clients. Call or book online for real-time availability." },
    ],
  },
  {
    slug: "folsom",
    name: "Folsom",
    h1: "Professional Mobile Detailing in Folsom",
    subtitle: "Concours-level results delivered to your Folsom home or office.",
    metaTitle: "Professional Mobile Detailing in Folsom | Drippy Suds",
    metaDescription: "Expert mobile car detailing in Folsom, CA. Ceramic coatings, paint correction, and premium interior care. Serving Folsom and El Dorado Hills.",
    layoutVariant: 1,
    localAnchor1: "Detailing luxury vehicles near Folsom Lake and the historic Sutter Street district.",
    localAnchor2: "Serving Folsom's Broadstone, Empire Ranch, and El Dorado Hills communities.",
    climateHook: "Folsom's oak-heavy neighborhoods and lakeside proximity mean constant exposure to tree sap, bird droppings, and mineral-rich water spots — our ceramic coatings provide the ultimate defense.",
    featuredService: "Premium Ceramic Coating",
    featuredServiceDesc: "Folsom's luxury vehicle owners choose our premium ceramic coating for its 9H hardness, extreme hydrophobic properties, and 5-year durability against UV, sap, and mineral deposits.",
    introParagraph: "Folsom's car enthusiasts and luxury vehicle owners demand the best. Drippy Suds delivers concours-level detailing with professional-grade products and techniques — right in your driveway, no appointment at a shop required.",
    accordionContent: "Folsom's affluent community has one of the highest concentrations of luxury and performance vehicles in the Sacramento region. Our technicians are experienced with exotic paint systems including multi-stage pearl coats, matte finishes, and carbon fiber trim. We use Rupes polishers with foam pads specifically designed for each paint hardness level — softer pads for Japanese clear coats, firmer compounds for German ceramics. Our ceramic coating process includes a full paint decontamination, single-stage or multi-stage correction as needed, and IPA wipedown before coating application. We apply coatings in controlled conditions using infrared curing to ensure optimal cross-linking. Folsom clients also frequently request our wheel and caliper detailing service, which includes iron decontamination, barrel cleaning, and ceramic coating of wheel faces for easy maintenance.",
    relatedLinks: [
      { href: "/services/ceramic-coatings", text: "Ceramic Coatings in Folsom" },
      { href: "/services/drippy-diamond-package", text: "Drippy Diamond Package in Folsom" },
      { href: "/services/exterior-wash", text: "Exterior Wash Only in Folsom" },
      { href: "/", text: "Sacramento service areas hub" },
      { href: "/mobile-detailing-fair-oaks", text: "Mobile detailing in Fair Oaks" },
    ],
    heroImage: ceramicCoating,
    galleryImages: [ceramicCoating, sportsAfter, wheelDetail, exteriorSedan],
    faqs: [
      { question: "Do you work on luxury and exotic cars in Folsom?", answer: "Absolutely. We regularly detail BMWs, Mercedes, Porsches, Teslas, and exotics. Our technicians are trained in paint-specific correction techniques for each manufacturer." },
      { question: "How long does a ceramic coating last in Folsom?", answer: "Our professional-grade ceramic coatings last 3–5 years with proper maintenance. We include aftercare instructions and offer annual inspections." },
      { question: "Do you serve El Dorado Hills?", answer: "Yes — we serve Folsom, El Dorado Hills, and the surrounding communities including Granite Bay and Orangevale." },
    ],
  },
  {
    slug: "roseville",
    name: "Roseville",
    h1: "Top-Rated Mobile Detailing in Roseville",
    subtitle: "Your Roseville vehicle deserves a professional, at-home detail.",
    metaTitle: "Mobile Car Detailing in Roseville | Drippy Suds",
    metaDescription: "Roseville's trusted mobile detailing service. Paint correction, ceramic coatings, and deep interior cleaning. We come to your home or office.",
    layoutVariant: 2,
    localAnchor1: "Providing mobile detailing near the Westfield Galleria and throughout West Roseville.",
    localAnchor2: "Serving Roseville families from Sun City to Fiddyment Farm and the Blue Oaks corridor.",
    climateHook: "Roseville's new-construction neighborhoods with limited shade mean vehicles bake in direct sun year-round — UV-protective coatings and regular interior conditioning are essential to prevent dashboard cracking and paint fade.",
    featuredService: "Full Interior Restoration",
    featuredServiceDesc: "Roseville's sun-drenched parking lots take a toll on interiors. Our full restoration includes UV-protective leather treatment, steam cleaning, and ozone odor elimination.",
    introParagraph: "From West Roseville's new developments to established neighborhoods near the Galleria, Drippy Suds serves Roseville with premium mobile detailing that saves you time without sacrificing quality.",
    accordionContent: "Roseville has experienced rapid growth, and many newer homes feature three-car garages housing daily drivers, weekend vehicles, and family SUVs. We offer multi-vehicle discounts for Roseville households that book two or more vehicles in a single appointment. Our interior restoration service is particularly popular in Roseville due to the intense UV exposure — we apply ceramic interior coatings to dashboards and door panels that block UV rays and prevent the cracking and fading common in sun-exposed vehicles. For leather seats, we use a pH-balanced cleaner followed by a conditioner containing UV inhibitors that keep leather supple and fade-resistant. Our exterior packages include a thorough wheel and tire detail — we remove brake dust using pH-neutral iron dissolvers, dress tires with a non-sling formula, and coat wheel faces with a spray sealant for easy future cleaning.",
    relatedLinks: [
      { href: "/services/interior-detail", text: "Interior Detail Only in Roseville" },
      { href: "/services/ceramic-coatings", text: "Ceramic Coatings in Roseville" },
      { href: "/services/drippy-diamond-package", text: "Drippy Diamond Package in Roseville" },
      { href: "/", text: "Sacramento service areas hub" },
      { href: "/mobile-detailing-citrus-heights", text: "Mobile detailing in Citrus Heights" },
    ],
    heroImage: truckRevive,
    galleryImages: [truckRevive, interiorClean, exteriorSuv, premiumWash],
    faqs: [
      { question: "Do you offer multi-vehicle discounts in Roseville?", answer: "Yes — book two or more vehicles in the same appointment and receive a discount on each additional vehicle. Perfect for Roseville families with multiple cars." },
      { question: "How do you protect dashboards from sun damage?", answer: "We apply ceramic interior coatings with UV inhibitors that block sun damage and prevent cracking — especially important for Roseville vehicles parked in direct sun." },
      { question: "What areas of Roseville do you cover?", answer: "We serve all Roseville neighborhoods including West Roseville, Sun City, Fiddyment Farm, Blue Oaks, Highland Reserve, and areas near the Galleria." },
    ],
  },
  {
    slug: "citrus-heights",
    name: "Citrus Heights",
    h1: "Citrus Heights Mobile Auto Detailing",
    subtitle: "Bringing professional-grade detailing to Citrus Heights driveways.",
    metaTitle: "Mobile Auto Detailing in Citrus Heights | Drippy Suds",
    metaDescription: "Expert mobile auto detailing in Citrus Heights, CA. Eco-friendly wash, paint protection, and interior deep cleaning. Book your at-home detail.",
    layoutVariant: 3,
    localAnchor1: "Serving Citrus Heights residents near Sunrise Mall and the Arcade Creek corridor.",
    localAnchor2: "Providing convenient detailing from Greenback Lane to Madison Avenue.",
    climateHook: "Citrus Heights' mature oak and citrus trees create a constant battle against sap, pollen, and leaf stains — our decontamination wash is specifically designed to dissolve these organic deposits without damaging paint.",
    featuredService: "Decontamination Wash & Seal",
    featuredServiceDesc: "Our decontamination wash targets the tree sap, pollen, and iron fallout that Citrus Heights vehicles accumulate from tree-lined streets and nearby light-rail corridors.",
    introParagraph: "Citrus Heights' tree-canopied streets are beautiful, but they're tough on your vehicle's paint. Drippy Suds specializes in removing the environmental contamination that comes with parking under mature trees — and we do it all at your home.",
    accordionContent: "Citrus Heights is known for its beautiful tree-lined streets, but those trees deposit sap, pollen, and tannic acid from fallen leaves onto vehicles daily. Our decontamination wash protocol begins with a citrus-based pre-soak that dissolves organic deposits, followed by a foam cannon application that dwells on the surface to lift bonded contaminants. We then hand-wash using the two-bucket method with grit guards and microfiber mitts rated for 800+ GSM. A chemical decontamination spray dissolves iron particles from brake dust and rail dust — common near Citrus Heights' light-rail stops. After clay bar treatment to extract remaining embedded particles, we apply a synthetic paint sealant with UV protection rated for 4–6 months. For clients seeking longer-term protection, we offer our ceramic coating service with a 3-year durability guarantee.",
    relatedLinks: [
      { href: "/services/exterior-wash", text: "Exterior Wash Only in Citrus Heights" },
      { href: "/services/ceramic-coatings", text: "Ceramic Coatings in Citrus Heights" },
      { href: "/services/drippy-diamond-package", text: "Drippy Diamond Package in Citrus Heights" },
      { href: "/", text: "Sacramento service areas hub" },
      { href: "/mobile-detailing-roseville", text: "Mobile detailing in Roseville" },
    ],
    heroImage: waxFinish,
    galleryImages: [waxFinish, sedanAfter, premiumWash, wheelDetail],
    faqs: [
      { question: "How do you remove tree sap from my car in Citrus Heights?", answer: "We use a citrus-based pre-soak and specialized sap remover that dissolves sap without scratching or damaging your clear coat." },
      { question: "What's included in a decontamination wash?", answer: "Pre-soak, foam cannon, hand wash, chemical decontamination (iron/fallout remover), clay bar treatment, and paint sealant application." },
      { question: "Do you serve the Sunrise corridor?", answer: "Yes — we cover all of Citrus Heights including the Sunrise Mall area, Greenback Lane, Auburn Boulevard, and surrounding neighborhoods." },
    ],
  },
  {
    slug: "west-sacramento",
    name: "West Sacramento",
    h1: "West Sacramento's Trusted Mobile Detailing Service",
    subtitle: "Professional detailing for West Sacramento vehicles — at your home or office.",
    metaTitle: "Mobile Detailing in West Sacramento | Drippy Suds",
    metaDescription: "Mobile car detailing in West Sacramento, CA. Paint protection, interior cleaning, and ceramic coatings. Serving the Bridge District and beyond.",
    layoutVariant: 4,
    localAnchor1: "Detailing vehicles in West Sacramento's growing Bridge District and Raley Field area.",
    localAnchor2: "Serving West Sacramento's industrial and residential zones from Jefferson Boulevard to Harbor.",
    climateHook: "West Sacramento's river-adjacent location brings morning fog and moisture that accelerate water spot formation — our spot-free rinse and sealant system prevents mineral etching.",
    featuredService: "Water Spot Removal & Protection",
    featuredServiceDesc: "West Sacramento's river fog leaves mineral deposits that etch into clear coat. Our targeted water spot removal and ceramic sealant prevents future damage.",
    introParagraph: "West Sacramento is booming — and your vehicle shouldn't suffer from the construction dust and river moisture that come with a growing city. Drippy Suds delivers meticulous mobile detailing right to your West Sac location.",
    accordionContent: "West Sacramento's unique geography — situated between the Sacramento River and the Yolo Bypass — creates a microclimate with higher humidity and morning fog than neighboring areas. This moisture deposits mineral-rich water spots on vehicles that, left untreated, etch into the clear coat permanently. Our water spot removal service uses a polishing compound specifically formulated to level the etched surface without removing excessive clear coat, followed by a ceramic spray sealant that creates a hydrophobic barrier. For West Sacramento commercial clients in the industrial districts, we offer fleet detailing packages with weekly or bi-weekly scheduling. Our team handles everything from executive sedans to work trucks, with customizable packages based on vehicle type and usage. We're also experienced with the construction dust and concrete overspray common in West Sacramento's rapidly developing areas.",
    relatedLinks: [
      { href: "/services/exterior-wash", text: "Exterior Wash Only in West Sacramento" },
      { href: "/services/ceramic-coatings", text: "Ceramic Coatings in West Sacramento" },
      { href: "/services/interior-detail", text: "Interior Detail Only in West Sacramento" },
      { href: "/", text: "Sacramento service areas hub" },
      { href: "/mobile-detailing-sacramento", text: "Mobile detailing in Sacramento" },
    ],
    heroImage: exteriorWhite,
    galleryImages: [exteriorWhite, sedanAfter, interiorClean, ceramicCoating],
    faqs: [
      { question: "Can you remove water spots in West Sacramento?", answer: "Yes — our water spot removal service uses targeted polishing compounds to level mineral etchings and restore clarity, followed by a protective sealant." },
      { question: "Do you offer fleet detailing in West Sacramento?", answer: "We offer fleet detailing programs with weekly, bi-weekly, or monthly scheduling for West Sacramento businesses. Volume discounts available." },
      { question: "What parts of West Sacramento do you serve?", answer: "We cover all of West Sacramento including the Bridge District, Southport, Bryte, Broderick, and the industrial areas along Jefferson and Harbor." },
    ],
  },
  {
    slug: "carmichael",
    name: "Carmichael",
    h1: "Premium Car Detailing in Carmichael",
    subtitle: "Luxury mobile detailing tailored for Carmichael's discerning vehicle owners.",
    metaTitle: "Premium Car Detailing in Carmichael | Drippy Suds",
    metaDescription: "Luxury mobile car detailing in Carmichael, CA. Paint correction, ceramic coatings, and full interior restoration. We come to you.",
    layoutVariant: 1,
    localAnchor1: "Providing premium detailing near Ancil Hoffman Park and the American River Parkway.",
    localAnchor2: "Serving Carmichael's established neighborhoods along Fair Oaks Boulevard.",
    climateHook: "Carmichael's riverside location and mature tree canopy create a perfect storm of sap, pollen, and bird deposits — protective coatings and regular maintenance are your best defense.",
    featuredService: "Show Car Detail",
    featuredServiceDesc: "Carmichael's car enthusiasts choose our show car package for its multi-stage paint correction, hand-applied sealant, and obsessive attention to trim, glass, and engine bay details.",
    introParagraph: "Carmichael's quiet, tree-lined streets are home to some of Sacramento's most meticulously maintained vehicles. Drippy Suds matches that standard with concours-level detailing delivered directly to your door.",
    accordionContent: "Carmichael's proximity to the American River Parkway makes it one of the most desirable communities in the Sacramento region — and its residents maintain their vehicles accordingly. Our show car detail is a full-day service that begins with a pre-wash foam bath, contact wash, and iron decontamination. We then perform a multi-stage paint correction using rotary and dual-action polishers with progressively finer pads and compounds. After correction, we wipe down with isopropyl alcohol to reveal the true finish before applying our premium hand-glazed sealant. The interior receives equal attention: we extract and clean all floor mats, steam-clean vents and crevices, condition all leather surfaces, and detail the gauge cluster, steering wheel, and pedals. We finish with tire dressing, exhaust tip polishing, and a final inspection under LED lighting to catch any imperfections.",
    relatedLinks: [
      { href: "/services/drippy-diamond-package", text: "Drippy Diamond Package in Carmichael" },
      { href: "/services/ceramic-coatings", text: "Ceramic Coatings in Carmichael" },
      { href: "/services/interior-detail", text: "Interior Detail Only in Carmichael" },
      { href: "/", text: "Sacramento service areas hub" },
      { href: "/mobile-detailing-fair-oaks", text: "Mobile detailing in Fair Oaks" },
    ],
    heroImage: sportsAfter,
    galleryImages: [sportsAfter, waxFinish, wheelDetail, interiorClean],
    faqs: [
      { question: "What's included in the show car detail in Carmichael?", answer: "Full decontamination wash, multi-stage paint correction, hand-applied sealant, complete interior deep clean, engine bay detail, tire dressing, and LED final inspection." },
      { question: "How long does a show car detail take?", answer: "A full show car detail is a 6–8 hour process. We recommend booking for a full day to achieve the best possible results." },
      { question: "Do you detail near the American River area?", answer: "Yes — we serve all Carmichael neighborhoods including areas near Ancil Hoffman Park, the American River Parkway, and Fair Oaks Boulevard." },
    ],
  },
  {
    slug: "fair-oaks",
    name: "Fair Oaks",
    h1: "Fair Oaks Mobile Detailing Specialists",
    subtitle: "Expert auto detailing brought directly to your Fair Oaks doorstep.",
    metaTitle: "Mobile Detailing Specialists in Fair Oaks | Drippy Suds",
    metaDescription: "Mobile auto detailing in Fair Oaks, CA. Eco-friendly products, ceramic protection, and showroom-quality results. Book your at-home appointment.",
    layoutVariant: 2,
    localAnchor1: "Serving Fair Oaks Village residents and the Sunrise Avenue corridor.",
    localAnchor2: "Detailing vehicles near the Fair Oaks Bluffs and the American River access points.",
    climateHook: "Fair Oaks' rural-suburban setting means vehicles accumulate a unique mix of ranch dust, pollen from native oaks, and river-bottom particulate that requires specialized decontamination.",
    featuredService: "Exterior Restoration",
    featuredServiceDesc: "Neglected paint, oxidized trim, and cloudy headlights — our exterior restoration brings Fair Oaks vehicles back from years of sun and environmental damage.",
    introParagraph: "Fair Oaks blends rural charm with suburban convenience, and Drippy Suds fits right in. We bring our full detailing setup to your property — no water hookup, no shop visit, just professional results.",
    accordionContent: "Fair Oaks' unique character — with its historic village, chicken population, and proximity to the American River — also means unique detailing challenges. Vehicles here face a combination of fine ranch dust from nearby equestrian properties, heavy pollen from mature valley oaks, and mineral deposits from well water. Our exterior restoration service is designed for vehicles that have gone years without proper paint care. We begin with a heavy decontamination wash to strip oxidized wax and embedded grime, followed by wet sanding of severe orange peel or defects (when requested), multi-stage machine polishing, and trim restoration using ceramic trim coating that restores faded black plastics to factory appearance for 2+ years. Headlight restoration includes wet sanding through progressive grits (800–3000) and UV clear coat application to prevent future yellowing. We also offer engine bay detailing — a popular add-on for Fair Oaks truck and SUV owners.",
    relatedLinks: [
      { href: "/services/exterior-wash", text: "Exterior Wash Only in Fair Oaks" },
      { href: "/services/drippy-diamond-package", text: "Drippy Diamond Package in Fair Oaks" },
      { href: "/services/ceramic-coatings", text: "Ceramic Coatings in Fair Oaks" },
      { href: "/", text: "Sacramento service areas hub" },
      { href: "/mobile-detailing-folsom", text: "Mobile detailing in Folsom" },
    ],
    heroImage: truckRevive,
    galleryImages: [truckRevive, exteriorSuv, sedanAfter, premiumWash],
    faqs: [
      { question: "Can you restore faded paint on older vehicles in Fair Oaks?", answer: "Yes — our exterior restoration includes decontamination, paint correction, and trim restoration to bring neglected vehicles back to life." },
      { question: "Do you offer headlight restoration?", answer: "Absolutely. We wet-sand and polish cloudy headlights and apply UV clear coat to prevent future yellowing. Dramatic improvement in nighttime visibility." },
      { question: "Is there a water hookup needed for Fair Oaks service?", answer: "No water hookup needed. We carry our own water supply and reclaim all runoff. Our setup is self-contained and works anywhere." },
    ],
  },
  {
    slug: "arden-arcade",
    name: "Arden-Arcade",
    h1: "Local Mobile Detailing for Arden-Arcade",
    subtitle: "Convenient, professional detailing serving the Arden-Arcade community.",
    metaTitle: "Local Mobile Detailing in Arden-Arcade | Drippy Suds",
    metaDescription: "Professional mobile detailing in Arden-Arcade, Sacramento. Exterior wash, interior deep clean, and paint protection. We come to your location.",
    layoutVariant: 3,
    localAnchor1: "Serving Arden-Arcade vehicle owners near Arden Fair Mall and the Town & Country area.",
    localAnchor2: "Providing at-home detailing throughout the Arden Park and Sierra Oaks neighborhoods.",
    climateHook: "Arden-Arcade's central location means vehicles endure constant freeway commute grime and parking lot exposure — regular detailing maintains both appearance and resale value.",
    featuredService: "Maintenance Detail Package",
    featuredServiceDesc: "For Arden-Arcade daily drivers, our maintenance detail is the smart choice — a thorough wash, interior vacuum and wipe, and quick sealant refresh to keep your vehicle sharp between full details.",
    introParagraph: "Arden-Arcade sits at the crossroads of Sacramento, and vehicles here show it — freeway grime, shopping mall door dings, and sun-baked dashboards. Drippy Suds keeps your ride looking its best with flexible scheduling and at-home convenience.",
    accordionContent: "Arden-Arcade's central location and high-traffic corridors mean vehicles here accumulate road film, brake dust, and industrial fallout faster than in suburban areas. Our maintenance detail package is designed for clients who want to keep their vehicle in top condition without committing to a full detail every time. The service includes a contact wash with pH-neutral shampoo, wheel and tire cleaning, interior vacuum and wipe-down of all surfaces, glass cleaning inside and out, and a spray sealant application to refresh protection. We recommend monthly maintenance details between quarterly full details — this schedule keeps your vehicle's appearance and protection optimal year-round. For Arden-Arcade clients near the Sierra Oaks and Arden Park luxury communities, we also offer our premium packages with paint correction and ceramic coating for vehicles that deserve the highest level of care.",
    relatedLinks: [
      { href: "/services/drippy-diamond-package", text: "Drippy Diamond Package in Arden-Arcade" },
      { href: "/services/interior-detail", text: "Interior Detail Only in Arden-Arcade" },
      { href: "/services/exterior-wash", text: "Exterior Wash Only in Arden-Arcade" },
      { href: "/", text: "Sacramento service areas hub" },
      { href: "/mobile-detailing-sacramento", text: "Mobile detailing in Sacramento" },
    ],
    heroImage: sedanAfter,
    galleryImages: [sedanAfter, premiumWash, exteriorSedan, interiorClean],
    faqs: [
      { question: "What's included in the maintenance detail?", answer: "Exterior hand wash, wheel and tire clean, full interior vacuum and wipe, glass cleaning, and spray sealant application. Takes about 1.5–2 hours." },
      { question: "How often should I get a maintenance detail?", answer: "We recommend monthly maintenance details with a full detail every 3–4 months. This keeps your vehicle protected and looking great year-round." },
      { question: "Do you serve the Arden Park area?", answer: "Yes — we cover all Arden-Arcade neighborhoods including Arden Park, Sierra Oaks, Town & Country Village, and areas near Arden Fair Mall." },
    ],
  },
  {
    slug: "north-highlands",
    name: "North Highlands",
    h1: "Affordable Mobile Detailing in North Highlands",
    subtitle: "Quality mobile detailing at honest prices for North Highlands vehicle owners.",
    metaTitle: "Affordable Mobile Detailing in North Highlands | Drippy Suds",
    metaDescription: "Quality mobile car detailing in North Highlands, CA. Interior deep cleaning, exterior wash, and paint protection at competitive prices. Book today.",
    layoutVariant: 4,
    localAnchor1: "Providing detailing services near McClellan Park and the Watt Avenue corridor.",
    localAnchor2: "Serving North Highlands families from Elkhorn Boulevard to Madison Avenue.",
    climateHook: "North Highlands' open terrain and proximity to McClellan airfield expose vehicles to wind-driven dust and jet exhaust residue — our decontamination process addresses both.",
    featuredService: "Value Detail Package",
    featuredServiceDesc: "Professional results at a fair price — our value package includes a thorough exterior wash, interior vacuum and cleaning, and paint sealant application.",
    introParagraph: "North Highlands vehicle owners want quality without the markup. Drippy Suds delivers the same professional-grade products and techniques we use across Sacramento — at honest, transparent prices, right at your front door.",
    accordionContent: "North Highlands' working community needs reliable, affordable vehicle care. Our value detail package delivers professional results without unnecessary upselling. The exterior includes a pre-rinse, foam cannon application, two-bucket hand wash, tire and wheel cleaning, and a synthetic sealant that provides 3+ months of protection. The interior covers thorough vacuuming of seats, carpets, and trunk, dashboard and console wipe-down with UV protectant, door jamb cleaning, and glass cleaning inside and out. For vehicles that need deeper attention, we offer add-on services including pet hair removal, odor treatment with ozone, stain extraction, headlight restoration, and engine bay cleaning — each priced individually so you only pay for what you need. We also offer a military and first responder discount for North Highlands residents connected to McClellan Park and the nearby military community.",
    relatedLinks: [
      { href: "/services/interior-detail", text: "Interior Detail Only in North Highlands" },
      { href: "/services/exterior-wash", text: "Exterior Wash Only in North Highlands" },
      { href: "/services/drippy-diamond-package", text: "Drippy Diamond Package in North Highlands" },
      { href: "/", text: "Sacramento service areas hub" },
      { href: "/mobile-detailing-citrus-heights", text: "Mobile detailing in Citrus Heights" },
    ],
    heroImage: exteriorSedan,
    galleryImages: [exteriorSedan, truckRevive, interiorClean, waxFinish],
    faqs: [
      { question: "Do you offer military discounts in North Highlands?", answer: "Yes — we offer a military and first responder discount for all service packages. Just mention it when booking." },
      { question: "What's your most affordable detailing option?", answer: "Our value detail package includes a full exterior wash with sealant and interior cleaning — professional results at an honest price point." },
      { question: "Can I add services individually?", answer: "Absolutely. We offer à la carte add-ons including pet hair removal, odor treatment, stain extraction, headlight restoration, and engine bay cleaning." },
    ],
  },
  // AI_CITY_ANCHOR
];

export function getCityBySlug(slug: string): CityData | undefined {
  return cityData.find((c) => c.slug === slug);
}
