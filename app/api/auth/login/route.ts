import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { db } from "@/lib/prismadb";
import { signToken, setAuthCookie } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email și parolă sunt obligatorii." },
        { status: 400 },
      );
    }

    const user = await db.user.findUnique({ where: { email } });

    if (!user?.password) {
      return NextResponse.json(
        { success: false, message: "Utilizator inexistent." },
        { status: 400 },
      );
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { success: false, message: "Parolă incorectă." },
        { status: 400 },
      );
    }

    const token = await signToken({
      id: user.id,
      role: user.role ?? "user",
      email: user.email,
      name: user.name ?? undefined,
    });

    const response = NextResponse.json({
      success: true,
      message: "Autentificare reușită.",
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });

    await setAuthCookie(token);

    return response;
  } catch (error) {
    console.error("Login error", error);
    return NextResponse.json(
      { success: false, message: "Nu am putut autentifica utilizatorul." },
      { status: 500 },
    );
  }
}

