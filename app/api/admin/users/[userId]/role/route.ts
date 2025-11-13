import { NextResponse } from "next/server";

import { db } from "@/lib/prismadb";
import { requireUserRole } from "@/lib/auth";

async function resolveParams<T>(input: T | Promise<T>): Promise<T> {
  if (typeof (input as Promise<T>)?.then === "function") {
    return await (input as Promise<T>);
  }
  return input as T;
}

export async function PATCH(
  request: Request,
  { params }: { params: { userId: string } | Promise<{ userId: string }> }
) {
  try {
    const user = await requireUserRole(["admin"]);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Neautorizat." },
        { status: 401 },
      );
    }

    const resolvedParams = await resolveParams(params);
    const userId = resolvedParams.userId;

    const body = await request.json();
    const { role } = body;

    if (!role || !["user", "admin"].includes(role)) {
      return NextResponse.json(
        { success: false, message: "Rol invalid. Trebuie să fie 'user' sau 'admin'." },
        { status: 400 },
      );
    }

    const targetUser = await db.user.findUnique({
      where: { id: userId },
    });

    if (!targetUser) {
      return NextResponse.json(
        { success: false, message: "Utilizatorul nu a fost găsit." },
        { status: 404 },
      );
    }

    // Actualizează rolul utilizatorului
    await db.user.update({
      where: { id: userId },
      data: { role },
    });

    return NextResponse.json({
      success: true,
      message: "Rolul utilizatorului a fost actualizat cu succes.",
    });
  } catch (error) {
    console.error("Update role error", error);
    return NextResponse.json(
      { success: false, message: "Nu am putut actualiza rolul utilizatorului." },
      { status: 500 },
    );
  }
}

