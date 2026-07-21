"use client";

import { useState } from "react";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";

const items = [
  { id: 1, name: "Katana", price: 5000, category: "Melee", image: "https://coresg-normal.trae.ai/api/v1/text_to_image?prompt=Japanese%20katana%20samurai%20sword&image_size=square" },
  { id: 2, name: "Tanto", price: 2500, category: "Melee", image: "https://coresg-normal.trae.ai/api/v1/text_to_image?prompt=Japanese%20tanto%20short%20sword&image_size=square" },
  { id: 3, name: "Shuriken", price: 500, category: "Throwable", image: "https://coresg-normal.trae.ai/api/v1/text_to_image?prompt=Japanese%20shuriken%20throwing%20stars&image_size=square" },
  { id: 4, name: "Yari", price: 4000, category: "Polearm", image: "https://coresg-normal.trae.ai/api/v1/text_to_image?prompt=Japanese%20yari%20spear&image_size=square" },
  { id: 5, name: "Naginata", price: 4500, category: "Polearm", image: "https://coresg-normal.trae.ai/api/v1/text_to_image?prompt=Japanese%20naginata%20pole%20sword&image_size=square" },
  { id: 6, name: "Kusarigama", price: 3500, category: "Chain", image: "https://coresg-normal.trae.ai/api/v1/text_to_image?prompt=Japanese%20kusarigama%20chain%20sickle&image_size=square" },
];

export default function ShopPage() {
  const [cart, setCart] = useState<number[]>([]);

  const addToCart = (id: number) => {
    setCart([...cart, id]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white-soft">Toko Senjata</h2>
        <div className="flex items-center gap-3 bg-surface-glass px-4 py-2 rounded-full border border-border">
          <svg className="w-5 h-5 text-gray-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span className="text-white-soft font-medium">{cart.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <Card key={item.id} className="p-4 flex flex-col">
            <div className="h-40 bg-bg-secondary rounded-xl mb-4 overflow-hidden flex items-center justify-center">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-white-soft">{item.name}</h3>
                <span className="px-2 py-1 rounded-full text-xs font-semibold bg-crimson/20 text-crimson">
                  {item.category}
                </span>
              </div>
              <p className="text-gold text-xl font-bold mb-4">${item.price.toLocaleString()}</p>
            </div>
            <Button onClick={() => addToCart(item.id)} className="w-full">Beli</Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
