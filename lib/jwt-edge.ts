/** Decode JWT payload without verification (Edge-safe). APIs still verify signatures. */
export function decodeJwtPayloadUnsafe(token: string): { sub?: string; role?: string; email?: string; plan?: string } | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    let base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) base64 += "=";
    const json = atob(base64);
    return JSON.parse(json) as { sub?: string; role?: string; email?: string; plan?: string };
  } catch {
    return null;
  }
}
