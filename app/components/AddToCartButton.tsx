"use client";

import { useState } from "react";

import { useCart } from "@/app/context/cart";

type AddToCartButtonProps = {
  product: {
    id: string;
    slug: string;
    name: string;
    price: number;
    imageUrl: string;
  };
};

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = () => {
    setIsAdding(true);
    addItem(product);
    setTimeout(() => setIsAdding(false), 400);
  };

  return (
    <button
      type="button"
      onClick={handleAdd}
      className="inline-flex w-fit items-center justify-center rounded-full bg-emerald-900 px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-70"
      disabled={isAdding}
    >
      {isAdding ? "Se adaugă..." : "Adaugă în coș"}
    </button>
  );
}

