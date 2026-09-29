// Styles for anything that is an answer. Inside a `group/study` wrapper with
// data-hide="true" (the "Hide answers" switch) the text disappears and the
// chip turns into a plain grey placeholder.
export const HIDE = "group-data-[hide=true]/study:bg-muted group-data-[hide=true]/study:text-transparent group-data-[hide=true]/study:select-none group-data-[hide=true]/study:[&_*]:invisible";

export const ANSWER_TEXT = `${HIDE} rounded bg-amber-500/15 px-1.5 py-px font-semibold text-amber-700 dark:text-amber-300`;
export const ANSWER_TRUE = `${HIDE} inline-flex h-5 shrink-0 items-center rounded-full bg-emerald-500/15 px-2.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300`;
export const ANSWER_FALSE = `${HIDE} inline-flex h-5 shrink-0 items-center rounded-full bg-red-500/15 px-2.5 text-xs font-semibold text-red-700 dark:text-red-300`;
