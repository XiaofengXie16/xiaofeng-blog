// Single structured logger for the app: one JSON line per event, so server logs
// are queryable by field instead of parsed out of prose. Server functions, the
// server routes and the error boundary all emit through this module.
//
// Two levels only: `info` for normal operations (including degraded-but-served
// outcomes) and `error` for failures a human needs to look at. Event names are
// constant strings; every dynamic value lives in `fields`, because interpolating
// values into the name fragments the template the event is clustered under.

type LogFields = Record<string, unknown>;

const isServer = typeof window === "undefined";

function errorFields(error: unknown): LogFields | undefined {
  if (error instanceof Error) {
    return {
      errorName: error.name,
      errorMessage: error.message,
      // Stacks stay on the server; in the browser console they are only noise
      // for a reader who already has the error in hand.
      ...(isServer && error.stack ? { errorStack: error.stack } : {}),
    };
  }

  if (typeof error === "string") {
    return { errorMessage: error };
  }

  if (error === undefined || error === null) {
    return undefined;
  }

  // A non-Error throwable: keep whatever shape it has rather than the
  // "[object Object]" its default stringification would produce.
  try {
    return { errorMessage: JSON.stringify(error) ?? "unserializable thrown value" };
  } catch {
    return { errorMessage: "unserializable thrown value" };
  }
}

function emit(level: "info" | "error", event: string, fields: LogFields): void {
  const record: LogFields = { time: new Date().toISOString(), level, event, ...fields };

  let line: string;
  try {
    line = JSON.stringify(record);
  } catch {
    // A logger must never throw on the failure path it was added to observe.
    line = JSON.stringify({ time: record.time, level, event, serializationFailed: true });
  }

  if (level === "error") console.error(line);
  else console.info(line);
}

export const logInfo = (event: string, fields: LogFields = {}): void => emit("info", event, fields);

export const logError = (event: string, fields: LogFields = {}, error?: unknown): void =>
  emit("error", event, { ...fields, ...errorFields(error) });
