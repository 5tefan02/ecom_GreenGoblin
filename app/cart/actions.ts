"use server";

import { redirect } from "next/navigation";

import { db } from "@/lib/prismadb";
import { getCurrentUser } from "@/lib/auth";

type OrderItemInput = {
  productId: string;
  quantity: number;
  price: number;
};

type CreateOrderInput = {
  items: OrderItemInput[];
  shippingName: string;
  shippingAddress: string;
  shippingCity: string;
  shippingPostalCode: string;
  shippingCountry: string;
  phone?: string;
  notes?: string;
};

export async function createOrderAction(input: CreateOrderInput) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?callbackUrl=/cart");
  }

  if (!input.items || input.items.length === 0) {
    throw new Error("Coșul este gol. Nu poți plasa o comandă fără produse.");
  }

  // Validate shipping information
  if (
    !input.shippingName ||
    !input.shippingAddress ||
    !input.shippingCity ||
    !input.shippingPostalCode ||
    !input.shippingCountry
  ) {
    throw new Error("Completează toate câmpurile obligatorii pentru livrare.");
  }

  // Calculate total
  const total = input.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  // Verify all products exist
  const productIds = input.items.map((item) => item.productId);
  const products = await db.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, price: true },
  });

  if (products.length !== productIds.length) {
    throw new Error("Unul sau mai multe produse nu mai sunt disponibile.");
  }

  // Create order with order items
  const order = await db.order.create({
    data: {
      userId: user.id,
      total,
      status: "PENDING",
      shippingName: input.shippingName,
      shippingAddress: input.shippingAddress,
      shippingCity: input.shippingCity,
      shippingPostalCode: input.shippingPostalCode,
      shippingCountry: input.shippingCountry,
      phone: input.phone || null,
      notes: input.notes || null,
      orderItems: {
        create: input.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
      },
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  return { success: true, orderId: order.id };
}

