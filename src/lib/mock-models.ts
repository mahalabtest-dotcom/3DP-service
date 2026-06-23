// Mock catalog data — replaced by Supabase queries in Phase 8.
// Shape matches the `models` table in supabase/schema.sql.

export type Color = { id: string; name: string; hex: string };
export type Model = {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  base_print_time_minutes: number;
  available_colors: Color[];
  images: string[];
  glb_file_url: string | null;
};

export const COLORS: Color[] = [
  { id: "c1", name: "Black",  hex: "#1C2B2A" },
  { id: "c2", name: "White",  hex: "#F5F5F5" },
  { id: "c3", name: "Grey",   hex: "#9CA3AF" },
  { id: "c4", name: "Green",   hex: "#4CAF50" },
];

export const MODELS: Model[] = [
  {
    id: "m1",
    title: "Innovation Identity Kit Card",
    description:
      "Kit Card buildable Phone holder with Innovation Identity Kit branding. Designed for quick assembly.",
    category: "Workspace",
    tags: ["kit card", "desk", "phone holder"],
    base_print_time_minutes: 90,
    available_colors: COLORS,
    images: ["/models/kit-card.png"],
    glb_file_url: "/models/Kit-card.glb",
  },
  {
    id: "m2",
    title: "Transmitter Cradle",
    description:
      "Instashow transmitter cradle with DEWA branding.",
    category: "Workspace",
    tags: ["holder", "transmitter", "meeting room"],
    base_print_time_minutes: 240,
    available_colors: COLORS,
    images: ["/models/benq-holder.png"],
    glb_file_url: "/models/benq-holder.glb",
  },
  {
    id: "m3",
    title: "Minimalistic Flag Stand",
    description:
      "Minimalistic flag stand for small desk flags.",
    category: "Workspace",
    tags: ["desk", "flag", "stand", "holder"],
    base_print_time_minutes: 30,
    available_colors: COLORS,
    images: ["/models/flag-stand.png"],
    glb_file_url: "/models/flag-stand.glb",
  },
  {
    id: "m4",
    title: "Desk Organization Set",
    description:
      "Functional desk phone, tablet holders and cable management solutions, designed for sleek integration into any workspace.",
    category: "Workspace",
    tags: ["phone", "holder", , "tablet", "desk", "cable", "organiser"],
    base_print_time_minutes: 120,
    available_colors: COLORS,
    images: ["/models/desk-phone.png"],
    glb_file_url: "/models/desk-phone.glb",
  },
  {
    id: "m5",
    title: "Power Strip Organiser",
    description:
      "Wall-mountable tray that holds a 6-outlet power strip flush to the wall, with a cable exit slot at the rear.",
    category: "Workspace",
    tags: ["power", "cable", "wall", "organiser"],
    base_print_time_minutes: 180,
    available_colors: COLORS,
    images: [],
    glb_file_url: null,
  },
  {
    id: "m6",
    title: "Network Patch Cable Clip",
    description:
      "Stackable clip for grouping Cat5e/Cat6 patch cables at the rear of a network rack. Adhesive base or screw mount.",
    category: "Network",
    tags: ["network", "patch", "cable", "rack"],
    base_print_time_minutes: 60,
    available_colors: COLORS,
    images: [],
    glb_file_url: null,
  },
];

export const CATEGORIES = ["All", ...Array.from(new Set(MODELS.map((m) => m.category))).sort()];

export type PickupLocation = { id: string; name: string };
export const PICKUP_LOCATIONS: PickupLocation[] = [
  { id: "p1", name: "Al Sheraa" },
  { id: "p2", name: "Hudaiba" },
  { id: "p3", name: "Al Quoz" },
  { id: "p4", name: "Al Ruwayyah" },
];

export function formatPrintTime(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h} hr` : `${h} hr ${m} min`;
}

