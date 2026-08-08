"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ActivityResult, PlannedItem } from "@/lib/adaptive/types";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";

const CHOICE_KINDS = new Set([
  "operation",
  "fact_fluency",
  "word_problem",
  "number_sense",
  "phoneme_match",
  "blend",
  "decode",
  "comprehension",
  "placement_probe",
]);

export function ActivityRenderer({
  item,
  onResult,
  soundEnabled,
}: {
  item: PlannedItem;
  onResult: (result: ActivityResult) => void;
  soundEnabled: boolean;
}) {
  const started = useRef(Date.now());
  const [hintsUsed, setHintsUsed] = useState(0);
  const [text, setText] = useState("");
  const [selected, setSelected] = useState<string | number | null>(null);
  const [tenCount, setTenCount] = useState(0);
  const [covered, setCovered] = useState(false);
  const [traceDone, setTraceDone] = useState(false);

  useEffect(() => {
    started.current = Date.now();
    setHintsUsed(0);
    setText("");
    setSelected(null);
    setTenCount(0);
    setCovered(false);
    setTraceDone(false);
  }, [item.id]);

  const speak = (value: string) => {
    if (!soundEnabled || typeof window === "undefined" || !window.speechSynthesis) return;
    const u = new SpeechSynthesisUtterance(value);
    u.rate = 0.9;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  };

  const finish = (
    correct: boolean,
    response?: string,
    partial = 1,
    metrics?: Record<string, number | string>
  ) => {
    onResult({
      skillId: item.skillId,
      activityKind: item.activityKind,
      modality: item.modality,
      scaffold: item.scaffold,
      correct,
      partial,
      latencyMs: Date.now() - started.current,
      response,
      hintsUsed,
      metrics,
    });
  };

  const data = item.data as Record<string, unknown>;
  const options = useMemo(() => {
    if (Array.isArray(data.options)) return data.options as Array<string | number>;
    return [] as Array<string | number>;
  }, [data.options]);

  const checkChoiceOrInput = () => {
    const response = options.length ? selected : text.trim();
    const expected = data.answer ?? data.word ?? data.value ?? data.count;
    if (expected === undefined || expected === null) {
      finish(Boolean(response), String(response ?? ""), 0.6);
      return;
    }
    const ok =
      String(response).toLowerCase() === String(expected).toLowerCase() ||
      Number(response) === Number(expected);
    finish(ok, String(response ?? ""));
  };

  return (
    <Card className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="lumi-chip">Skill: {item.skillId.split(".").slice(-1)[0]}</span>
        <span className="lumi-chip">Mode: {item.modality}</span>
        <span className="lumi-chip">Help: {item.scaffold}</span>
      </div>
      <h2 className="m-0 whitespace-pre-wrap text-2xl font-bold leading-snug">{item.prompt}</h2>

      {(item.modality === "audio" || item.modality === "avatar" || item.modality === "speak") && (
        <Button
          type="button"
          variant="secondary"
          onClick={() => speak(item.prompt.split("\n")[0] || item.prompt)}
        >
          Play voice
        </Button>
      )}

      {item.activityKind === "comprehension" && typeof data.passage === "string" && (
        <p className="rounded-2xl bg-[#eef5f1] p-4 text-lg leading-relaxed">{data.passage}</p>
      )}

      {item.activityKind === "fluency" && typeof data.text === "string" && (
        <div className="space-y-3">
          <p className="rounded-2xl bg-[#eef5f1] p-4 text-xl leading-relaxed tracking-wide">
            {data.text}
          </p>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="secondary" onClick={() => speak(String(data.text))}>
              Listen to passage
            </Button>
            <Button
              type="button"
              onClick={() =>
                finish(true, "read", 0.85, {
                  words: String(data.text).split(/\s+/).length,
                })
              }
            >
              I finished reading
            </Button>
          </div>
        </div>
      )}

      {item.activityKind === "ten_frame" && (
        <div className="space-y-3">
          <div className="grid max-w-xs grid-cols-5 gap-2">
            {Array.from({ length: 20 }).map((_, i) => (
              <button
                key={i}
                type="button"
                className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-[color:var(--border)] text-xl"
                style={{ background: i < tenCount ? "#cde7df" : "white" }}
                onClick={() => setTenCount((c) => (i + 1 === c ? c - 1 : i + 1))}
                aria-label={`Counter ${i + 1}`}
              >
                {i < tenCount ? String(data.emoji ?? "●") : ""}
              </button>
            ))}
          </div>
          <p className="m-0 text-lg font-semibold">You showed: {tenCount}</p>
          <Button
            type="button"
            onClick={() => finish(tenCount === Number(data.value), String(tenCount))}
          >
            Check
          </Button>
        </div>
      )}

      {item.activityKind === "letter_trace" && (
        <div className="space-y-3">
          <div className="flex h-40 w-40 items-center justify-center rounded-3xl border-4 border-dashed border-[color:var(--primary)] text-7xl font-bold">
            {String(data.letter)}
          </div>
          <p className="text-[color:var(--muted)]">
            Trace with your finger on the letter. Then tap Done.
          </p>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              setTraceDone(true);
              setHintsUsed((h) => h + 1);
            }}
          >
            Show model path
          </Button>
          <Button
            type="button"
            onClick={() => finish(true, String(data.letter), traceDone ? 0.8 : 1)}
          >
            Done tracing
          </Button>
        </div>
      )}

      {item.activityKind === "spelling_ccc" && (
        <div className="space-y-3">
          {!covered ? (
            <>
              <p className="text-4xl font-bold tracking-[0.2em]">{String(data.word)}</p>
              <Button type="button" onClick={() => setCovered(true)}>
                Cover word
              </Button>
            </>
          ) : (
            <>
              <input
                className="w-full rounded-2xl border-2 border-[color:var(--border)] px-4 py-3 text-2xl"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type the word"
                autoComplete="off"
              />
              <Button
                type="button"
                onClick={() =>
                  finish(
                    text.trim().toLowerCase() === String(data.word).toLowerCase(),
                    text.trim()
                  )
                }
              >
                Compare
              </Button>
            </>
          )}
        </div>
      )}

      {(item.activityKind === "sentence_build" || item.activityKind === "short_response") && (
        <div className="space-y-3">
          {Array.isArray(data.bank) && (
            <div className="flex flex-wrap gap-2">
              {(data.bank as string[]).map((w) => (
                <button
                  key={w}
                  type="button"
                  className="lumi-chip"
                  onClick={() => setText((t) => (t ? `${t} ${w}` : w))}
                >
                  {w}
                </button>
              ))}
            </div>
          )}
          <textarea
            className="min-h-28 w-full rounded-2xl border-2 border-[color:var(--border)] px-4 py-3 text-xl"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write or build your answer"
          />
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                const SpeechRecognition =
                  // @ts-expect-error webkit speech API
                  window.SpeechRecognition || window.webkitSpeechRecognition;
                if (!SpeechRecognition) {
                  setHintsUsed((h) => h + 1);
                  return;
                }
                const rec = new SpeechRecognition();
                rec.onresult = (ev: {
                  results: { [key: number]: { [key: number]: { transcript: string } } };
                }) => {
                  setText(ev.results[0]![0]!.transcript);
                };
                rec.start();
              }}
            >
              Speak to write
            </Button>
            <Button
              type="button"
              onClick={() => {
                const ok = text.trim().split(/\s+/).length >= 3;
                finish(ok, text.trim(), ok ? 1 : 0.4);
              }}
            >
              Submit
            </Button>
          </div>
        </div>
      )}

      {item.activityKind === "number_sense" && typeof data.count === "number" && (
        <div className="flex flex-wrap gap-2 text-3xl">
          {Array.from({ length: Number(data.count) }).map((_, i) => (
            <span key={i}>●</span>
          ))}
        </div>
      )}

      {item.activityKind === "word_problem" && (
        <div className="rounded-2xl bg-[#eef5f1] p-4 text-lg">
          <p className="m-0 mb-2 font-semibold">Schema: {String(data.schema)}</p>
          <p className="m-0">Use drawings or counting if you need.</p>
        </div>
      )}

      {CHOICE_KINDS.has(item.activityKind) && (
        <div className="space-y-3">
          {options.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-3">
              {options.map((opt) => (
                <button
                  key={String(opt)}
                  type="button"
                  className="lumi-btn lumi-btn-secondary text-xl"
                  style={{
                    borderColor: selected === opt ? "var(--primary)" : "transparent",
                    background: selected === opt ? "#d7efe7" : undefined,
                  }}
                  onClick={() => setSelected(opt)}
                >
                  {String(opt)}
                </button>
              ))}
            </div>
          ) : (
            <input
              className="w-full rounded-2xl border-2 border-[color:var(--border)] px-4 py-3 text-2xl"
              value={text}
              onChange={(e) => setText(e.target.value)}
              inputMode="numeric"
              placeholder="Type your answer"
            />
          )}
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setHintsUsed((h) => h + 1);
                if (typeof data.answer !== "undefined") speak(String(data.answer));
              }}
            >
              Hint
            </Button>
            <Button type="button" onClick={checkChoiceOrInput}>
              Check
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() =>
                onResult({
                  skillId: item.skillId,
                  activityKind: item.activityKind,
                  modality: item.modality,
                  scaffold: item.scaffold,
                  correct: false,
                  latencyMs: Date.now() - started.current,
                  hintsUsed,
                  skipped: true,
                })
              }
            >
              Skip
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
