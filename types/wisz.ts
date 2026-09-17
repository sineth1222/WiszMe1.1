export type WiszTemplate =
  | "sunrise-letter" | "wake-up-window" | "moon-letter" | "sleepy-cloud"
  | "flower-bouquet" | "medal-of-honor"
  | "rings-join" | "baby-announce" | "get-well-flowers" | "lucky-charm"
  | "new-home-sunrise" | "diya-light" | "avurudu-lamp";

export interface WiszMemory {
  url: string;
  caption?: string;
  order: number;
}

export interface WiszWish {
  id: string;
  creatorId: string;
  slug: string;
  category:
    | "good-morning" | "good-night" | "mothers-day" | "fathers-day"
    | "wedding" | "new-baby" | "get-well-soon" | "good-luck"
    | "housewarming" | "diwali" | "sinhala-tamil-new-year";
  template: WiszTemplate;

  recipientName: string;
  recipientNickname?: string;
  senderName: string;

  mainMessage: string;
  mainPhotoUrl: string | null;
  memories: WiszMemory[];

  musicUrl: string | null;
  musicType: "builtin" | "custom" | null;

  accentColor?: string;
  hasWatermark: boolean;

  status: "draft" | "published" | "opened" | "completed";
  createdAt: string;
  updatedAt: string;
}

export type WishEventType = "opened" | "music_started" | "interaction" | "message_revealed" | "completed";

export interface WiszTemplateProps {
  wish: WiszWish;
  onEvent?: (type: WishEventType) => void;
}
