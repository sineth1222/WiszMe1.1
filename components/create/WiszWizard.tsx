"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { uploadToImageKit, validateFile } from "@/lib/upload";
import {
  BUILT_IN_TRACKS,
  MESSAGE_STYLES,
  suggestMessage,
  type MessageStyle,
} from "@/lib/message-presets";
import { createClient } from "@/lib/supabase/client";
import { PlanSelectModal } from "@/components/create/PlanSelectModal";
import { GoodMorningTemplate } from "@/components/templates/GoodMorningTemplate";
import { GoodNightTemplate } from "@/components/templates/GoodNightTemplate";
import { MothersDayTemplate } from "@/components/templates/MothersDayTemplate";
import { FathersDayTemplate } from "@/components/templates/FathersDayTemplate";
import { WeddingTemplate } from "@/components/templates/WeddingTemplate";
import { NewBabyTemplate } from "@/components/templates/NewBabyTemplate";
import { GetWellSoonTemplate } from "@/components/templates/GetWellSoonTemplate";
import { GoodLuckTemplate } from "@/components/templates/GoodLuckTemplate";
import { HousewarmingTemplate } from "@/components/templates/HousewarmingTemplate";
import { DiwaliTemplate } from "@/components/templates/DiwaliTemplate";
import { AvuruduTemplate } from "@/components/templates/AvuruduTemplate";
import type { WiszMemory, WiszWish } from "@/types/wisz";
import { ChevronLeft } from "lucide-react";

const STEP_LABELS = ["Details", "Photos", "Message", "Music", "Preview"];

const CATEGORY_TEMPLATE: Record<WiszWizardProps["category"], string> = {
  "good-morning": "sunrise-letter",
  "good-night": "moon-letter",
  "mothers-day": "flower-bouquet",
  "fathers-day": "medal-of-honor",
  wedding: "rings-join",
  "new-baby": "baby-announce",
  "get-well-soon": "get-well-flowers",
  "good-luck": "lucky-charm",
  housewarming: "new-home-sunrise",
  diwali: "diya-light",
  "sinhala-tamil-new-year": "avurudu-lamp",
};

const CATEGORY_TITLE: Record<WiszWizardProps["category"], string> = {
  "good-morning": "Good Morning ☀️",
  "good-night": "Good Night 🌙",
  "mothers-day": "Mother's Day 🌷",
  "fathers-day": "Father's Day 🏅",
  wedding: "Wedding 💍",
  "new-baby": "New Baby 👶",
  "get-well-soon": "Get Well Soon 🌼",
  "good-luck": "Good Luck 🍀",
  housewarming: "Housewarming 🏡",
  diwali: "Diwali 🪔",
  "sinhala-tamil-new-year": "Sinhala & Tamil New Year 🌾",
};

interface Draft {
  recipientName: string;
  recipientNickname: string;
  senderName: string;
  mainPhotoUrl: string | null;
  memories: WiszMemory[];
  mainMessage: string;
  musicUrl: string | null;
  musicType: "builtin" | "custom" | null;
  accentColor: string;
}

const EMPTY_DRAFT: Draft = {
  recipientName: "",
  recipientNickname: "",
  senderName: "",
  mainPhotoUrl: null,
  memories: [],
  mainMessage: "",
  musicUrl: null,
  musicType: null,
  accentColor: "",
};

interface WiszWizardProps {
  category:
    | "good-morning"
    | "good-night"
    | "mothers-day"
    | "fathers-day"
    | "wedding"
    | "new-baby"
    | "get-well-soon"
    | "good-luck"
    | "housewarming"
    | "diwali"
    | "sinhala-tamil-new-year";
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 12,
  border: "1px solid rgba(185,140,255,0.3)",
  fontSize: 14,
  outline: "none",
  background: "rgba(255,255,255,0.04)",
  color: "#CFC8E8",
};
const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 13,
  fontWeight: 500,
  color: "#CFC8E8",
  marginBottom: 6,
};

export function WiszWizard({ category }: WiszWizardProps) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingMemory, setUploadingMemory] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [createdWish, setCreatedWish] = useState<{
    id: string;
    slug: string;
  } | null>(null);
  const [senderEmail, setSenderEmail] = useState("");

  const [previewingId, setPreviewingId] = useState<string | null>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);

  const togglePreview = (id: string, url: string) => {
    // stop whatever's currently playing, regardless of which track
    previewAudioRef.current?.pause();

    if (previewingId === id) {
      // tapped the currently-playing track again → just stop
      setPreviewingId(null);
      return;
    }

    const audio = new Audio(url);
    audio.volume = 0.6;
    audio.play().catch(() => {
      // autoplay/format issue — silently no-op, the button just won't animate
    });
    audio.onended = () => setPreviewingId(null);
    previewAudioRef.current = audio;
    setPreviewingId(id);
  };

  useEffect(() => {
    createClient()
      .auth.getUser()
      .then(({ data }) => setSenderEmail(data.user?.email ?? ""));
  }, []);

  const update = <K extends keyof Draft>(field: K, value: Draft[K]) =>
    setDraft((d) => ({ ...d, [field]: value }));

  const canAdvance = () => {
    switch (step) {
      case 0:
        return draft.recipientName.trim() && draft.senderName.trim();
      case 2:
        return draft.mainMessage.trim().length > 0;
      default:
        return true;
    }
  };

  const next = () =>
    canAdvance() && setStep((s) => Math.min(s + 1, STEP_LABELS.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const handleMainUpload = async (file: File) => {
    setUploadError(null);
    const invalid = validateFile(file);
    if (invalid) return setUploadError(invalid);
    setUploadingMain(true);
    try {
      const result = await uploadToImageKit(file, "photos");
      update("mainPhotoUrl", result.url);
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setUploadingMain(false);
    }
  };

  const handleMemoryUpload = async (files: FileList) => {
    setUploadError(null);
    if (draft.memories.length + files.length > 10)
      return setUploadError("You can add up to 10 photos.");
    setUploadingMemory(true);
    try {
      const uploaded: WiszMemory[] = [];
      for (const file of Array.from(files)) {
        const invalid = validateFile(file);
        if (invalid) {
          setUploadError(invalid);
          continue;
        }
        const result = await uploadToImageKit(file, "photos");
        uploaded.push({
          url: result.url,
          order: draft.memories.length + uploaded.length,
        });
      }
      update("memories", [...draft.memories, ...uploaded]);
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setUploadingMemory(false);
    }
  };

  const handleCreate = async () => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const template = CATEGORY_TEMPLATE[category];
      const res = await fetch("/api/wishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...draft, category, template }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      setCreatedWish({ id: data.id, slug: data.slug });
      setShowPlanModal(true);
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const previewWish: WiszWish = {
    id: "preview",
    creatorId: "preview",
    slug: "preview",
    category,
    template: CATEGORY_TEMPLATE[category] as any,
    recipientName: draft.recipientName || "Someone",
    recipientNickname: draft.recipientNickname || undefined,
    senderName: draft.senderName || "Someone",
    mainMessage: draft.mainMessage || "Your message will appear here.",
    mainPhotoUrl: draft.mainPhotoUrl,
    memories: draft.memories,
    musicUrl: draft.musicUrl,
    musicType: draft.musicType,
    accentColor: draft.accentColor || undefined,
    hasWatermark: true,
    status: "draft",
    createdAt: "",
    updatedAt: "",
  };

  const title = CATEGORY_TITLE[category];

  if (step === 4) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-[#0B0A14]">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#0B0A14]/90 px-5 py-3 backdrop-blur">
          <button
            onClick={back}
            className="text-sm flex items-center gap-1 hover:text-gray-100 rounded-lg"
            style={{ color: "#B98CFF" }}
          >
            <ChevronLeft size={24} className="text-gray-700" /> Edit
          </button>
          <p className="text-sm font-medium" style={{ color: "#CFC8E8" }}>
            Live Preview
          </p>
          <button
            onClick={handleCreate}
            disabled={submitting}
            className="rounded-full px-5 py-2 text-xs font-medium"
            style={{
              background: "linear-gradient(135deg,#B98CFF,#FF7EB6)",
              color: "#0B0A14",
            }}
          >
            {submitting ? "Creating..." : "Create My Wish ✨"}
          </button>
        </div>
        {submitError && (
          <p
            className="px-5 py-2 text-center text-xs"
            style={{ color: "#FF7EB6" }}
          >
            {submitError}
          </p>
        )}
        {category === "good-morning" && (
          <GoodMorningTemplate wish={previewWish} />
        )}
        {category === "good-night" && <GoodNightTemplate wish={previewWish} />}
        {category === "mothers-day" && (
          <MothersDayTemplate wish={previewWish} />
        )}
        {category === "fathers-day" && (
          <FathersDayTemplate wish={previewWish} />
        )}
        {category === "wedding" && <WeddingTemplate wish={previewWish} />}
        {category === "new-baby" && <NewBabyTemplate wish={previewWish} />}
        {category === "get-well-soon" && (
          <GetWellSoonTemplate wish={previewWish} />
        )}
        {category === "good-luck" && <GoodLuckTemplate wish={previewWish} />}
        {category === "housewarming" && (
          <HousewarmingTemplate wish={previewWish} />
        )}
        {category === "diwali" && <DiwaliTemplate wish={previewWish} />}
        {category === "sinhala-tamil-new-year" && (
          <AvuruduTemplate wish={previewWish} />
        )}

        {showPlanModal && createdWish && (
          <PlanSelectModal
            wishId={createdWish.id}
            recipientName={draft.recipientName}
            senderEmail={senderEmail}
            onFree={() =>
              router.push(
                `/create/success?slug=${createdWish.slug}&category=${category}`,
              )
            }
            onPaidSuccess={() =>
              router.push(
                `/create/success?slug=${createdWish.slug}&category=${category}`,
              )
            }
            onClose={() => setShowPlanModal(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div
      className="mx-auto min-h-screen max-w-xl px-5 py-10"
      style={{
        background:
          "radial-gradient(ellipse at 50% -10%, #241B3D 0%, #141127 55%, #0B0A14 100%)",
      }}
    >
      <h1
        className="mb-1 text-center font-serif text-2xl"
        style={{ color: "#CFC8E8" }}
      >
        Create a {title} Wish
      </h1>
      <p
        className="mb-8 text-center text-sm"
        style={{ color: "#CFC8E8", opacity: 0.7 }}
      >
        Step {step + 1} of {STEP_LABELS.length}
      </p>

      <div className="mx-auto mb-8 flex max-w-md gap-1.5">
        {STEP_LABELS.map((label, i) => (
          <div
            key={label}
            className="h-1.5 flex-1 rounded-full"
            style={{
              background: i <= step ? "#B98CFF" : "rgba(185,140,255,0.2)",
            }}
          />
        ))}
      </div>

      {step === 0 && (
        <div className="flex flex-col gap-5">
          <div>
            <label style={labelStyle}>Who is this little surprise for?</label>
            <input
              style={inputStyle}
              value={draft.recipientName}
              onChange={(e) => update("recipientName", e.target.value)}
              placeholder="Their name"
              maxLength={60}
            />
          </div>
          <div>
            <label style={labelStyle}>What do you call them? (optional)</label>
            <input
              style={inputStyle}
              value={draft.recipientNickname}
              onChange={(e) => update("recipientNickname", e.target.value)}
              placeholder="Nickname"
              maxLength={40}
            />
          </div>
          <div>
            <label style={labelStyle}>Your name (shown as the sender)</label>
            <input
              style={inputStyle}
              value={draft.senderName}
              onChange={(e) => update("senderName", e.target.value)}
              placeholder="Your name"
              maxLength={60}
            />
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="flex flex-col gap-8">
          <div>
            <p
              className="mb-2 text-sm font-medium"
              style={{ color: "#CFC8E8" }}
            >
              Main photo (optional)
            </p>
            {draft.mainPhotoUrl ? (
              <div
                className="relative h-40 w-32 overflow-hidden rounded-xl border"
                style={{ borderColor: "rgba(185,140,255,0.3)" }}
              >
                <Image
                  src={draft.mainPhotoUrl}
                  alt="Main"
                  fill
                  className="object-cover"
                  sizes="128px"
                />
                <button
                  type="button"
                  onClick={() => update("mainPhotoUrl", null)}
                  className="absolute right-1 top-1 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white"
                >
                  ✕
                </button>
              </div>
            ) : (
              <label
                className="flex h-40 w-32 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed text-xs"
                style={{
                  borderColor: "rgba(185,140,255,0.4)",
                  color: "#B98CFF",
                }}
              >
                {uploadingMain ? "Uploading..." : "+ Add photo"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploadingMain}
                  onChange={(e) =>
                    e.target.files?.[0] && handleMainUpload(e.target.files[0])
                  }
                />
              </label>
            )}
          </div>
          <div>
            <p
              className="mb-2 text-sm font-medium"
              style={{ color: "#CFC8E8" }}
            >
              Memory photos{" "}
              <span className="font-normal opacity-60">
                (up to 5, optional)
              </span>
            </p>
            <div className="flex flex-wrap gap-3">
              {draft.memories.map((p) => (
                <div key={p.url} className="w-24">
                  <div
                    className="relative h-24 w-24 overflow-hidden rounded-lg border"
                    style={{ borderColor: "rgba(185,140,255,0.3)" }}
                  >
                    <Image
                      src={p.url}
                      alt="Memory"
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        update(
                          "memories",
                          draft.memories.filter((m) => m.url !== p.url),
                        )
                      }
                      className="absolute right-1 top-1 rounded-full bg-black/60 px-1.5 text-xs text-white"
                    >
                      ✕
                    </button>
                  </div>
                  <input
                    placeholder="caption"
                    value={p.caption ?? ""}
                    onChange={(e) =>
                      update(
                        "memories",
                        draft.memories.map((m) =>
                          m.url === p.url
                            ? { ...m, caption: e.target.value }
                            : m,
                        ),
                      )
                    }
                    className="mt-1 w-full rounded border px-1.5 py-1 text-[11px]"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      borderColor: "rgba(185,140,255,0.2)",
                      color: "#CFC8E8",
                    }}
                  />
                </div>
              ))}
              {draft.memories.length < 5 && (
                <label
                  className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed text-xs"
                  style={{
                    borderColor: "rgba(185,140,255,0.4)",
                    color: "#B98CFF",
                  }}
                >
                  {uploadingMemory ? "..." : "+ Add"}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    disabled={uploadingMemory}
                    onChange={(e) =>
                      e.target.files && handleMemoryUpload(e.target.files)
                    }
                  />
                </label>
              )}
            </div>
          </div>
          {uploadError && (
            <p className="text-xs" style={{ color: "#FF7EB6" }}>
              {uploadError}
            </p>
          )}
        </div>
      )}

      {step === 2 && (
        <div>
          <div className="mb-4 flex flex-wrap gap-2">
            {MESSAGE_STYLES.map((style) => (
              <button
                key={style}
                type="button"
                onClick={() =>
                  update(
                    "mainMessage",
                    suggestMessage(
                      style as MessageStyle,
                      draft.recipientNickname || draft.recipientName || "them",
                    ),
                  )
                }
                className="rounded-full border px-3 py-1 text-xs"
                style={{
                  borderColor: "rgba(185,140,255,0.3)",
                  color: "#B98CFF",
                }}
              >
                {style}
              </button>
            ))}
          </div>
          <textarea
            value={draft.mainMessage}
            onChange={(e) => update("mainMessage", e.target.value)}
            maxLength={3000}
            rows={9}
            placeholder="What would you like to say?"
            className="w-full rounded-xl border p-4 text-sm leading-relaxed outline-none"
            style={{
              borderColor: "rgba(185,140,255,0.25)",
              background: "rgba(255,255,255,0.04)",
              color: "#CFC8E8",
            }}
          />
          <p
            className="mt-1.5 text-right text-[11px] opacity-50"
            style={{ color: "#CFC8E8" }}
          >
            {draft.mainMessage.length}/3000
          </p>
        </div>
      )}

      {/*step === 3 && (
        <div className="flex flex-col gap-4">
          {BUILT_IN_TRACKS.map((track) => (
            <button
              key={track.id}
              type="button"
              onClick={() => {
                update("musicUrl", track.url);
                update("musicType", "builtin");
              }}
              className="flex items-center justify-between rounded-xl border px-4 py-2.5 text-left text-sm"
              style={{
                borderColor:
                  draft.musicUrl === track.url
                    ? "#B98CFF"
                    : "rgba(185,140,255,0.2)",
                borderWidth: draft.musicUrl === track.url ? 2 : 1,
                color: "#CFC8E8",
              }}
            >
              {track.label}{" "}
              <span className="text-xs opacity-50">· {track.category}</span>
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              update("musicUrl", null);
              update("musicType", null);
            }}
            className="self-start text-xs opacity-30"
            style={{ color: "#CFC8E8" }}
          >
            Skip music for this surprise
          </button>
        </div>
      )*/}

      {step === 3 && (
        <div className="flex flex-col gap-4">
          {BUILT_IN_TRACKS.map((track) => (
            <div
              key={track.id}
              className="flex items-center gap-2 rounded-xl border px-4 py-2.5"
              style={{
                borderColor:
                  draft.musicUrl === track.url
                    ? "#B98CFF"
                    : "rgba(185,140,255,0.2)",
                borderWidth: draft.musicUrl === track.url ? 2 : 1,
              }}
            >
              <button
                type="button"
                onClick={() => togglePreview(track.id, track.url)}
                aria-label={
                  previewingId === track.id
                    ? `Pause ${track.label}`
                    : `Preview ${track.label}`
                }
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs"
                style={{
                  background: "rgba(185,140,255,0.15)",
                  color: "#B98CFF",
                }}
              >
                {previewingId === track.id ? "⏸" : "▶"}
              </button>
              <button
                type="button"
                onClick={() => {
                  update("musicUrl", track.url);
                  update("musicType", "builtin");
                }}
                className="flex-1 text-left text-sm"
                style={{ color: "#CFC8E8" }}
              >
                {track.label}{" "}
                <span className="text-xs opacity-50">· {track.category}</span>
              </button>
              {draft.musicUrl === track.url && (
                <span className="text-xs" style={{ color: "#B98CFF" }}>
                  ✓ Selected
                </span>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              update("musicUrl", null);
              update("musicType", null);
            }}
            className="self-start text-xs opacity-30"
            style={{ color: "#CFC8E8" }}
          >
            Skip music for this surprise
          </button>
        </div>
      )}

      <div className="mt-10 flex items-center justify-between">
        <button
          onClick={back}
          disabled={step === 0}
          className="text-sm disabled:opacity-30"
          style={{ color: "#B98CFF" }}
        >
          Back
        </button>
        <button
          onClick={next}
          disabled={!canAdvance()}
          className="rounded-full px-6 py-2.5 text-sm font-medium transition hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
          style={{
            background: "linear-gradient(135deg,#B98CFF,#FF7EB6)",
            color: "#0B0A14",
          }}
        >
          {step === 3 ? "Preview My Wish" : "Continue"}
        </button>
      </div>
    </div>
  );
}
