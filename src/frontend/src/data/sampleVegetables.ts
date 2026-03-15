import type { Vegetable } from "../backend.d";

// Sample vegetables for display when backend is loading or unavailable
export const SAMPLE_VEGETABLES: Omit<Vegetable, "id" | "image">[] = [
  {
    name: "Baby Spinach",
    description:
      "Tender, young spinach leaves bursting with iron and vitamins. Perfect for salads, smoothies, or quick sautés.",
    category: "Leafy Greens",
    price: 3.49,
    stockAvailable: true,
  },
  {
    name: "Organic Carrots",
    description:
      "Sweet, crunchy carrots grown in mineral-rich soil. Great for snacking, roasting, or blending into soups.",
    category: "Root Vegetables",
    price: 2.99,
    stockAvailable: true,
  },
  {
    name: "Vine Tomatoes",
    description:
      "Sun-ripened tomatoes picked fresh from the vine. Rich, complex flavour ideal for sauces, salads, and bruschetta.",
    category: "Fruiting Vegetables",
    price: 4.29,
    stockAvailable: true,
  },
  {
    name: "Tender-Stem Broccoli",
    description:
      "Premium long-stemmed broccoli with delicate florets. Sweeter than standard broccoli, delicious steamed or stir-fried.",
    category: "Brassicas",
    price: 3.79,
    stockAvailable: true,
  },
  {
    name: "Red Bell Pepper",
    description:
      "Thick-walled, juicy red peppers with a sweet, fruity flavour. High in vitamin C and gorgeous in roasted dishes.",
    category: "Fruiting Vegetables",
    price: 1.89,
    stockAvailable: true,
  },
  {
    name: "Curly Kale",
    description:
      "Robust, nutritionally dense kale with a pleasantly peppery bite. Excellent for chips, soups, and green smoothies.",
    category: "Leafy Greens",
    price: 2.49,
    stockAvailable: true,
  },
  {
    name: "Sweet Potatoes",
    description:
      "Creamy, naturally sweet potatoes with vibrant orange flesh. Packed with beta-carotene, perfect roasted or mashed.",
    category: "Root Vegetables",
    price: 3.19,
    stockAvailable: false,
  },
  {
    name: "Mini Cucumbers",
    description:
      "Crisp, seedless mini cucumbers with thin skin. Refreshingly cool in salads or served with dips and hummus.",
    category: "Fruiting Vegetables",
    price: 2.79,
    stockAvailable: true,
  },
];

export const VEGETABLE_IMAGES: Record<string, string> = {
  "Baby Spinach": "/assets/generated/spinach.dim_400x400.jpg",
  "Organic Carrots": "/assets/generated/carrots.dim_400x400.jpg",
  "Vine Tomatoes": "/assets/generated/tomatoes.dim_400x400.jpg",
  "Tender-Stem Broccoli": "/assets/generated/broccoli.dim_400x400.jpg",
  "Red Bell Pepper": "/assets/generated/bell-pepper.dim_400x400.jpg",
  "Curly Kale": "/assets/generated/kale.dim_400x400.jpg",
  "Sweet Potatoes": "/assets/generated/sweet-potato.dim_400x400.jpg",
  "Mini Cucumbers": "/assets/generated/cucumber.dim_400x400.jpg",
};

export const CATEGORIES = [
  "All",
  "Leafy Greens",
  "Root Vegetables",
  "Fruiting Vegetables",
  "Brassicas",
];

export const CATEGORY_COLORS: Record<string, string> = {
  "Leafy Greens": "bg-emerald-100 text-emerald-800",
  "Root Vegetables": "bg-amber-100 text-amber-800",
  "Fruiting Vegetables": "bg-red-100 text-red-800",
  Brassicas: "bg-lime-100 text-lime-800",
};
