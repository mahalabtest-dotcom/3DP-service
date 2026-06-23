"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE = "admin-session";
const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 60 * 60 * 24 * 7, // 7 days
  path: "/",
};

export async function signIn(
  email: string,
  password: string
): Promise<{ error: string } | never> {
  const adminEmail = process.env.ADMIN_EMAIL ?? "";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "";

  if (!adminEmail || !adminPassword) {
    return { error: "Admin credentials are not configured." };
  }

  if (email !== adminEmail || password !== adminPassword) {
    return { error: "Invalid email or password." };
  }

  const cookieStore = await cookies();
  cookieStore.set(COOKIE, adminPassword, COOKIE_OPTS);
  redirect("/admin");
}

export async function signOut() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE);
  redirect("/admin/login");
}

export async function getAdminSession(): Promise<{
  authenticated: boolean;
  email: string;
}> {
  const cookieStore = await cookies();
  const adminPassword = process.env.ADMIN_PASSWORD ?? "";
  const adminEmail = process.env.ADMIN_EMAIL ?? "";
  const session = cookieStore.get(COOKIE)?.value;
  const authenticated = Boolean(adminPassword && session === adminPassword);
  return { authenticated, email: authenticated ? adminEmail : "" };
}
