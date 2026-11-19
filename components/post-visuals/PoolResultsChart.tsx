interface Round {
  p95: number;
  dropped?: number;
}

interface Setup {
  shape: string;
  route: string;
  postgresConnections: number;
  rounds: Round[];
  note?: string;
}

/** k6 at a constant 1,700 req/s for 30 s against a 2-CPU Postgres; p95 in ms. */
const TESTS: Record<"direct" | "bouncer", { title: string; setups: Setup[] }> = {
  direct: {
    title: "الاختبار الأول: التطبيق يشبك مع Postgres مباشرة",
    setups: [
      {
        shape: "3 × 10",
        route: "مباشر",
        postgresConnections: 30,
        rounds: [{ p95: 64 }, { p95: 76 }, { p95: 20 }],
      },
      {
        shape: "5 × 10",
        route: "مباشر",
        postgresConnections: 50,
        rounds: [{ p95: 628, dropped: 1283 }, { p95: 139 }, { p95: 275, dropped: 170 }],
      },
      {
        shape: "5 × 4",
        route: "مباشر",
        postgresConnections: 20,
        rounds: [{ p95: 53 }, { p95: 8 }, { p95: 5 }],
      },
      {
        shape: "5 × 30",
        route: "مباشر",
        postgresConnections: 150,
        rounds: [{ p95: 991, dropped: 1456 }],
        note: "تشغيلة واحدة",
      },
    ],
  },
  bouncer: {
    title: "الاختبار الثاني: مع PgBouncer وبدونه",
    setups: [
      {
        shape: "3 × 10",
        route: "مباشر",
        postgresConnections: 30,
        rounds: [{ p95: 7 }, { p95: 103, dropped: 2 }, { p95: 77 }],
      },
      {
        shape: "5 × 10",
        route: "مباشر",
        postgresConnections: 50,
        rounds: [
          { p95: 174, dropped: 15 },
          { p95: 310, dropped: 247 },
          { p95: 609, dropped: 939 },
        ],
      },
      {
        shape: "5 × 4",
        route: "مباشر",
        postgresConnections: 20,
        rounds: [{ p95: 5 }, { p95: 119, dropped: 67 }, { p95: 6 }],
      },
      {
        shape: "5 × 10",
        route: "عبر PgBouncer",
        postgresConnections: 12,
        rounds: [{ p95: 157, dropped: 128 }, { p95: 5 }, { p95: 5 }],
      },
      {
        shape: "5 × 30",
        route: "عبر PgBouncer",
        postgresConnections: 12,
        rounds: [{ p95: 16 }, { p95: 6 }, { p95: 188, dropped: 258 }],
      },
    ],
  },
};

const AXIS_MIN = 3;
const AXIS_MAX = 1500;
const GRID = [5, 10, 50, 100, 500, 1000];
const LABELLED = [10, 100, 1000];
const ROUND_OFFSETS = ["28%", "50%", "72%"];

const position = (ms: number) =>
  `${(Math.log(ms / AXIS_MIN) / Math.log(AXIS_MAX / AXIS_MIN)) * 100}%`;

const count = (value: number) => value.toLocaleString("en-US");

/** Every round of the pool load test as a dot on a log p95 axis, with the raw values beside it. */
export default function PoolResultsChart({ test }: { test: "direct" | "bouncer" }) {
  const { title, setups } = TESTS[test];

  return (
    <figure className="my-10 rounded-md border border-contrast/15 bg-base-shaded p-4 sm:p-6">
      <div className="text-lg font-bold">{title}</div>
      <div className="mt-1 text-sm text-contrast/75">
        p95 للـ latency بالـ millisecond، مقياس لوغاريتمي. كل نقطة جولة واحدة،
        والأقرب لليسار أسرع.
      </div>

      <div className="mt-5 flex flex-col gap-4">
        {setups.map((setup) => (
          <div
            key={`${setup.shape}-${setup.route}`}
            className="grid gap-x-4 gap-y-1 sm:grid-cols-[9.5rem_1fr]"
          >
            <div className="flex items-baseline gap-2 sm:block">
              <div className="font-mono text-sm" dir="ltr">
                {setup.shape}
              </div>
              <div className="text-xs leading-snug text-contrast/75">
                {setup.route}
                {"\u200F"}، <span className="font-mono">{setup.postgresConnections}</span> على
                Postgres
                {setup.note ? ` (${setup.note})` : ""}
              </div>
            </div>

            <div dir="ltr">
              <div className="relative h-10 rounded-sm bg-base">
                <GridLines />
                {setup.rounds.map((round, index) => (
                  <span
                    key={index}
                    title={`Round ${index + 1}: ${round.p95} ms${
                      round.dropped ? `, ${count(round.dropped)} dropped` : ""
                    }`}
                    className={`absolute size-3 -translate-x-1/2 -translate-y-1/2 border border-stone bg-acid ${
                      round.dropped ? "rotate-45 rounded-[1px]" : "rounded-full"
                    }`}
                    style={{ left: position(round.p95), top: ROUND_OFFSETS[index] }}
                  />
                ))}
              </div>
              <div className="mt-1 flex flex-wrap gap-x-3 font-mono text-xs text-contrast/85">
                {setup.rounds.map((round, index) => (
                  <span key={index}>
                    {round.dropped ? "◆ " : ""}
                    {round.p95} ms
                    {round.dropped ? ` (${count(round.dropped)})` : ""}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}

        <div className="grid gap-x-4 sm:grid-cols-[9.5rem_1fr]" aria-hidden="true">
          <div />
          <div className="relative h-4 font-mono text-[11px] text-contrast/70" dir="ltr">
            {LABELLED.map((tick) => (
              <span
                key={tick}
                className="absolute -translate-x-1/2"
                style={{ left: position(tick) }}
              >
                {tick}
              </span>
            ))}
          </div>
        </div>
      </div>

      <figcaption className="mt-4 flex flex-col gap-1 text-sm leading-relaxed text-contrast/75">
        <span className="inline-flex items-center gap-2">
          <span className="size-3 shrink-0 rounded-full border border-stone bg-acid" />
          جولة كل الـ requests فيها اتنفذت
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="size-3 shrink-0 rotate-45 rounded-[1px] border border-stone bg-acid" />
          جولة فيها dropped requests، وعددها بين القوسين
        </span>
        <span>
          k6 بمعدل ثابت 1,700 request في الثانية لمدة 30 ثانية، و Postgres على 2 CPU.
        </span>
      </figcaption>
    </figure>
  );
}

function GridLines() {
  return (
    <>
      {GRID.map((tick) => (
        <span
          key={tick}
          aria-hidden="true"
          className={`absolute inset-y-0 w-px ${
            LABELLED.includes(tick) ? "bg-contrast/25" : "bg-contrast/10"
          }`}
          style={{ left: position(tick) }}
        />
      ))}
    </>
  );
}
