import type { Room, TourHotspot } from "../types";

export function makeRooms(bedrooms: number): Room[] {
  const rooms: Room[] = [
    { name: "Living Room", w: 6, d: 5, x: -3, z: -3 },
    { name: "Kitchen", w: 4, d: 4, x: 4, z: -3 },
  ];

  const beds = Math.max(1, Math.min(bedrooms, 5));
  for (let i = 0; i < beds; i += 1) {
    rooms.push({
      name: beds === 1 ? "Bedroom" : `Bedroom ${i + 1}`,
      w: 4,
      d: 4,
      x: -4 + i * 4.5,
      z: 4,
    });
  }
  rooms.push({ name: "Bathroom", w: 2.5, d: 3, x: -4 + beds * 4.5, z: 4 });
  rooms.push({ name: "Balcony", w: 6, d: 2, x: -3, z: -7 });
  return rooms;
}

export function makeHotspots(panoramaCount: number): TourHotspot[] {
  if (panoramaCount < 1) return [];
  const spots: TourHotspot[] = [
    { panoramaIndex: 0, label: "Living Area", yaw: 0, pitch: 0 },
  ];
  if (panoramaCount > 1) {
    spots.push({ panoramaIndex: 0, label: "Go to Bedroom", yaw: 90, pitch: 0, target: 1 });
    spots.push({ panoramaIndex: 1, label: "Back to Living", yaw: -90, pitch: 0, target: 0 });
  }
  return spots;
}

const img = (id: string, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

const pano = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=4096&q=80`;

interface SeedProperty {
  slug: string;
  title: string;
  description: string;
  price: number;
  listingType: "sale" | "rent";
  propertyType: "apartment" | "villa" | "plot" | "commercial" | "penthouse";
  status?: "available" | "under_offer" | "sold";
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    lat: number;
    lng: number;
  };
  bedrooms: number;
  bathrooms: number;
  areaSqft: number;
  yearBuilt?: number;
  amenities: string[];
  images: string[];
  model3dUrl?: string;
  panoramaUrls: string[];
  agent: { name: string; phone: string; email: string; avatarUrl?: string };
  featured?: boolean;
  rating?: number;
}

const AGENTS = [
  {
    name: "Aarav Mehta",
    phone: "+91 99999 11111",
    email: "agent@grovyn.in",
    avatarUrl: img("1535713875002-d1d0cf377fde", 256),
  },
  {
    name: "Diya Kapoor",
    phone: "+91 99999 22222",
    email: "diya@grovyn.in",
    avatarUrl: img("1438761681033-6461ffad8d80", 256),
  },
];

export const SEED_PROPERTIES: SeedProperty[] = [
  {
    slug: "sky-veil-penthouse-worli",
    title: "Sky Veil Penthouse, Worli Sea Face",
    description:
      "A duplex penthouse crowning a Worli tower with 270° Arabian Sea views, a private infinity pool, and a double-height living gallery wrapped in floor-to-ceiling glass.",
    price: 285000000,
    listingType: "sale",
    propertyType: "penthouse",
    location: {
      address: "Worli Sea Face, Worli",
      city: "Mumbai",
      state: "Maharashtra",
      country: "India",
      lat: 19.0176,
      lng: 72.8156,
    },
    bedrooms: 4,
    bathrooms: 5,
    areaSqft: 6200,
    yearBuilt: 2022,
    amenities: ["Infinity Pool", "Smart Home", "Private Elevator", "Sea View", "Concierge", "Gym"],
    images: [img("1512917774080-9991f1c4c750"), img("1502672260266-1c1ef2d93688"), img("1493809842364-78817add7ffb")],
    panoramaUrls: [pano("1600596542815-ffad4c1539a9"), pano("1600585154340-be6161a56a0c")],
    agent: AGENTS[0],
    featured: true,
    rating: 4.9,
  },
  {
    slug: "azure-bay-apartment-bandra",
    title: "Azure Bay 3BHK, Bandra West",
    description:
      "Light-filled sea-facing apartment minutes from Carter Road, with an open-plan kitchen, smart climate control, and a wide sit-out balcony over the bay.",
    price: 84000000,
    listingType: "sale",
    propertyType: "apartment",
    location: {
      address: "Carter Road, Bandra West",
      city: "Mumbai",
      state: "Maharashtra",
      country: "India",
      lat: 19.0509,
      lng: 72.8206,
    },
    bedrooms: 3,
    bathrooms: 3,
    areaSqft: 1850,
    yearBuilt: 2019,
    amenities: ["Sea View", "Gym", "Clubhouse", "Covered Parking", "Smart Home"],
    images: [img("1502005229762-cf1b2da7c5d6"), img("1560448204-e02f11c3d0e2"), img("1560185007-cde436f6a4d0")],
    panoramaUrls: [pano("1600210492493-0946911123ea")],
    agent: AGENTS[1],
    featured: true,
    rating: 4.6,
  },
  {
    slug: "verdant-villa-koramangala",
    title: "Verdant Villa, Koramangala",
    description:
      "A biophilic four-bedroom villa with a courtyard garden, rooftop deck, and a home office pod — built for Bengaluru's work-from-anywhere set.",
    price: 96000000,
    listingType: "sale",
    propertyType: "villa",
    location: {
      address: "5th Block, Koramangala",
      city: "Bengaluru",
      state: "Karnataka",
      country: "India",
      lat: 12.9352,
      lng: 77.6245,
    },
    bedrooms: 4,
    bathrooms: 4,
    areaSqft: 4200,
    yearBuilt: 2021,
    amenities: ["Garden", "Rooftop Deck", "Home Office", "Solar Power", "EV Charging", "Smart Home"],
    images: [img("1600585154340-be6161a56a0c"), img("1600566753086-00f18fb6b3ea"), img("1600607687939-ce8a6c25118c")],
    panoramaUrls: [pano("1600573472550-8090b5e0745e"), pano("1600566752355-35792bedcfea")],
    agent: AGENTS[0],
    featured: true,
    rating: 4.8,
  },
  {
    slug: "indigo-loft-indiranagar",
    title: "Indigo Loft 2BHK, Indiranagar",
    description:
      "A characterful double-height loft on 100ft Road with exposed concrete, a mezzanine studio, and walkable access to Bengaluru's best cafés.",
    price: 145000,
    listingType: "rent",
    propertyType: "apartment",
    location: {
      address: "100 Feet Road, Indiranagar",
      city: "Bengaluru",
      state: "Karnataka",
      country: "India",
      lat: 12.9719,
      lng: 77.6412,
    },
    bedrooms: 2,
    bathrooms: 2,
    areaSqft: 1450,
    yearBuilt: 2018,
    amenities: ["Mezzanine", "Power Backup", "Gym", "Pet Friendly"],
    images: [img("1502672023488-70e25813eb80"), img("1505691938895-1758d7feb511"), img("1522708323590-d24dbb6b0267")],
    panoramaUrls: [pano("1600121848594-d8644e57abab")],
    agent: AGENTS[1],
    rating: 4.4,
  },
  {
    slug: "tidewater-villa-assagao",
    title: "Tidewater Villa, Assagao",
    description:
      "A Portuguese-Goan villa restored with terrazzo floors and laterite walls, set around a saltwater pool in the leafy lanes of Assagao.",
    price: 132000000,
    listingType: "sale",
    propertyType: "villa",
    location: {
      address: "Assagao, Bardez",
      city: "Goa",
      state: "Goa",
      country: "India",
      lat: 15.6011,
      lng: 73.7649,
    },
    bedrooms: 5,
    bathrooms: 5,
    areaSqft: 5400,
    yearBuilt: 2020,
    amenities: ["Saltwater Pool", "Garden", "Outdoor Kitchen", "Staff Quarters", "Solar Power"],
    images: [img("1613490493576-7fde63acd811"), img("1600047509807-ba8f99d2cdde"), img("1600566753190-17f0baa2a6c3")],
    panoramaUrls: [pano("1600585152915-d208bec867a1"), pano("1600585154526-990dced4db0d")],
    agent: AGENTS[0],
    featured: true,
    rating: 4.9,
  },
  {
    slug: "palm-haven-apartment-panaji",
    title: "Palm Haven 2BHK, Panaji",
    description:
      "A breezy riverfront apartment overlooking the Mandovi, with a wraparound balcony, modular kitchen, and a community pool deck.",
    price: 62000,
    listingType: "rent",
    propertyType: "apartment",
    location: {
      address: "Dr. Dada Vaidya Road, Panaji",
      city: "Goa",
      state: "Goa",
      country: "India",
      lat: 15.4989,
      lng: 73.8278,
    },
    bedrooms: 2,
    bathrooms: 2,
    areaSqft: 1250,
    yearBuilt: 2017,
    amenities: ["River View", "Pool", "Covered Parking", "Power Backup"],
    images: [img("1493809842364-78817add7ffb"), img("1567496898669-ee935f5f647a"), img("1565182999561-18d7dc61c393")],
    panoramaUrls: [pano("1600210491369-e753d80a41f3")],
    agent: AGENTS[1],
    rating: 4.3,
  },
  {
    slug: "aurelia-penthouse-golf-course-road",
    title: "Aurelia Penthouse, Golf Course Road",
    description:
      "A sky penthouse on Gurugram's Golf Course Road with a private terrace lawn, home theatre, and concierge — wrapped in smart-glass façade.",
    price: 198000000,
    listingType: "sale",
    propertyType: "penthouse",
    location: {
      address: "Golf Course Road, Sector 42",
      city: "Gurugram",
      state: "Haryana",
      country: "India",
      lat: 28.4499,
      lng: 77.1003,
    },
    bedrooms: 4,
    bathrooms: 5,
    areaSqft: 5800,
    yearBuilt: 2023,
    amenities: ["Private Terrace", "Home Theatre", "Concierge", "Smart Home", "Gym", "Valet"],
    images: [img("1600566753086-00f18fb6b3ea"), img("1600596542815-ffad4c1539a9"), img("1600607687920-4e2a09cf159d")],
    panoramaUrls: [pano("1600566753376-12c8ab7fb75b"), pano("1600585154084-4e5fe7c39198")],
    agent: AGENTS[0],
    featured: true,
    rating: 4.7,
  },
  {
    slug: "meridian-apartment-dlf-phase-2",
    title: "Meridian 3BHK, DLF Phase 2",
    description:
      "A family apartment in a gated DLF community with landscaped greens, a kids' zone, and a clubhouse — close to Cyber Hub.",
    price: 38000000,
    listingType: "sale",
    propertyType: "apartment",
    location: {
      address: "DLF Phase 2, Sector 25",
      city: "Gurugram",
      state: "Haryana",
      country: "India",
      lat: 28.4817,
      lng: 77.0901,
    },
    bedrooms: 3,
    bathrooms: 3,
    areaSqft: 2100,
    yearBuilt: 2016,
    amenities: ["Clubhouse", "Kids Play Area", "Gym", "Covered Parking", "24x7 Security"],
    images: [img("1560448204-603b3fc33ddc"), img("1560185008-a33f5c7b1844"), img("1560185007-c5ca9d2c014d")],
    panoramaUrls: [pano("1600121848594-d8644e57abab")],
    agent: AGENTS[1],
    rating: 4.2,
  },
  {
    slug: "cyber-spire-commercial-cyber-city",
    title: "Cyber Spire Office Floor, Cyber City",
    description:
      "A full-floor grade-A office plate in Cyber City with raised flooring, double-height lobby, and 4-side glazing — plug-and-play for a flagship HQ.",
    price: 240000000,
    listingType: "sale",
    propertyType: "commercial",
    location: {
      address: "DLF Cyber City, Phase 3",
      city: "Gurugram",
      state: "Haryana",
      country: "India",
      lat: 28.4945,
      lng: 77.0883,
    },
    bedrooms: 0,
    bathrooms: 6,
    areaSqft: 18000,
    yearBuilt: 2021,
    amenities: ["Grade-A", "Raised Flooring", "Backup Power", "Metro Access", "Cafeteria", "Valet"],
    images: [img("1497366216548-37526070297c"), img("1497366811353-6870744d04b2"), img("1524758631624-e2822e304c36")],
    panoramaUrls: [pano("1600585154340-be6161a56a0c")],
    agent: AGENTS[0],
    rating: 4.5,
  },
  {
    slug: "emerald-acres-plot-whitefield",
    title: "Emerald Acres Plot, Whitefield",
    description:
      "A clear-title, gated residential plot in Whitefield with underground utilities, tree-lined avenues, and BBMP approvals — ready to build your dream home.",
    price: 21000000,
    listingType: "sale",
    propertyType: "plot",
    location: {
      address: "Whitefield Main Road",
      city: "Bengaluru",
      state: "Karnataka",
      country: "India",
      lat: 12.9698,
      lng: 77.7499,
    },
    bedrooms: 0,
    bathrooms: 0,
    areaSqft: 2400,
    amenities: ["Gated Layout", "Underground Utilities", "Park", "Clear Title", "24x7 Security"],
    images: [img("1500382017468-9049fed747ef"), img("1542889601-399c4f3a8402"), img("1416879595882-3373a0480b5b")],
    panoramaUrls: [],
    agent: AGENTS[1],
    rating: 4.1,
  },
];
