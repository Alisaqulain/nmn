import * as jose from "jose";

const getSecret = () => {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error("JWT_SECRET is not set");
  return new TextEncoder().encode(s);
};

export type JwtPayload = {
  sub: string;
  email: string;
  role: "admin" | "member";
  plan: "free" | "premium";
};

export async function signToken(payload: JwtPayload, expiresIn = "7d"): Promise<string> {
  return new jose
    .SignJWT({
      email: payload.email,
      role: payload.role,
      plan: payload.plan,
    })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setExpirationTime(expiresIn)
    .sign(getSecret());
}

export async function verifyToken(token: string): Promise<JwtPayload | null> {
  try {
    const { payload } = await jose.jwtVerify(token, getSecret());
    return {
      sub: String(payload.sub),
      email: String(payload.email),
      role: payload.role === "admin" ? "admin" : "member",
      plan: payload.plan === "premium" ? "premium" : "free",
    };
  } catch {
    return null;
  }
}

export const AUTH_COOKIE = "nmn_token";
