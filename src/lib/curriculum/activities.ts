import { nanoid } from "nanoid";
import phonics from "../../../content/reading/phonics.json";
import writing from "../../../content/writing/writing.json";
import math from "../../../content/math/math.json";
import themes from "../../../content/themes/packs.json";
import type {
  InterestPack,
  Modality,
  PlannedItem,
  PolicyDecision,
  ScaffoldLevel,
} from "../adaptive/types";

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

function themePack(theme: InterestPack) {
  return themes[theme];
}

function withScaffoldHint(text: string, scaffold: ScaffoldLevel, hint?: string): string {
  if (scaffold === "independent") return text;
  if (scaffold === "guided") return hint ? `${text}\nHint: ${hint}` : text;
  return hint ? `${text}\nModel: ${hint}` : text;
}

export function buildActivity(decision: PolicyDecision): PlannedItem {
  const theme = decision.theme;
  const pack = themePack(theme);
  const base = {
    id: nanoid(8),
    skillId: decision.skillId,
    domain: decision.domain,
    activityKind: decision.activityKind,
    modality: decision.modality,
    scaffold: decision.scaffold,
    theme,
  };

  switch (decision.activityKind) {
    case "phoneme_match": {
      const item = pick(phonics.phoneme_match);
      return {
        ...base,
        prompt: withScaffoldHint(item.prompt, decision.scaffold, `Listen for /${item.targetSound}/`),
        data: { ...item, speakSound: item.targetSound },
      };
    }
    case "blend": {
      const item = pick(phonics.blend);
      return {
        ...base,
        prompt: withScaffoldHint(
          "Blend the sounds to make a word.",
          decision.scaffold,
          `Say ${item.sounds.join("-")} → ${item.word}`
        ),
        data: { ...item, options: shuffle([item.word, item.word + "s", "map", "sun"]).slice(0, 3) },
      };
    }
    case "decode": {
      const list =
        (phonics.decode as Record<string, string[]>)[decision.skillId] ??
        phonics.decode["read.phonics.cvc"];
      const word = pick(list);
      const options = shuffle([word, tweak(word), tweak(word), "the"]).slice(0, 3);
      return {
        ...base,
        prompt: withScaffoldHint(`Read this word: ${word}`, decision.scaffold, stretch(word)),
        data: { word, options, answer: word },
      };
    }
    case "fluency": {
      const passage = pick(phonics.fluency);
      return {
        ...base,
        prompt: withScaffoldHint(
          `Read: ${passage.title}`,
          decision.scaffold,
          "Tap a word if you need help. Then tap Done."
        ),
        data: { ...passage },
      };
    }
    case "comprehension": {
      const item = pick(phonics.comprehension);
      return {
        ...base,
        prompt: withScaffoldHint(item.question, decision.scaffold, "Look back at the passage."),
        data: { ...item },
      };
    }
    case "letter_trace": {
      const letters =
        decision.skillId.includes("upper")
          ? writing.letters.filter((l) => l.letter === l.letter.toUpperCase() && l.letter.length === 1 && /[A-Z]/.test(l.letter))
          : writing.letters.filter((l) => /[a-z]/.test(l.letter));
      const item = pick(letters.length ? letters : writing.letters);
      return {
        ...base,
        prompt: withScaffoldHint(
          `Trace the letter ${item.letter}`,
          decision.scaffold,
          item.pathHint
        ),
        data: { ...item },
      };
    }
    case "spelling_ccc": {
      const list =
        (writing.spelling as Record<string, string[]>)[decision.skillId] ??
        writing.spelling["write.spelling.cvc"];
      const word = pick(list);
      return {
        ...base,
        prompt: withScaffoldHint(
          "Cover, copy, compare: spell the word.",
          decision.scaffold,
          `The word is ${word}`
        ),
        data: { word, phase: "see" },
      };
    }
    case "sentence_build": {
      const frame = pick(writing.sentence_frames);
      return {
        ...base,
        prompt: withScaffoldHint(
          `Build a sentence. Theme: ${pack.label}`,
          decision.scaffold,
          frame.example
        ),
        data: { ...frame },
      };
    }
    case "short_response": {
      const item = pick(writing.short_responses);
      return {
        ...base,
        prompt: withScaffoldHint(item.prompt, decision.scaffold, item.powHints.join(" → ")),
        data: { ...item },
      };
    }
    case "number_sense": {
      const item = pick(math.number_sense) as {
        prompt: string;
        count?: number;
        options?: number[];
        a?: number;
        b?: number;
        answer?: number;
        value?: number;
      };
      const answer =
        item.answer ?? item.count ?? item.value ?? (item.a !== undefined ? item.a : 0);
      const options =
        item.options ??
        shuffle([answer, answer + 1, Math.max(0, answer - 2)]).slice(0, 3);
      return {
        ...base,
        prompt: withScaffoldHint(item.prompt, decision.scaffold, "Count carefully."),
        data: { ...item, answer, options },
      };
    }
    case "ten_frame": {
      const item = pick(math.ten_frames);
      return {
        ...base,
        prompt: withScaffoldHint(
          item.prompt.replace("ten frame", `${pack.label.toLowerCase()} frame`),
          decision.scaffold,
          `Target: ${item.value}`
        ),
        data: { ...item, emoji: pack.emoji },
      };
    }
    case "operation": {
      const candidates = math.operations.filter(
        (o) => o.skill === decision.skillId || decision.skillId.startsWith("math.ops")
      );
      const item = pick(candidates.length ? candidates : math.operations);
      return {
        ...base,
        prompt: withScaffoldHint(
          `Solve: ${item.a} ${item.op} ${item.b} = ?`,
          decision.scaffold,
          item.op === "+"
            ? "Add the parts."
            : item.op === "-"
              ? "Take away."
              : item.op === "*"
                ? "Think equal groups."
                : "Share into equal groups."
        ),
        data: { ...item },
      };
    }
    case "fact_fluency": {
      const item = pick(math.facts);
      return {
        ...base,
        prompt: withScaffoldHint(`Quick fact: ${item.a} ${item.op} ${item.b}`, decision.scaffold),
        data: { ...item, timed: decision.scaffold === "independent" },
      };
    }
    case "word_problem": {
      const candidates = math.word_problems.filter((w) => w.skill === decision.skillId);
      const item = pick(candidates.length ? candidates : math.word_problems);
      const name = pick(pack.names);
      const text = item.template
        .replaceAll("{name}", name)
        .replaceAll("{a}", String(item.a))
        .replaceAll("{b}", String(item.b))
        .replaceAll("{item}", pack.item);
      return {
        ...base,
        prompt: withScaffoldHint(text, decision.scaffold, `Schema: ${item.schema}`),
        data: {
          ...item,
          text,
          name,
          itemLabel: pack.item,
          emoji: pack.emoji,
        },
      };
    }
    case "placement_probe":
    default: {
      if (decision.domain === "math") {
        return buildActivity({ ...decision, activityKind: "operation" });
      }
      if (decision.domain === "writing") {
        return buildActivity({ ...decision, activityKind: "spelling_ccc" });
      }
      return buildActivity({ ...decision, activityKind: "decode" });
    }
  }
}

function tweak(word: string): string {
  if (word.length < 2) return word + "a";
  const i = Math.floor(Math.random() * word.length);
  const letters = "aeioubcdfg";
  const chars = word.split("");
  chars[i] = letters[(letters.indexOf(chars[i]!) + 1) % letters.length]!;
  return chars.join("");
}

function stretch(word: string): string {
  return word.split("").join("-");
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

export function modalityLabel(m: Modality): string {
  const labels: Record<Modality, string> = {
    visual: "Look",
    audio: "Listen",
    avatar: "Lumi talks",
    video_model: "Watch model",
    manipulative: "Move pieces",
    typing: "Type",
    speak: "Speak",
  };
  return labels[m];
}
