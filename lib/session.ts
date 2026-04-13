import { cookies } from "next/headers";
import { AUTH_COOKIE, verifyToken, type JwtPayload } from "@/lib/jwt";

export async function getSession(): Promise<JwtPayload | null> {
  const token = cookies().get(AUTH_COOKIE)?.value;
  if (!token) return null;
  return verifyToken(token);
}
