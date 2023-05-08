export interface User {
  id: string;
  avatar: string;
  name: string;
}
export interface Message {
  id: string;
  user_id: string;
  created_at: Date;
  message: string;
  author_is_user: boolean;
  persona_id: string;
}
export type AsyncState = null | "loading" | "error" | "complete";
export type SocialPlatforms = "twitter" | "facebook";
