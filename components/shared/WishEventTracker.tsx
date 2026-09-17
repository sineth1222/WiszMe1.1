"use client";

import { useEffect } from "react";
import { trackWishEvent } from "./trackEvent";

export function WishEventTracker({ wishId }: { wishId: string }) {
  useEffect(() => {
    trackWishEvent(wishId, "opened");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
