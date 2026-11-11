import { buildCalendar, calendarStats, levelClass, monthLabels } from "./calendarUtils";

export default function SubmissionCalendar({ daily }) {
  const weeks = buildCalendar(daily);
  const { total, activeDays, maxStreak } = calendarStats(weeks);
  const labels = monthLabels(weeks);

  return (
    <div className="mx-4 mb-5 bg-slate-800 border border-slate-200 rounded-xl p-4">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <p className="text-gray-300">
          <span className="text-2xl font-bold text-white">{total}</span> submissions in the past year
        </p>
        <p className="text-gray-400 text-sm">
          Total active days: <span className="font-bold text-gray-200">{activeDays}</span>
          <span className="ml-4">
            Max streak: <span className="font-bold text-gray-200">{maxStreak}</span>
          </span>
        </p>
      </div>

      <div className="overflow-x-auto">
        <div  className="flex" style={{ gap: 3, minWidth: 690, width: "100%" }}>
          {weeks.map((week, i) => (
            <div key={i} className="flex flex-col" style={{ gap: 3, flex: "1 1 0", minWidth: 10, maxWidth: 18 }}>
              {week.map((cell) => (
                <div
                  key={cell.date}
                  title={
                    cell.count === null
                      ? ""
                      : `${cell.count} submission${cell.count === 1 ? "" : "s"} on ${cell.date}`
                  }
                  className={`rounded-sm ${levelClass(cell.count)}`}
                  style={{ width: "100%", aspectRatio: "1 / 1" }}
                />
              ))}
              <div className="relative text-xs text-gray-400" style={{ width: "100%", height: 14 }}>
                <span className="absolute left-0 whitespace-nowrap">{labels[i]}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}