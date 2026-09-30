import { Cpu, Plane, Shirt, UtensilsCrossed, Leaf, type LucideIcon } from "lucide-react";

export interface Category {
  name: string;
  icon: LucideIcon;
  /** Tailwind classes for the category chip. */
  tone: string;
  image: string;
}

export const CATEGORIES: Category[] = [
  {
    name: "Technology",
    icon: Cpu,
    tone: "bg-sky-100 text-sky-800 dark:bg-sky-500/15 dark:text-sky-300",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=70&auto=format&fit=crop",
  },
  {
    name: "Travel",
    icon: Plane,
    tone: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300",
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=70&auto=format&fit=crop",
  },
  {
    name: "Fashion",
    icon: Shirt,
    tone: "bg-pink-100 text-pink-800 dark:bg-pink-500/15 dark:text-pink-300",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=70&auto=format&fit=crop",
  },
  {
    name: "Food",
    icon: UtensilsCrossed,
    tone: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=70&auto=format&fit=crop",
  },
  {
    name: "Lifestyle",
    icon: Leaf,
    tone: "bg-violet-100 text-violet-800 dark:bg-violet-500/15 dark:text-violet-300",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=70&auto=format&fit=crop",
  },
];

export const CATEGORY_NAMES = CATEGORIES.map((c) => c.name);

export function getCategory(name: string): Category | undefined {
  return CATEGORIES.find((c) => c.name.toLowerCase() === name?.toLowerCase());
}
