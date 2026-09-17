"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Copy, Clock, Send, Sparkles, Trash2 } from "lucide-react";

interface WishCardProps {
  id: string;
  slug: string;
  category: string;
  recipientName: string;
  status: string;
  createdAt: string;
}

const STATUS_BADGE: Record<string, { label: string; icon: React.ReactNode }> = {
  draft: { label: "Draft", icon: <Clock size={12} /> },
  published: { label: "Sent", icon: <Send size={12} /> },
  opened: { label: "Opened", icon: <Sparkles size={12} /> },
  completed: { label: "Completed", icon: <Sparkles size={12} /> },
};

const STATUS_STYLE: Record<string, React.CSSProperties> = {
  draft: { background: "rgba(207,200,232,0.15)", color: "#CFC8E8" },
  published: { background: "rgba(185,140,255,0.18)", color: "#B98CFF" },
  opened: { background: "rgba(255,126,182,0.2)", color: "#FF7EB6" },
  completed: { background: "#B98CFF", color: "#0B0A14" },
};

export function WishCard({ id, slug, category, recipientName, status, createdAt }: WishCardProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const link = `${typeof window !== "undefined" ? window.location.origin : ""}/${category}/${slug}`;

  const badge = STATUS_BADGE[status] ?? STATUS_BADGE.draft;
  const badgeStyle = STATUS_STYLE[status] ?? STATUS_STYLE.draft;

  const copyLink = async () => {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleDelete = async () => {
    if (!confirm(`Delete the wish for ${recipientName}? This can't be undone.`)) return;
    setDeleting(true);
    const res = await fetch(`/api/wishes/${id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
    else {
      setDeleting(false);
      alert("Could not delete. Try again.");
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border p-5 transition hover:shadow-md" style={{ borderColor: "rgba(185,140,255,0.15)", background: "rgba(255,255,255,0.02)" }}>
      <div className="flex items-start justify-between">
        <div>
          <p className="font-serif text-lg font-semibold" style={{ color: "#CFC8E8" }}>{recipientName}</p>
          <p className="text-xs capitalize" style={{ color: "#CFC8E8", opacity: 0.6 }}>{category.replace("-", " ")} · {new Date(createdAt).toLocaleDateString()}</p>
        </div>
        <span className="flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold" style={badgeStyle}>
          {badge.icon} {badge.label}
        </span>
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-xl border px-3 py-2" style={{ borderColor: "rgba(185,140,255,0.2)", background: "rgba(255,255,255,0.03)" }}>
        <span className="flex-1 truncate text-xs" style={{ color: "#CFC8E8", opacity: 0.7 }}>{link}</span>
        <button onClick={copyLink} aria-label="Copy link" style={{ color: "#B98CFF" }}>
          <Copy size={14} />
        </button>
      </div>
      {copied && <p className="mt-1 text-xs" style={{ color: "#B98CFF" }}>Copied!</p>}

      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        <Link href={`/${category}/${slug}`} className="rounded-full border px-3 py-1.5" style={{ borderColor: "rgba(185,140,255,0.25)", color: "#CFC8E8" }}>Preview</Link>
        <a href={`https://wa.me/?text=${encodeURIComponent(`✨ A surprise for you: ${link}`)}`} target="_blank" rel="noopener noreferrer" className="rounded-full px-3 py-1.5 text-white" style={{ background: "#25D366" }}>Share</a>
        <button onClick={handleDelete} disabled={deleting} className="flex items-center gap-1 rounded-full border px-3 py-1.5" style={{ borderColor: "rgba(255,126,182,0.3)", color: "#FF7EB6" }}>
          <Trash2 size={12} /> {deleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
}
