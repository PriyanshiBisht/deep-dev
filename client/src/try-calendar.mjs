import { buildCalendar, calendarStats } from "./calendarUtils.js";

// Pretend today is 10 Nov 2026 and we have these submissions
const today = new Date(2026, 10, 10);
const daily = [
  { date: "2026-11-10", count: 2 },
  { date: "2026-11-09", count: 1 },
  { date: "2026-11-08", count: 5 },
  { date: "2026-11-05", count: 1 },
  { date: "2026-11-04", count: 1 },
  { date: "2025-11-20", count: 3 },
];

const weeks = buildCalendar(daily, today);
console.log("number of weeks:", weeks.length);
console.log("first square:", weeks[0][0].date);
console.log("last week:", weeks[weeks.length - 1].map((c) => `${c.date}:${c.count}`).join("  "));
console.log("stats:", calendarStats(weeks));