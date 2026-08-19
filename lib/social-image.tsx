import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const socialImageSize = {
  width: 1200,
  height: 630,
};

interface SocialImageOptions {
  title: string;
  label?: string;
  lang?: "en" | "ar";
}

export async function createSocialImage({
  title,
  label = "Software engineer · Riyadh, Saudi Arabia",
  lang = "en",
}: SocialImageOptions) {
  const [departureMono, thmanyahText] = await Promise.all([
    readFile(join(process.cwd(), "app/fonts/DepartureMono-Regular.ttf")),
    readFile(join(process.cwd(), "app/fonts/ThmanyahSerifText-Bold.ttf")),
  ]);

  const isArabic = lang === "ar";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          background: "#282725",
          color: "#f7f5f1",
          padding: "64px 72px",
          border: "2px solid #343330",
        }}
      >
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 64,
            left: 72,
            right: 72,
            alignItems: "center",
            justifyContent: "space-between",
            fontFamily: "Departure Mono",
            fontSize: 24,
          }}
        >
          <span>yousuf &gt;</span>
          <span style={{ color: "#d2d6c5" }}>yousuf.computer</span>
        </div>

        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 170,
            left: 72,
            right: 72,
            flexDirection: "column",
            gap: 28,
            height: 300,
            justifyContent: "center",
            maxWidth: 1050,
            alignItems: isArabic ? "flex-end" : "flex-start",
            alignSelf: isArabic ? "flex-end" : "flex-start",
            textAlign: isArabic ? "right" : "left",
          }}
        >
          <div
            style={{
              width: 108,
              height: 10,
              display: "flex",
              background: "#dfff56",
            }}
          />
          <div
            style={{
              display: "flex",
              color: "#dfff56",
              fontFamily: isArabic ? "Thmanyah Text" : "Departure Mono",
              fontSize: isArabic
                ? title.length > 62
                  ? 46
                  : 58
                : title.length > 62
                  ? 54
                  : title.length > 38
                    ? 64
                    : 76,
              lineHeight: isArabic ? 0.95 : 1.12,
              letterSpacing: isArabic ? 0 : -2,
              flexDirection: isArabic ? "row-reverse" : "row",
              flexWrap: "wrap",
              justifyContent: isArabic ? "flex-start" : "flex-start",
            }}
          >
            {isArabic
              ? title.split(/\s+/).map((word, index) => (
                  <span
                    key={`${word}-${index}`}
                    style={{
                      fontFamily: /[\u0600-\u06ff]/.test(word)
                        ? "Thmanyah Text"
                        : "Departure Mono",
                      marginLeft: 18,
                    }}
                  >
                    {word}
                  </span>
                ))
              : title}
          </div>
          <div
            style={{
              display: "flex",
              color: "#d2d6c5",
              fontFamily: "Departure Mono",
              fontSize: 25,
            }}
          >
            {label}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            position: "absolute",
            bottom: 64,
            left: 72,
            alignItems: "center",
            gap: 14,
            fontSize: 24,
          }}
        >
          <span style={{ fontFamily: "Departure Mono" }}>Yousuf Altayeb</span>
          <span style={{ color: "#d2d6c5", fontFamily: "Departure Mono" }}>/</span>
          <span style={{ fontFamily: "Thmanyah Text" }}>
            يوسف الطيب
          </span>
        </div>
      </div>
    ),
    {
      ...socialImageSize,
      fonts: [
        {
          name: "Departure Mono",
          data: departureMono,
          style: "normal",
          weight: 400,
        },
        {
          name: "Thmanyah Text",
          data: thmanyahText,
          style: "normal",
          weight: 700,
        },
      ],
    },
  );
}
