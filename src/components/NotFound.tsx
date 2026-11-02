import { Link } from "@tanstack/react-router";
import { ArrowRight } from "./design/Section";
import { SkyMessage, pillButtonClass } from "./design/SkyMessage";

/** Site-wide 404, rendered inside the layout for any unknown URL. */
export function NotFound() {
  return (
    <SkyMessage
      kicker="this page drifted off"
      title="Page not found"
      action={
        <Link to="/" className={pillButtonClass}>
          Take me home <ArrowRight />
        </Link>
      }
    >
      <p className="m-0 text-lg text-ink-soft">
        There's nothing at this address. It may have moved, or it never existed.
      </p>
    </SkyMessage>
  );
}
