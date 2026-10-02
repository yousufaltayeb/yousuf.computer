import { join } from "node:path";
import sharp from "sharp";

export const socialImageSize = { width: 1200, height: 630 };

interface SocialImageOptions {
  title: string;
  label?: string;
  lang?: "en" | "ar";
}

const fonts = {
  en: { family: "Departure Mono", file: "DepartureMono-Regular.ttf" },
  ar: { family: "thmanyah serif text Bold", file: "ThmanyahSerifText-Bold.ttf" },
};

function escapeMarkup(text: string) {
  return text.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;",
  })[character]!);
}

async function renderText(
  text: string,
  lang: "en" | "ar",
  size: number,
  color: string,
  width = 1056,
) {
  const font = fonts[lang];
  // Pango shapes the complete paragraph, including Arabic/Latin bidi runs.
  // Its default start alignment follows the paragraph's writing direction.
  return sharp({
    text: {
      text: `<span foreground="${color}">${lang === "ar"
        ? text.split(/([A-Za-z][A-Za-z0-9]*)/g).map((part) =>
            /^[A-Za-z]/.test(part)
              ? `<span font_family="Departure Mono" weight="normal">${escapeMarkup(part)}</span>`
              : escapeMarkup(part),
          ).join("")
        : escapeMarkup(text)}</span>`,
      font: `${font.family} ${size}`,
      fontfile: join(process.cwd(), "app/fonts", font.file),
      width,
      align: "left",
      wrap: "word-char",
      spacing: Math.round(size * 0.2),
      rgba: true,
    },
  }).png().toBuffer({ resolveWithObject: true });
}

export async function createSocialImage({
  title,
  label = "Full-stack & backend engineer · Riyadh, Saudi Arabia",
  lang = "en",
}: SocialImageOptions) {
  const isArabic = lang === "ar";
  // Register the bundled Latin font before shaping mixed-language titles.
  const brand = await renderText("yousuf >", "en", 24, "#f7f5f1");
  // Fit measured glyphs rather than guessing from character count.
  let titleSize = isArabic ? 88 : 76;
  let heading = await renderText(title, lang, titleSize, "#dfff56");
  while (heading.info.height > 260 && titleSize > 24) {
    titleSize -= 2;
    heading = await renderText(title, lang, titleSize, "#dfff56");
  }
  if (heading.info.height > 260) {
    throw new Error("Social image title exceeds the available space");
  }

  const [domain, caption, author, arabicAuthor] = await Promise.all([
    renderText("yousuf.computer", "en", 24, "#d2d6c5"),
    renderText(label, "en", 22, "#d2d6c5"),
    renderText("Yousuf Altayeb", "en", 24, "#f7f5f1"),
    renderText("يوسف الطيب", "ar", 28, "#d2d6c5"),
  ]);
  const decorations = Buffer.from(`<svg width="1200" height="630">
    <rect x="72" y="124" width="1056" height="1" fill="#55534c"/>
    <rect x="${isArabic ? 1064 : 72}" y="162" width="64" height="8" fill="#dfff56"/>
    <rect x="72" y="522" width="1056" height="1" fill="#55534c"/>
  </svg>`);
  const png = await sharp({
    create: { ...socialImageSize, channels: 4, background: "#282725" },
  }).composite([
    { input: decorations, top: 0, left: 0 },
    { input: brand.data, top: 64, left: 72 },
    { input: domain.data, top: 64, left: 1128 - domain.info.width },
    { input: heading.data, top: 196 + Math.floor((260 - heading.info.height) / 2), left: isArabic ? 1128 - heading.info.width : 72 },
    { input: caption.data, top: 486, left: isArabic ? 1128 - caption.info.width : 72 },
    { input: author.data, top: 556, left: 72 },
    { input: arabicAuthor.data, top: 550, left: 1128 - arabicAuthor.info.width },
  ]).png().toBuffer();

  return new Response(new Uint8Array(png), {
    headers: { "Content-Type": "image/png" },
  });
}
