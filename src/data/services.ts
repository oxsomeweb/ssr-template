export interface FeatureGroup {
  label: string;
  items: string[];
}

export interface Service {
  id: string;
  title: string;
  description: string;
  price_label: string;
  duration: string;
  note: string;
  feature_groups: FeatureGroup[];
  sort_order: number;
}

export const services: Service[] = [
  {
    id: "0e5180f5-f360-4dbf-b06b-d3a400dab959",
    title: "Interior Detail Only",
    description: "Our Interior Detail service delivers professional-grade results, leaving your vehicle's interior spotless and refreshed, from heavily soiled to like-new condition. Perfect for maintaining a long-lasting clean, this service is tailored to meet your individual needs by appointment.",
    price_label: "Price varies",
    duration: "2 hr",
    note: "Please check out our add ons for any additional services you like to add to this service.",
    feature_groups: [],
    sort_order: 1,
  },
  {
    id: "a3224e41-2591-402d-aec9-f434616d079c",
    title: "Exterior Wash Only",
    description: "Our Exterior Wash Only service ensures your vehicle's exterior is thoroughly cleaned and restored to a fresh, like-new appearance, regardless of light or heavy soil. Book your appointment today for a spotless finish tailored to your schedule.",
    price_label: "Price varies",
    duration: "1 hr+",
    note: "Please check out our add ons for any additional services you like to add to this service.",
    feature_groups: [],
    sort_order: 2,
  },
  {
    id: "8eb60fa4-658d-4ab2-a5d5-c964babf3a71",
    title: "Drippy Diamond Package",
    description: "The ultimate head-to-toe detail — interior deep clean, exterior polish, ceramic sealant, and tire dressing for a showroom-worthy finish.",
    price_label: "Price varies",
    duration: "2 hr",
    note: "Please check out our add ons for any additional services you like to add to this service.",
    feature_groups: [
      {
        label: "Interior:",
        items: [
          "Detailed vacuum",
          "Protect & shine all leather & plastics",
          "Streak-free windows & mirrors clean all door jams",
        ],
      },
      {
        label: "Exterior:",
        items: [
          "Premium wash & wax car shampoo",
          "Professional hand wash",
          "Thoroughly clean rims & tires",
          "High-gloss tire dressing",
        ],
      },
    ],
    sort_order: 3,
  },
  {
    id: "4b4a60e4-f5ae-4cde-9a8e-4471187429ec",
    title: "Ceramic Coatings",
    description: "Professional-grade ceramic coating applied by certified technicians. We prep your paint to perfection before bonding a nano-ceramic layer that delivers unmatched gloss, protection, and durability — keeping your vehicle looking showroom-new for years.",
    price_label: "Price varies",
    duration: "2 hr+",
    note: "",
    feature_groups: [
      {
        label: "Coating Options",
        items: [
          "3-4 Year Ceramic Coating — ideal for daily drivers",
          "5-10 Year Ceramic Coating — maximum long-term protection",
        ],
      },
      {
        label: "Protection & Benefits",
        items: [
          "Extreme hydrophobic water beading & sheeting",
          "UV protection to prevent paint oxidation & fading",
          "Chemical resistance against bird droppings, tree sap & road salt",
          "High-gloss, mirror-like finish that lasts for years",
        ],
      },
    ],
    sort_order: 4,
  },
];
