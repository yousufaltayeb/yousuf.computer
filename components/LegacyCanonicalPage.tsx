import Link from "next/link";

interface LegacyCanonicalPageProps {
  targetPath: string;
  title?: string;
  lang?: "ar" | "en";
}

export default function LegacyCanonicalPage({
  targetPath,
  title = "This page moved",
  lang = "en",
}: LegacyCanonicalPageProps) {
  const isRtl = lang === "ar";

  return (
    <section className="min-h-[55vh] pt-16 sm:pt-24 pb-20 intro-animation">
      <script
        dangerouslySetInnerHTML={{
          __html: `window.location.replace(${JSON.stringify(targetPath)});`,
        }}
      />
      <h1
        className="text-4xl mb-4"
        lang={lang}
        dir={isRtl ? "rtl" : "ltr"}
      >
        <bdi dir="auto">{title}</bdi>
      </h1>
      <p className="text-2xl max-w-[720px] text-contrast-shaded mb-8">
        The current version is now under the canonical site structure.
      </p>
      <Link href={targetPath} className="more-link text-base">
        Continue <span className="arrow">&rarr;</span>
      </Link>
    </section>
  );
}
