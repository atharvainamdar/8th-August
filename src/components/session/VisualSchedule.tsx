export function VisualSchedule({
  items,
  currentIndex,
}: {
  items: string[];
  currentIndex: number;
}) {
  return (
    <div className="lumi-card p-4" aria-label="Visual schedule">
      <p className="m-0 mb-3 text-sm font-semibold uppercase tracking-wide text-[color:var(--muted)]">
        Now / Next / Then
      </p>
      <ol className="m-0 flex list-none flex-wrap gap-2 p-0">
        {items.map((label, i) => {
          const state =
            i === currentIndex ? "Now" : i === currentIndex + 1 ? "Next" : i > currentIndex ? "Then" : "Done";
          return (
            <li
              key={`${label}-${i}`}
              className="rounded-2xl px-3 py-2 text-sm font-semibold"
              style={{
                background:
                  i === currentIndex
                    ? "var(--primary)"
                    : i < currentIndex
                      ? "#dceadf"
                      : "#eef3f0",
                color: i === currentIndex ? "white" : "var(--fg)",
                opacity: i < currentIndex ? 0.7 : 1,
              }}
            >
              <span className="mr-2 opacity-80">{state}</span>
              {label}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
