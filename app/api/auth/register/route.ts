import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { db } from "@/lib/prismadb";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email și parolă sunt obligatorii." },
        { status: 400 },
      );
    }

    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Există deja un utilizator cu acest email." },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Toate conturile noi sunt create cu rolul "user"
    // Doar adminii pot modifica rolul din panoul de administrare
    await db.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name ?? null,
        role: "user",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Utilizator creat cu succes.",
    });
  } catch (error) {
    console.error("Register error", error);
    return NextResponse.json(
      { success: false, message: "Nu am putut crea utilizatorul." },
      { status: 500 },
    );
  }
}

