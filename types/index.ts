// User Type
export interface User {
  id: string;
  avatar: string;
  name: string;
}
// Message Type
export interface Message {
  id: string;
  userId: string;
  createdAt: Date;
  text: string;
}
export type AsyncState = null | "loading" | "error" | "complete";
export type SocialPlatforms = "twitter" | "facebook";
