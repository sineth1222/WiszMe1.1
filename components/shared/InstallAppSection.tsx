"use client";

import { useEffect, useState } from "react";

type Platform = "android" | "ios" | "desktop" | "unknown";

function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return "unknown";
  const ua = navigator.userAgent;
  if (/android/i.test(ua)) return "android";
  if (/iphone|ipad|ipod/i.test(ua)) return "ios";
  return "desktop";
}

const DISMISS_KEY = "wiszme_install_dismissed";

export function InstallAppSection() {
  const [platform, setPlatform] = useState<Platform>("unknown");
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
  const [dismissed, setDismissed] = useState(true);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    setPlatform(detectPlatform());
    setDismissed(localStorage.getItem(DISMISS_KEY) === "1");

    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone ===
        true;
    setInstalled(standalone);

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, "1");
    setDismissed(true);
  };

  const install = async () => {
    if (!deferredPrompt) return;
    // @ts-expect-error - BeforeInstallPromptEvent isn't in lib.dom yet
    deferredPrompt.prompt();
    setDeferredPrompt(null);
    dismiss();
  };

  if (installed || dismissed) return null;
  if (platform === "android" && !deferredPrompt) return null;

  return (
    <div
      className="mx-auto  flex max-w-md flex-col items-center gap-3 rounded-2xl border p-6 text-center"
      style={{
        borderColor: "rgba(185,140,255,0.2)",
        background: "rgba(255,255,255,0.02)",
      }}
    >
      <p className="font-serif text-lg" style={{ color: "#CFC8E8" }}>
        Install WizhMe ✨
      </p>

      {platform === "android" && (
        <>
          <p
            className="text-xs font-scriptnew"
            style={{ color: "#CFC8E8", opacity: 0.8 }}
          >
            Add WizhMe to your home screen.
          </p>
          <button
            onClick={install}
            className="rounded-full px-5 py-2 text-xs font-medium"
            style={{
              background: "linear-gradient(135deg,#B98CFF,#FF7EB6)",
              color: "#0B0A14",
            }}
          >
            Install
          </button>
        </>
      )}
      {platform === "ios" && (
        <p
          className="text-xs font-scriptnew"
          style={{ color: "#CFC8E8", opacity: 0.8 }}
        >
          Tap the Share icon, then <strong>Add to Home Screen</strong>.
        </p>
      )}
      {platform === "desktop" && (
        <p
          className="text-xs font-scriptnew"
          style={{ color: "#CFC8E8", opacity: 0.8 }}
        >
          Look for the install icon in your browser&apos;s address bar.
        </p>
      )}

      <button
        onClick={dismiss}
        className="text-[11px] opacity-30"
        style={{ color: "#CFC8E8" }}
      >
        Not now
      </button>
    </div>
  );
}
