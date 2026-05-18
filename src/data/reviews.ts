export interface Review {
  id: string;
  name: string;
  location: string;
  review: string;
  rating: number;
  created_at: string;
  avatar_url: string | null;
  initials: string;
  is_featured: boolean;
}

export const reviews: Review[] = [
  {
    id: "5e3a9450-693f-40d3-9dc0-91c8a7a55b72",
    name: "Prab",
    location: "San Francisco, CA",
    review: "Couldn't have asked for a better service. I needed someone same day because I was headed out of town — everyone else was booked. Harvey's schedule was full too, but when his last appointment canceled he reached out and said he'd come at 5PM. He spent 3 hours at night in the cold removing every single piece of my white dog's hair, got rid of a stain in the backseat I thought was permanent. I left on time the next day with a fresh-looking car for my parents. Definitely recommend!",
    rating: 5,
    created_at: "2026-01-03T00:00:00+00:00",
    avatar_url: null,
    initials: "P",
    is_featured: true,
  },
  {
    id: "f18325a1-f455-44a5-a1ec-4dc76f80b6de",
    name: "Jen B.",
    location: "Sacramento, CA",
    review: "Harv is incredible. I love my car and he took amazing care to get her looking young and fresh again. The details and time he took — highly recommend!",
    rating: 5,
    created_at: "2026-03-26T00:00:00+00:00",
    avatar_url: "https://romwqrkybfkaoklrauuk.supabase.co/storage/v1/object/public/site-images/reviews/jen-b.jpg",
    initials: "JB",
    is_featured: false,
  },
  {
    id: "23f01ec5-1ca0-4189-9131-a1f4f9c0027a",
    name: "Debbie T.",
    location: "River Park, Sacramento",
    review: "Tried to think outside of the box for my husband's birthday. Why not get his truck detailed? Found Harvey on Yelp and he came over and meticulously cleaned the whole thing. Now we both are glad to ride in that truck!",
    rating: 5,
    created_at: "2026-01-13T00:00:00+00:00",
    avatar_url: null,
    initials: "DT",
    is_featured: false,
  },
  {
    id: "915ff383-18ab-4f4f-8439-7793ad16ef1f",
    name: "Alexia C.",
    location: "Sacramento, CA",
    review: "Can't say enough good things. I reached out on short notice and he still made it happen. Very polite, professional, easy to talk to. My car was completely detailed inside and out in under 4 hours. The attention to detail really showed — my car looks amazing and feels brand new.",
    rating: 5,
    created_at: "2026-01-09T00:00:00+00:00",
    avatar_url: null,
    initials: "AC",
    is_featured: false,
  },
  {
    id: "c66b7745-de42-4918-8769-30b8731d29d5",
    name: "Elizabeth R.",
    location: "Elk Grove, CA",
    review: "Harvey is a very professional young man who knows how to clean vehicles. I got the full service on one car and had to get the other done too! If you want your vehicle to shine like new money, don't hesitate. I never write reviews but I MUST give him my first.",
    rating: 5,
    created_at: "2026-01-07T00:00:00+00:00",
    avatar_url: null,
    initials: "ER",
    is_featured: false,
  },
  {
    id: "5e137098-8469-45b4-a446-0bca646feb4b",
    name: "jennie T.",
    location: "Sacramento, CA",
    review: "We asked him to detail our two cars — a WRX and a CLK 63 AMG. He worked about 8 hours straight. My 2006 hasn't looked this good since I bought it, and the STI looked like a showroom star. Best detail expert I've seen to date.",
    rating: 5,
    created_at: "2025-12-12T00:00:00+00:00",
    avatar_url: "https://romwqrkybfkaoklrauuk.supabase.co/storage/v1/object/public/site-images/reviews/jennie-t.jpg",
    initials: "JT",
    is_featured: false,
  },
];
