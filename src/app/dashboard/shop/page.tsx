"use client";

import { useState } from "react";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Badge } from "@/components/Badge";

const items = [
  { id: 1, name: "Katana", price: 5000, category: "Melee" },
  { id: 2, name: "Tanto", price: 2500, category: "Melee" },
  { id: 3, name: "Shuriken", price: 500, category: "Throwable" },
  { id: 4, name: "Yari", price: 4000, category: "Polearm" },
  { id: 5, name: "Naginata", price: 4500, category: "Polearm" },
  { id: 6, name: "Kusarigama", price: 3500, category: "Chain" },
];

function WeaponPlaceholder() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-crimson-dark/20 to-bg-secondary">
      <svg
        className="h-20 w-20 text-crimson/30"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 2L9 21l3 1 3-1z" />
      </svg>
    </div>
  );
}

export default function ShopPage() {
  const [cart, setCart] = useState<number[]>([]);

  const addToCart = (id: number) => {
    setCart([...cart, id]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white-soft">Toko Senjata</h2>
        <div className="flex items-center gap-3 rounded-full border border-border bg-surface-glass px-4 py-2">
          <svg
            className="h-5 w-5 text-gray-muted"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <span className="font-medium text-white-soft">{cart.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Card key={item.id} className="flex flex-col p-4" hoverEffect>
            <div className="mb-4 h-40 overflow-hidden rounded-xl">
              <WeaponPlaceholder />
            </div>
            <div className="flex-1">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-lg font-bold text-white-soft">{item.name}</h3>
                <Badge variant="crimson">{item.category}</Badge>
              </div>
              <p className="mb-4 text-xl font-bold text-gold">
                ${item.price.toLocaleString()}
              </p>
            </div>
            <Button onClick={() => addToCart(item.id)} className="w-full">
              Beli
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
