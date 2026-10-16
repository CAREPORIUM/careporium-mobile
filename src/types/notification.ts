import type { Href } from "expo-router";

export type AppNotification = {
  id: string;
  title: string;
  message: string;
  time: string; // optional detail line such as the shift date; empty when there is none
  unread: boolean;
  actionLabel?: string;
  actionHref?: Href;
};