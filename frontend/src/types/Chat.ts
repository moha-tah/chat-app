import type { User } from "./User";

export interface Chat {
  id: number;
  title: string;
  description: string;
  date: Date;
  duration: number;
  creator: User;
}
