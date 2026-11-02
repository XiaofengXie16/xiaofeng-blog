type Props<T extends string> = {
  /** Accessible name for the group, e.g. "Filter by topic". */
  label: string;
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  /** Visible text for an option; defaults to the option itself. */
  optionLabel?: (option: T) => string;
  /** "wrap" flows onto more lines; "scroll" keeps one row that scrolls sideways. */
  layout?: "wrap" | "scroll";
};

/** A glass row of toggle pills for filtering a list; the active pill is filled. */
export function FilterPills<T extends string>({
  label,
  options,
  value,
  onChange,
  optionLabel = (option) => option,
  layout = "wrap",
}: Props<T>) {
  const row =
    layout === "wrap"
      ? "flex-wrap rounded-[30px]"
      : "max-w-full flex-nowrap overflow-x-auto rounded-full";

  return (
    <div role="group" aria-label={label} className={`glass flex gap-1.5 self-start p-2 ${row}`}>
      {options.map((option) => (
        <button
          key={option}
          type="button"
          aria-pressed={value === option}
          onClick={() => onChange(option)}
          className={`min-h-11 shrink-0 cursor-pointer rounded-full border-0 px-[18px] font-sans text-sm font-medium whitespace-nowrap ${
            value === option
              ? "bg-ink text-white"
              : "bg-transparent text-ink-soft hover:bg-white/40"
          }`}
        >
          {optionLabel(option)}
        </button>
      ))}
    </div>
  );
}
