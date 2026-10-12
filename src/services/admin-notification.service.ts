import { AppNotification } from "@/types/notification";

// Mock admin notifications. Swap for a real API call once the backend has one.
export function getAdminNotifications(): AppNotification[] {
  return [
    {
      id: "a1",
      title: "New worker verification",
      message: "A nurse submitted licence, ID and education documents for review.",
      time: "Today · 9:40 AM WAT",
      unread: true,
      actionLabel: "Review submission",
      actionHref: "/admin/verify",
    },
    {
      id: "a2",
      title: "Facility awaiting approval",
      message: "A new facility uploaded its registration documents.",
      time: "Today · 8:15 AM WAT",
      unread: true,
      actionLabel: "Open queue",
      actionHref: "/admin/verify",
    },
    {
      id: "a3",
      title: "Attendance dispute opened",
      message: "A worker and a facility disagree about a completed shift.",
      time: "Yesterday · 5:20 PM WAT",
      unread: false,
      actionLabel: "View disputes",
      actionHref: "/admin/disputes",
    },
    {
      id: "a4",
      title: "Daily activity summary",
      message: "Review yesterday's sign-ups, verifications and shift activity.",
      time: "Yesterday · 7:00 AM WAT",
      unread: false,
      actionLabel: "View activity",
      actionHref: "/admin/activity",
    },
  ];
}