"use server";

import { cookies, headers } from "next/headers";
import jwt from "jsonwebtoken";

import { db } from "./prismadb";

const AUTH_COOKIE = "greengoblin_token";
const TOKEN_SECRET = process.env.TOKEN_SECRET;

if (!TOKEN_SECRET) {
  console.warn("TOKEN_SECRET nu este definit în .env. JWT-urile nu vor funcționa corect.");
}

type JwtPayload = {
  id: string;
  role: string;
  email?: string;
  name?: string;
  iat: number;
  exp: number;
};

export async function signToken(payload: {
  id: string;
  role: string;
  email?: string;
  name?: string;
}) {
  if (!TOKEN_SECRET) {
    throw new Error("TOKEN_SECRET nu este setat");
  }

  return jwt.sign(payload, TOKEN_SECRET, { expiresIn: "8h" });
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  await cookieStore.set({
    name: AUTH_COOKIE,
    value: token,
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 8,
  });
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  await cookieStore.set({
    name: AUTH_COOKIE,
    value: "",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
  });
}

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE)?.value;

    if (!token || !TOKEN_SECRET) {
      return null;
    }

    const decoded = jwt.verify(token, TOKEN_SECRET) as JwtPayload;
    const user = await db.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, name: true, email: true, role: true },
    });

    return user;
  } catch (error) {
    console.warn("getCurrentUser: token invalid sau expirat", error);
    return null;
  }
}

export async function requireUserRole(requiredRoles: string[] = ["admin"]) {
  const user = await getCurrentUser();
  if (!user || !requiredRoles.includes(user.role)) {
    return null;
  }

  return user;
}

export async function getBearerTokenFromHeaders() {
  const headerStore = await headers();
  const authHeader = headerStore.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.slice("Bearer ".length);
}

