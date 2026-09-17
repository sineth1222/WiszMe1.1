export interface UploadResult {
  url: string;
  fileId: string;
}

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic"];

export function validateFile(file: File): string | null {
  if (file.size > MAX_IMAGE_BYTES) {
    return `File is too large (max ${Math.round(MAX_IMAGE_BYTES / (1024 * 1024))}MB).`;
  }
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return "That file type isn't supported.";
  }
  return null;
}

export async function uploadToImageKit(file: File, folder: "photos" | "music"): Promise<UploadResult> {
  const authRes = await fetch("/api/upload");
  if (!authRes.ok) {
    throw new Error("Could not start upload. Please sign in and try again.");
  }
  const auth = await authRes.json();

  const form = new FormData();
  form.append("file", file);
  form.append("fileName", `${Date.now()}-${file.name}`);
  form.append("folder", `/wiszme/${folder}`);
  form.append("publicKey", auth.publicKey);
  form.append("signature", auth.signature);
  form.append("token", auth.token);
  form.append("expire", String(auth.expire));

  const uploadRes = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
    method: "POST",
    body: form,
  });

  if (!uploadRes.ok) {
    throw new Error("That upload failed. Try another file.");
  }

  const data = await uploadRes.json();
  return { url: data.url, fileId: data.fileId };
}
