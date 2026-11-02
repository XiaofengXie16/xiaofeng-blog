import type { ReactNode } from "react";
import { Grain } from "./Atmosphere";

/** The dark pill button used for a message's way out ("Take me home"). */
export const pillButtonClass =
  "inline-flex min-h-[52px] items-center gap-2.5 rounded-full bg-ink px-[26px] font-medium text-white no-underline hover:bg-indigo-deep";

/**
 * A full-width dusk sky with a handwritten note, a title and a way out. Used
 * for the 404, missing posts and the error screen.
 */
export function SkyMessage({
  kicker,
  title,
  children,
  action,
  className = "",
}: {
  kicker: string;
  title: string;
  /** Body copy and any extra detail under the title. */
  children?: ReactNode;
  action: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`relative overflow-hidden bg-linear-to-b from-[#A3ADEC] to-[#F5D2B5] px-5 pt-48 pb-32 text-center ${className}`}
    >
      <Grain />
      <div className="relative mx-auto flex max-w-xl flex-col items-center gap-6">
        <p className="glow m-0 -rotate-2 font-hand text-4xl text-[#F4F7FF]">{kicker}</p>
        <h1 className="m-0 text-5xl font-medium tracking-[-0.04em] text-olive sm:text-6xl">
          {title}
        </h1>
        {children}
        {action}
      </div>
    </section>
  );
}
