const SITE = "Harmedino";

/** React 19 hoists <title> to <head>; this keeps the format consistent. */
export function pageTitle(title?: string) {
  return title ? `${title} · ${SITE}` : `${SITE} — Stories worth reading`;
}
