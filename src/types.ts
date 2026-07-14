export interface HashtagData {
  trending: string[];
  viral: string[];
  niche: string[];
  lowCompetition: string[];
  highReach: string[];
  popularityScores: Record<string, number>;
  explanation: string;
}

export interface CaptionData {
  captions: {
    text: string;
    engagementHook: string;
    suggestedTags: string[];
  }[];
}

export interface TitleData {
  titles: {
    title: string;
    ctrStrategy: string;
  }[];
}

export interface KeywordData {
  keywords: string[];
  contentIdeas: {
    title: string;
    format: string;
    outline: string;
  }[];
}

export interface HistoryItem {
  id: string;
  type: "hashtag" | "caption" | "title" | "keyword";
  topic: string;
  timestamp: number;
  data: any;
}

export interface FavoriteItem {
  id: string;
  type: "hashtag" | "caption" | "title" | "keyword";
  topic: string;
  content: string; // The specific hashtag or caption text, or JSON
  timestamp: number;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  category: string;
  date: string;
  author: string;
  readTime: string;
  imageUrl?: string;
}

export interface UserStats {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isPremium: boolean;
  generationsCount: number;
  maxGenerations: number;
  joinedAt: string;
  plan?: string;
}
