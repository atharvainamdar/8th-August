"use client";

export function speakText(
  text: string,
  opts: { rate?: number; pitch?: number; enabled?: boolean } = {}
): Promise<void> {
  if (opts.enabled === false) return Promise.resolve();
  if (typeof window === "undefined" || !window.speechSynthesis) {
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    const u = new SpeechSynthesisUtterance(text);
    u.rate = opts.rate ?? 0.92;
    u.pitch = opts.pitch ?? 1.05;
    u.onend = () => resolve();
    u.onerror = () => resolve();
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  });
}

export function stopSpeaking() {
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

type RecognitionLike = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((ev: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: ((ev: unknown) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

export function listenOnce(timeoutMs = 8000): Promise<string> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("No window"));
      return;
    }
    const SR =
      // @ts-expect-error vendor speech recognition
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      reject(new Error("Speech recognition not supported"));
      return;
    }
    const rec = new SR() as RecognitionLike;
    rec.lang = "en-US";
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    let done = false;
    const timer = setTimeout(() => {
      if (!done) {
        done = true;
        try {
          rec.stop();
        } catch {
          /* ignore */
        }
        reject(new Error("Listening timed out"));
      }
    }, timeoutMs);
    rec.onresult = (ev) => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      const text = ev.results?.[0]?.[0]?.transcript ?? "";
      resolve(text.trim());
    };
    rec.onerror = () => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      reject(new Error("Could not hear speech"));
    };
    rec.onend = () => {
      if (!done) {
        done = true;
        clearTimeout(timer);
        reject(new Error("Listening ended"));
      }
    };
    rec.start();
  });
}

export function scoreReadAloud(expected: string, heard: string): {
  correct: boolean;
  partial: number;
  matched: number;
  total: number;
} {
  const norm = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter(Boolean);
  const a = norm(expected);
  const b = new Set(norm(heard));
  const matched = a.filter((w) => b.has(w)).length;
  const total = Math.max(1, a.length);
  const partial = matched / total;
  return { correct: partial >= 0.75, partial, matched, total };
}
