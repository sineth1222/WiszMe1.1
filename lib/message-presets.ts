export const MESSAGE_STYLES = ["Sweet", "Romantic", "Funny", "Motivational", "Minimal"] as const;
export type MessageStyle = (typeof MESSAGE_STYLES)[number];

const TEMPLATES: Record<MessageStyle, (name: string) => string> = {
  Sweet: (name) => `Good day, ${name}! I just wanted you to know you're thought of today — hope it's a good one. 💛`,
  Romantic: (name) => `${name}, I don't say it enough — but you make even ordinary moments feel special. Sending you love today.`,
  Funny: (name) => `${name}, this is your official notice that someone (me) thinks you're pretty great. No further action required. 😄`,
  Motivational: (name) => `${name}, whatever today brings, you've got this. One step at a time — I believe in you.`,
  Minimal: (name) => `Thinking of you today, ${name}.`,
};

export function suggestMessage(style: MessageStyle, name: string): string {
  return TEMPLATES[style](name);
}

export const BUILT_IN_TRACKS = [
  { id: "calm-1", label: "Soft Piano", url: "/audio/calm-1.mp3", category: "Calm" },
  { id: "warm-1", label: "Warm Strings", url: "/audio/warm-1.mp3", category: "Warm" },
  { id: "dreamy-1", label: "Dreamy Pads", url: "/audio/dreamy-1.mp3", category: "Dreamy" },
];
