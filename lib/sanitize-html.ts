const ALLOWED_TAGS = new Set([
  "a",
  "b",
  "blockquote",
  "br",
  "em",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "i",
  "li",
  "ol",
  "p",
  "strong",
  "u",
  "ul",
]);

const ALLOWED_ATTRS = new Set(["href", "rel", "target"]);

export function sanitizeHtml(html: string) {
  return html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/\son\w+=(["']).*?\1/gi, "")
    .replace(/\son\w+=([^\s>]+)/gi, "")
    .replace(/\sstyle=(["']).*?\1/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/<([a-z0-9-]+)([^>]*)>/gi, (_full, rawTag: string, rawAttrs: string) => {
      const tag = rawTag.toLowerCase();

      if (!ALLOWED_TAGS.has(tag)) {
        return "";
      }

      const safeAttrs = Array.from(
        rawAttrs.matchAll(/([a-zA-Z-:]+)\s*=\s*(["'])(.*?)\2/g)
      )
        .map(([, attrName, , attrValue]) => {
          const name = attrName.toLowerCase();
          const value = attrValue.trim();

          if (!ALLOWED_ATTRS.has(name)) {
            return "";
          }

          if (name === "href" && !/^(https?:\/\/|mailto:|\/)/i.test(value)) {
            return "";
          }

          if (name === "target") {
            return ' target="_blank"';
          }

          if (name === "rel") {
            return ' rel="noopener noreferrer"';
          }

          return ` ${name}="${escapeHtml(value)}"`;
        })
        .filter(Boolean)
        .join("");

      return tag === "a" && !safeAttrs.includes(' rel="noopener noreferrer"')
        ? `<${tag}${safeAttrs} rel="noopener noreferrer">`
        : `<${tag}${safeAttrs}>`;
    })
    .replace(/<\/([a-z0-9-]+)>/gi, (_full, rawTag: string) => {
      const tag = rawTag.toLowerCase();
      return ALLOWED_TAGS.has(tag) ? `</${tag}>` : "";
    });
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
