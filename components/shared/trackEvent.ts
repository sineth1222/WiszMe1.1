"use client";

export function trackWishEvent(wishId: string, eventType: string) {
  fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ wishId, eventType }),
  }).catch(() => {
    // best-effort — never block the recipient's experience on this
  });
}
