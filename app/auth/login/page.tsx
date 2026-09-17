"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.87c2.27-2.09 3.58-5.17 3.58-8.82Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.07 7.94-2.91l-3.87-3c-1.08.72-2.46 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.27v3.11A12 12 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.28A7.2 7.2 0 0 1 4.89 12c0-.79.14-1.56.38-2.28V6.61H1.27A12 12 0 0 0 0 12c0 1.94.46 3.77 1.27 5.39l4-3.11Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.94 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.27 6.61l4 3.11C6.22 6.86 8.87 4.75 12 4.75Z"
      />
    </svg>
  );
}

function LoginCard() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/dashboard";

  //const searchParams = useSearchParams();
  //const next = searchParams.get("next") ?? "/dashboard";

  const supabase = createClient();
  const [error, setError] = useState<string | null>(null);

  const redirectTo =
    (typeof window !== "undefined" ? window.location.origin : "") +
    `/auth/callback?next=${encodeURIComponent(next)}`;

  const signInWithGoogle = async () => {
    setError(null);
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    setStatus(error ? "error" : "sent");
  };

  return (
    <div
      className="relative z-10 w-full max-w-sm rounded-3xl border p-8 text-center shadow-xl backdrop-blur-md"
      style={{
        borderColor: "rgba(185,140,255,0.3)",
        background: "rgba(255,255,255,0.03)",
      }}
    >
      <h1
        className="font-serif text-2xl font-bold"
        style={{ color: "#CFC8E8" }}
      >
        Welcome to WiszMe ✨
      </h1>
      <p className="mt-2 text-sm" style={{ color: "#CFC8E8", opacity: 0.7 }}>
        Sign in to create your surprise.
      </p>

      <button
        onClick={signInWithGoogle}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-full border bg-white px-5 py-3 text-sm font-semibold shadow-sm transition hover:opacity-90"
        style={{ borderColor: "rgba(232,184,75,0.3)", color: "#3A2430" }}
      >
        <GoogleIcon />
        Continue with Google
      </button>

      <div
        className="my-5 flex items-center gap-3 text-xs"
        style={{ color: "rgba(232,184,75,0.4)" }}
      >
        <span
          className="h-px flex-1"
          style={{ background: "rgba(232,184,75,0.3)" }}
        />
        or
        <span
          className="h-px flex-1"
          style={{ background: "rgba(232,184,75,0.3)" }}
        />
      </div>

      {status === "sent" ? (
        <p
          className="mt-6 text-sm leading-relaxed"
          style={{ color: "#B98CFF" }}
        >
          Check <strong>{email}</strong> for a sign-in link.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6">
          <input
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 16px",
              borderRadius: 100,
              border: "1px solid rgba(185,140,255,0.3)",
              fontSize: 14,
              outline: "none",
              marginBottom: 14,
              background: "rgba(255,255,255,0.04)",
              color: "#CFC8E8",
            }}
          />
          <button
            type="submit"
            disabled={status === "sending"}
            style={{
              width: "100%",
              padding: "13px 0",
              borderRadius: 100,
              border: "none",
              color: "#0B0A14",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              background: "linear-gradient(135deg,#B98CFF,#FF7EB6)",
              opacity: status === "sending" ? 0.7 : 1,
            }}
          >
            {status === "sending" ? "Sending link..." : "Send magic link"}
          </button>
          {status === "error" && (
            <p className="mt-3 text-xs" style={{ color: "#FF7EB6" }}>
              Something went wrong. Try again.
            </p>
          )}
        </form>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(ellipse at 50% -10%, #241B3D 0%, #141127 55%, #0B0A14 100%)",
        fontFamily: "system-ui, sans-serif",
        padding: 24,
      }}
    >
      <Suspense
        fallback={
          <div style={{ color: "#CFC8E8", fontSize: 14 }}>Loading...</div>
        }
      >
        <LoginCard />
      </Suspense>
    </main>
  );
}
