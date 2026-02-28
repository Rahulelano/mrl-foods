export interface Product {
  _id?: string;
  id?: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  weight: string;
  badge?: string;
  rating?: number;
  reviews?: number;
}

export const categories = [
  "All",
  "Millet Noodles",
  "Rice & Grains",
  "Honey & Sweeteners",
  "Spices & Masalas",
  "Pasta",
  "Ready to Cook",
  "Healthy Snacks",
  "Spreads"
];
