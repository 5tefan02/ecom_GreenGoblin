import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ProductCategory } from "@prisma/client";

import { db } from "@/lib/prismadb";
import { requireUserRole } from "@/lib/auth";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-")
    .replace(/^-+|-+$/g, "");

async function ensureUniqueSlug(base: string, excludeId?: string) {
  let slug = slugify(base);
  let counter = 1;

  const existing = async (candidate: string) =>
    db.product.findUnique({ where: { slug: candidate } });

  let candidate = slug;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const hit = await existing(candidate);
    if (!hit || hit.id === excludeId) {
      return candidate;
    }
    candidate = `${slug}-${counter}`;
    counter += 1;
  }
}

export async function createProductAction(formData: FormData) {
  "use server";

  const user = await requireUserRole(["admin"]);
  if (!user) {
    redirect("/login?callbackUrl=/admin/products/new");
  }

  const name = formData.get("name")?.toString().trim();
  const description = formData.get("description")?.toString().trim();
  const imageUrl = formData.get("imageUrl")?.toString().trim();
  const imageKey = formData.get("imageKey")?.toString().trim() || null;
  const category = formData.get("category")?.toString() as ProductCategory | null;
  const priceInput = formData.get("price")?.toString().trim();
  const isFeatured = formData.get("isFeatured") === "on";

  if (!name || !description || !imageUrl || !category) {
    throw new Error("Completează toate câmpurile obligatorii.");
  }

  if (!priceInput) {
    throw new Error("Prețul este obligatoriu.");
  }

  const price = Number.parseFloat(priceInput);
  if (Number.isNaN(price) || price < 0) {
    throw new Error("Prețul introdus nu este valid.");
  }

  const slug = await ensureUniqueSlug(name);

  await db.product.create({
    data: {
      name,
      description,
      imageUrl,
      imageKey,
      category,
      price,
      isFeatured,
      slug,
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/comics");
  revalidatePath("/figurines");
  redirect("/admin/products?status=created");
}

export async function updateProductAction(productId: string, formData: FormData) {
  "use server";

  const user = await requireUserRole(["admin"]);
  if (!user) {
    redirect("/login?callbackUrl=/admin/products");
  }

  const name = formData.get("name")?.toString().trim();
  const description = formData.get("description")?.toString().trim();
  const imageUrl = formData.get("imageUrl")?.toString().trim();
  const imageKey = formData.get("imageKey")?.toString().trim() || null;
  const category = formData.get("category")?.toString() as ProductCategory | null;
  const priceInput = formData.get("price")?.toString().trim();
  const isFeatured = formData.get("isFeatured") === "on";

  if (!name || !description || !imageUrl || !category) {
    throw new Error("Completează toate câmpurile obligatorii.");
  }

  if (!priceInput) {
    throw new Error("Prețul este obligatoriu.");
  }

  const price = Number.parseFloat(priceInput);
  if (Number.isNaN(price) || price < 0) {
    throw new Error("Prețul introdus nu este valid.");
  }

  const slug = await ensureUniqueSlug(name, productId);

  await db.product.update({
    where: { id: productId },
    data: {
      name,
      description,
      imageUrl,
      imageKey,
      category,
      price,
      isFeatured,
      slug,
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/comics");
  revalidatePath("/figurines");
  redirect(`/admin/products/${productId}/edit?status=updated`);
}

export async function deleteProductAction(productId: string) {
  "use server";

  const user = await requireUserRole(["admin"]);
  if (!user) {
    redirect("/login?callbackUrl=/admin/products");
  }

  await db.product.delete({ where: { id: productId } });
  revalidatePath("/admin/products");
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/comics");
  revalidatePath("/figurines");
  redirect("/admin/products?status=deleted");
}

