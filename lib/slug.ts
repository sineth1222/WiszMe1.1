import { customAlphabet } from "nanoid";

const nanoid = customAlphabet("23456789abcdefghjkmnpqrstuvwxyz", 6);

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 24);
}

export function buildSlug(recipientName: string): string {
  const base = slugify(recipientName) || "wish";
  return `${base}-${nanoid()}`;
}

export async function buildUniqueSlug(
  recipientName: string,
  exists: (slug: string) => Promise<boolean>,
  maxAttempts = 5
): Promise<string> {
  for (let i = 0; i < maxAttempts; i++) {
    const candidate = buildSlug(recipientName);
    if (!(await exists(candidate))) return candidate;
  }
  throw new Error("Could not generate a unique slug after several attempts");
}
