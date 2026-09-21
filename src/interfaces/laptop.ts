// src/interfaces/laptop.ts
export interface Laptop {
  id: string;
  brand: string;
  model: string;
  processor: string;
  ram: string;
  storage: string;
  price: number;
  imageUrl?: string;
  description?: string;
}