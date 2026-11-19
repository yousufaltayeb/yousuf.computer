"use client";

import { useId, useState } from "react";

const CPUS = 2;
const PRESETS: Array<[containers: number, pool: number]> = [
  [3, 10],
  [5, 10],
  [5, 4],
  [5, 30],
];

const formatRatio = (value: number) =>
  Number.isInteger(value) ? String(value) : value.toFixed(1);

/**
 * Worst-case arithmetic for app containers that each own a Postgres pool: how
 * many connections can reach a 2-CPU database at once, with or without
 * PgBouncer in between. Illustrative only — no latency is simulated.
 */
export default function PoolSimulator({ bouncer = false }: { bouncer?: boolean }) {
  const [containers, setContainers] = useState(bouncer ? 5 : 3);
  const [pool, setPool] = useState(10);
  const [serverPool, setServerPool] = useState(12);

  const total = containers * pool;
  const reach = bouncer ? Math.min(total, serverPool) : total;
  const queued = total - reach;
  const onCpu = Math.min(reach, CPUS);

  return (
    <figure className="my-10 rounded-md border border-contrast/15 bg-base-shaded p-4 sm:p-6">
      <div className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
        <Slider
          label="عدد الـ containers"
          value={containers}
          min={1}
          max={8}
          onChange={setContainers}
        />
        <Slider
          label="حجم الـ pool لكل container"
          value={pool}
          min={1}
          max={30}
          onChange={setPool}
        />
        {bouncer && (
          <Slider
            label="connections من PgBouncer إلى Postgres"
            value={serverPool}
            min={2}
            max={30}
            onChange={setServerPool}
          />
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2" dir="ltr">
        {PRESETS.map(([presetContainers, presetPool]) => {
          const active = presetContainers === containers && presetPool === pool;
          return (
            <button
              key={`${presetContainers}x${presetPool}`}
              type="button"
              aria-pressed={active}
              onClick={() => {
                setContainers(presetContainers);
                setPool(presetPool);
              }}
              className={`rounded border px-2.5 py-1 font-mono text-xs ${
                active
                  ? "border-contrast bg-contrast text-[var(--base)]"
                  : "border-contrast/30 text-contrast hover:border-contrast"
              }`}
            >
              {presetContainers} × {presetPool}
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex flex-col items-center gap-2">
        <StageLabel>backend containers</StageLabel>
        <div className="flex flex-wrap justify-center gap-2" dir="ltr" aria-hidden="true">
          {Array.from({ length: containers }, (_, index) => (
            <div
              key={index}
              className="rounded border border-contrast/25 bg-base p-2"
            >
              <div className="mb-1.5 font-mono text-[10px] text-contrast/70">
                app {index + 1}
              </div>
              <div className="grid grid-cols-5 gap-[3px]">
                {Array.from({ length: pool }, (_, dot) => (
                  <span key={dot} className="size-1.5 bg-contrast/45" />
                ))}
              </div>
            </div>
          ))}
        </div>

        <Flow count={total} />

        {bouncer && (
          <>
            <div className="w-full max-w-md rounded border border-dashed border-contrast/40 bg-base p-3">
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-mono text-sm" dir="ltr">
                  PgBouncer
                </span>
                <span className="text-sm text-contrast/80">
                  مستنية هنا: <Num>{queued}</Num>
                </span>
              </div>
              {queued > 0 && (
                <div
                  className="mt-2 flex flex-wrap gap-[3px]"
                  dir="ltr"
                  aria-hidden="true"
                >
                  {Array.from({ length: queued }, (_, dot) => (
                    <span key={dot} className="size-1.5 bg-contrast/45" />
                  ))}
                </div>
              )}
            </div>
            <Flow count={reach} />
          </>
        )}

        <div className="w-full max-w-md rounded border border-contrast/40 bg-base p-3">
          <div className="flex items-center justify-between gap-3" dir="ltr">
            <span className="font-mono text-sm">Postgres</span>
            <span className="flex gap-1.5" aria-hidden="true">
              {Array.from({ length: CPUS }, (_, cpu) => (
                <span
                  key={cpu}
                  className="rounded-sm border border-contrast/50 px-1.5 py-0.5 font-mono text-[10px]"
                >
                  CPU
                </span>
              ))}
            </span>
          </div>
          <div className="mt-3 flex flex-wrap gap-1" dir="ltr" aria-hidden="true">
            {Array.from({ length: reach }, (_, dot) => (
              <span
                key={dot}
                className={`size-2.5 rounded-full border ${
                  dot < onCpu
                    ? "border-stone bg-acid"
                    : "border-contrast/60 bg-transparent"
                }`}
              />
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-contrast/80">
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2.5 rounded-full border border-stone bg-acid" />
              شغالة على CPU
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2.5 rounded-full border border-contrast/60" />
              بتزاحم على CPU جوه Postgres
            </span>
          </div>
        </div>
      </div>

      <div className="mt-5 text-[1.05rem] leading-relaxed" aria-live="polite">
        {bouncer ? (
          <>
            التطبيق مسموح له بـ <Num>{total}</Num> connection. اللي بيوصل Postgres
            منها <Num>{reach}</Num>
            {queued > 0 ? (
              <>
                ، والـ <Num>{queued}</Num> الباقية مستنية في PgBouncer.
              </>
            ) : (
              <>، وما في حاجة مستنية في PgBouncer.</>
            )}
          </>
        ) : (
          <>
            لو كل الـ pools اتملت: <Num>{total}</Num> query جوه Postgres في نفس
            اللحظة على <Num>{CPUS}</Num> CPU
            {reach > CPUS ? (
              <>
                ، يعني <Num>{formatRatio(reach / CPUS)}</Num> query على كل CPU.
              </>
            ) : (
              <>، وكل query لاقية CPU.</>
            )}
          </>
        )}
      </div>

      <figcaption className="mt-3 text-sm leading-relaxed text-contrast/70">
        الرسم بيحسب أسوأ حالة (كل الـ connections مشغولة في نفس اللحظة). هو
        توضيح للفكرة، ما قياس.
      </figcaption>
    </figure>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  const id = useId();

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <label htmlFor={id}>{label}</label>
        <output htmlFor={id} className="font-mono">
          {value}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-1 h-6 w-full cursor-pointer accent-[var(--accent)]"
      />
    </div>
  );
}

function StageLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-mono text-xs text-contrast/70" dir="ltr">
      {children}
    </div>
  );
}

function Flow({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-2 font-mono text-xs text-contrast/80" dir="ltr">
      <span aria-hidden="true">↓</span>
      <span>
        {count} connection{count === 1 ? "" : "s"}
      </span>
    </div>
  );
}

function Num({ children }: { children: React.ReactNode }) {
  return <span className="font-mono font-bold">{children}</span>;
}
