"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, X } from "lucide-react";
import { CATEGORIES, PRODUCTS, isNative } from "@/lib/categories";

type Who = "partner" | "crush" | "friend" | "family" | "someone-special";
type Feeling =
  | "loved"
  | "happy"
  | "surprised"
  | "appreciated"
  | "missed"
  | "excited";
type Saying =
  | "happy-birthday"
  | "i-love-you"
  | "i-miss-you"
  | "lets-date"
  | "happy-new-year"
  | "merry-christmas"
  | "good-morning"
  | "good-night"
  | "just-because"
  | "happy-mothers-day"
  | "happy-fathers-day"
  | "congratulations-wedding"
  | "welcome-baby"
  | "get-well-soon"
  | "good-luck"
  | "welcome-home"
  | "happy-diwali"
  | "happy-avurudu";

const WHO_OPTIONS: { id: Who; label: string }[] = [
  { id: "partner", label: "Partner" },
  { id: "crush", label: "Crush" },
  { id: "friend", label: "Friend" },
  { id: "family", label: "Family" },
  { id: "someone-special", label: "Someone Special" },
];

const FEELING_OPTIONS: { id: Feeling; label: string }[] = [
  { id: "loved", label: "Loved" },
  { id: "happy", label: "Happy" },
  { id: "surprised", label: "Surprised" },
  { id: "appreciated", label: "Appreciated" },
  { id: "missed", label: "Missed" },
  { id: "excited", label: "Excited" },
];

const SAYING_OPTIONS: { id: Saying; label: string }[] = [
  { id: "happy-birthday", label: "Happy Birthday" },
  { id: "i-love-you", label: "I Love You" },
  { id: "i-miss-you", label: "I Miss You" },
  { id: "lets-date", label: "Let's Go on a Date" },
  { id: "happy-new-year", label: "Happy New Year" },
  { id: "merry-christmas", label: "Merry Christmas" },
  { id: "good-morning", label: "Good Morning" },
  { id: "good-night", label: "Good Night" },
  { id: "happy-mothers-day", label: "Happy Mother's Day" },
  { id: "happy-fathers-day", label: "Happy Father's Day" },
  { id: "congratulations-wedding", label: "Congratulations on the Wedding" },
  { id: "welcome-baby", label: "Welcome the New Baby" },
  { id: "get-well-soon", label: "Get Well Soon" },
  { id: "good-luck", label: "Good Luck" },
  { id: "welcome-home", label: "Welcome to Your New Home" },
  { id: "happy-diwali", label: "Happy Diwali" },
  { id: "happy-avurudu", label: "Happy Sinhala & Tamil New Year" },
  { id: "just-because", label: "Just Because" },
];

/**
 * "Saying" is by far the strongest signal — it maps almost 1:1 to a
 * category. "Who" and "feeling" only step in to disambiguate the few
 * sayings (like "just-because" or "i-love-you") that could plausibly
 * mean more than one category.
 */
function recommend(who: Who, feeling: Feeling, saying: Saying): string {
  switch (saying) {
    case "happy-birthday":
      return "birthday";
    case "lets-date":
      return "date-invitation";
    case "happy-new-year":
      return "new-year";
    case "merry-christmas":
      return "christmas";
    case "good-morning":
      return "good-morning";
    case "good-night":
      return "good-night";
    case "happy-mothers-day":
      return "mothers-day";
    case "happy-fathers-day":
      return "fathers-day";
    case "congratulations-wedding":
      return "wedding";
    case "welcome-baby":
      return "new-baby";
    case "get-well-soon":
      return "get-well-soon";
    case "good-luck":
      return "good-luck";
    case "welcome-home":
      return "housewarming";
    case "happy-diwali":
      return "diwali";
    case "happy-avurudu":
      return "sinhala-tamil-new-year";
    case "i-miss-you":
      return who === "partner" || who === "crush"
        ? "just-because"
        : "just-because";
    case "i-love-you":
      return "valentine";
    case "just-because":
    default:
      if (who === "partner" || who === "crush") return "just-because";
      return feeling === "appreciated" ? "just-because" : "just-because";
  }
}

interface HelpMeChooseProps {
  onClose: () => void;
}

export function HelpMeChoose({ onClose }: HelpMeChooseProps) {
  const [step, setStep] = useState(0);
  const [who, setWho] = useState<Who | null>(null);
  const [feeling, setFeeling] = useState<Feeling | null>(null);
  const [saying, setSaying] = useState<Saying | null>(null);

  const result =
    who && feeling && saying
      ? CATEGORIES.find((c) => c.slug === recommend(who, feeling, saying))
      : null;
  const product = result ? PRODUCTS[result.product] : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div
        className="relative w-full max-w-md rounded-3xl border p-6"
        style={{ borderColor: "rgba(185,140,255,0.3)", background: "#141127" }}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4"
          aria-label="Close"
        >
          <X size={18} color="#CFC8E8" />
        </button>

        <h2
          className="mb-1 text-center font-serif text-xl font-bold"
          style={{ color: "#CFC8E8" }}
        >
          Not sure what to create?
        </h2>
        <p
          className="mb-6 text-center text-xs"
          style={{ color: "#CFC8E8", opacity: 0.7 }}
        >
          Answer three quick questions ✨
        </p>

        <AnimatePresence mode="popLayout">
          {!result ? (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.25 }}
            >
              {step === 0 && (
                <QuestionBlock
                  title="Who is this for?"
                  options={WHO_OPTIONS}
                  onPick={(id) => {
                    setWho(id);
                    setStep(1);
                  }}
                />
              )}
              {step === 1 && (
                <QuestionBlock
                  title="What do you want them to feel?"
                  options={FEELING_OPTIONS}
                  onPick={(id) => {
                    setFeeling(id);
                    setStep(2);
                  }}
                />
              )}
              {step === 2 && (
                <QuestionBlock
                  title="What are you trying to say?"
                  options={SAYING_OPTIONS}
                  onPick={(id) => setSaying(id)}
                />
              )}
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center text-center"
            >
              <span className="text-4xl">{result.emoji}</span>
              <p
                className="mt-3 font-serif text-lg font-semibold"
                style={{ color: "#CFC8E8" }}
              >
                {result.name}
              </p>
              <p
                className="mt-1 text-xs uppercase tracking-wide"
                style={{ color: product?.accent }}
              >
                Powered by {product?.name}
              </p>
              <p
                className="mt-3 text-xs leading-relaxed"
                style={{ color: "#CFC8E8", opacity: 0.75 }}
              >
                {result.description}
              </p>

              {isNative(result) ? (
                <a
                  href={`/create/${result.slug}`}
                  className="mt-6 rounded-full px-6 py-3 text-sm font-semibold"
                  style={{
                    background: `linear-gradient(135deg, ${product?.accent}, #FF7EB6)`,
                    color: "#0B0A14",
                  }}
                >
                  Create {result.name} Wish
                </a>
              ) : (
                <a
                  href={result.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 flex items-center gap-1.5 rounded-full px-6 py-3 text-sm font-semibold"
                  style={{
                    background: `linear-gradient(135deg, ${product?.accent}, #FF7EB6)`,
                    color: "#0B0A14",
                  }}
                >
                  Create on {product?.name} <ExternalLink size={14} />
                </a>
              )}

              <button
                onClick={() => {
                  setStep(0);
                  setWho(null);
                  setFeeling(null);
                  setSaying(null);
                }}
                className="mt-4 text-xs underline"
                style={{ color: "#CFC8E8", opacity: 0.6 }}
              >
                Start over
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function QuestionBlock<T extends string>({
  title,
  options,
  onPick,
}: {
  title: string;
  options: { id: T; label: string }[];
  onPick: (id: T) => void;
}) {
  return (
    <div>
      <p
        className="mb-4 text-center text-sm font-medium"
        style={{ color: "#CFC8E8" }}
      >
        {title}
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        {options.map((o) => (
          <button
            key={o.id}
            onClick={() => onPick(o.id)}
            className="rounded-full border px-4 py-2 text-xs font-medium transition hover:scale-105"
            style={{ borderColor: "rgba(185,140,255,0.3)", color: "#CFC8E8" }}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/*"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, X } from "lucide-react";
import { CATEGORIES, PRODUCTS, isNative } from "@/lib/categories";

type Who = "partner" | "crush" | "friend" | "family" | "someone-special";
type Feeling = "loved" | "happy" | "surprised" | "appreciated" | "missed" | "excited";
type Saying =
  | "happy-birthday" | "i-love-you" | "i-miss-you" | "lets-date"
  | "happy-new-year" | "merry-christmas" | "good-morning" | "good-night" | "just-because";

const WHO_OPTIONS: { id: Who; label: string }[] = [
  { id: "partner", label: "Partner" },
  { id: "crush", label: "Crush" },
  { id: "friend", label: "Friend" },
  { id: "family", label: "Family" },
  { id: "someone-special", label: "Someone Special" },
];

const FEELING_OPTIONS: { id: Feeling; label: string }[] = [
  { id: "loved", label: "Loved" },
  { id: "happy", label: "Happy" },
  { id: "surprised", label: "Surprised" },
  { id: "appreciated", label: "Appreciated" },
  { id: "missed", label: "Missed" },
  { id: "excited", label: "Excited" },
];

const SAYING_OPTIONS: { id: Saying; label: string }[] = [
  { id: "happy-birthday", label: "Happy Birthday" },
  { id: "i-love-you", label: "I Love You" },
  { id: "i-miss-you", label: "I Miss You" },
  { id: "lets-date", label: "Let's Go on a Date" },
  { id: "happy-new-year", label: "Happy New Year" },
  { id: "merry-christmas", label: "Merry Christmas" },
  { id: "good-morning", label: "Good Morning" },
  { id: "good-night", label: "Good Night" },
  { id: "just-because", label: "Just Because" },
];

/**
 * "Saying" is by far the strongest signal — it maps almost 1:1 to a
 * category. "Who" and "feeling" only step in to disambiguate the few
 * sayings (like "just-because" or "i-love-you") that could plausibly
 * mean more than one category.
 /
function recommend(who: Who, feeling: Feeling, saying: Saying): string {
  switch (saying) {
    case "happy-birthday": return "birthday";
    case "lets-date": return "date-invitation";
    case "happy-new-year": return "new-year";
    case "merry-christmas": return "christmas";
    case "good-morning": return "good-morning";
    case "good-night": return "good-night";
    case "i-miss-you": return who === "partner" || who === "crush" ? "just-because" : "just-because";
    case "i-love-you": return "valentine";
    case "just-because":
    default:
      if (who === "partner" || who === "crush") return "just-because";
      return feeling === "appreciated" ? "just-because" : "just-because";
  }
}

interface HelpMeChooseProps {
  onClose: () => void;
}

export function HelpMeChoose({ onClose }: HelpMeChooseProps) {
  const [step, setStep] = useState(0);
  const [who, setWho] = useState<Who | null>(null);
  const [feeling, setFeeling] = useState<Feeling | null>(null);
  const [saying, setSaying] = useState<Saying | null>(null);

  const result = who && feeling && saying ? CATEGORIES.find((c) => c.slug === recommend(who, feeling, saying)) : null;
  const product = result ? PRODUCTS[result.product] : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="relative w-full max-w-md rounded-3xl border p-6" style={{ borderColor: "rgba(185,140,255,0.3)", background: "#141127" }}>
        <button onClick={onClose} className="absolute right-4 top-4" aria-label="Close">
          <X size={18} color="#CFC8E8" />
        </button>

        <h2 className="mb-1 text-center font-serif text-xl font-bold" style={{ color: "#CFC8E8" }}>
          Not sure what to create?
        </h2>
        <p className="mb-6 text-center text-xs" style={{ color: "#CFC8E8", opacity: 0.7 }}>
          Answer three quick questions ✨
        </p>

        <AnimatePresence mode="popLayout">
          {!result ? (
            <motion.div key={step} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.25 }}>
              {step === 0 && (
                <QuestionBlock title="Who is this for?" options={WHO_OPTIONS} onPick={(id) => { setWho(id); setStep(1); }} />
              )}
              {step === 1 && (
                <QuestionBlock title="What do you want them to feel?" options={FEELING_OPTIONS} onPick={(id) => { setFeeling(id); setStep(2); }} />
              )}
              {step === 2 && (
                <QuestionBlock title="What are you trying to say?" options={SAYING_OPTIONS} onPick={(id) => setSaying(id)} />
              )}
            </motion.div>
          ) : (
            <motion.div key="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center text-center">
              <span className="text-4xl">{result.emoji}</span>
              <p className="mt-3 font-serif text-lg font-semibold" style={{ color: "#CFC8E8" }}>
                {result.name}
              </p>
              <p className="mt-1 text-xs uppercase tracking-wide" style={{ color: product?.accent }}>
                Powered by {product?.name}
              </p>
              <p className="mt-3 text-xs leading-relaxed" style={{ color: "#CFC8E8", opacity: 0.75 }}>
                {result.description}
              </p>

              {isNative(result) ? (
                <a href={`/create/${result.slug}`} className="mt-6 rounded-full px-6 py-3 text-sm font-semibold" style={{ background: `linear-gradient(135deg, ${product?.accent}, #FF7EB6)`, color: "#0B0A14" }}>
                  Create {result.name} Wish
                </a>
              ) : (
                <a href={result.externalUrl} target="_blank" rel="noopener noreferrer" className="mt-6 flex items-center gap-1.5 rounded-full px-6 py-3 text-sm font-semibold" style={{ background: `linear-gradient(135deg, ${product?.accent}, #FF7EB6)`, color: "#0B0A14" }}>
                  Create on {product?.name} <ExternalLink size={14} />
                </a>
              )}

              <button
                onClick={() => { setStep(0); setWho(null); setFeeling(null); setSaying(null); }}
                className="mt-4 text-xs underline"
                style={{ color: "#CFC8E8", opacity: 0.6 }}
              >
                Start over
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function QuestionBlock<T extends string>({ title, options, onPick }: { title: string; options: { id: T; label: string }[]; onPick: (id: T) => void }) {
  return (
    <div>
      <p className="mb-4 text-center text-sm font-medium" style={{ color: "#CFC8E8" }}>{title}</p>
      <div className="flex flex-wrap justify-center gap-2">
        {options.map((o) => (
          <button
            key={o.id}
            onClick={() => onPick(o.id)}
            className="rounded-full border px-4 py-2 text-xs font-medium transition hover:scale-105"
            style={{ borderColor: "rgba(185,140,255,0.3)", color: "#CFC8E8" }}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}*/
