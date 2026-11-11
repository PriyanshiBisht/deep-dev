const pad = (n) => String(n).padStart(2, "0");

// Local-date key like "2026-11-09" (NOT toISOString, which is UTC and can shift the day)
export const toKey = (d) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

// Builds the calendar as an array of weeks; each week has 7 cells (Sun..Sat).
// `daily` looks like [{ date: "2026-11-09", count: 3 }, ...]
export function buildCalendar(daily, today = new Date()) {
  const counts = {};
  daily.forEach((d) => {
    counts[d.date] = d.count;
  });

  const end = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const start = new Date(end);
  start.setDate(end.getDate() - end.getDay() - 52 * 7); // Sunday, 52 weeks back

  const weeks = [];
  const cursor = new Date(start);
  while (cursor <= end) {
    const week = [];
    for (let i = 0; i < 7; i++) {
      const isFuture = cursor > end;
      week.push({
        date: toKey(cursor),
        count: isFuture ? null : counts[toKey(cursor)] || 0,
        month: cursor.getMonth(),
      });
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push(week);
  }
  return weeks;
}

// The three numbers shown above the calendar
export function calendarStats(weeks) {
  const days = weeks.flat().filter((c) => c.count !== null);
  const total = days.reduce((sum, c) => sum + c.count, 0);
  const activeDays = days.filter((c) => c.count > 0).length;

  let maxStreak = 0;
  let run = 0;
  days.forEach((c) => {
    run = c.count > 0 ? run + 1 : 0;
    maxStreak = Math.max(maxStreak, run);
  });
  return { total, activeDays, maxStreak };
}

// Shade of green by how many submissions that day
export function levelClass(count) {
  if (count === null) return "invisible";
  if (count === 0) return "bg-slate-700";
  if (count === 1) return "bg-green-900";
  if (count <= 3) return "bg-green-700";
  if (count <= 6) return "bg-green-500";
  return "bg-green-400";
}

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// One label per week column: the month name when a new month starts
export function monthLabels(weeks) {
  const labels = weeks.map((week, i) =>
    i === 0 || week[0].month !== weeks[i - 1][0].month ? MONTHS[week[0].month] : ""
  );
  if (labels[0] && labels[1]) labels[0] = ""; // avoid overlapping labels at the left edge
  return labels;
}