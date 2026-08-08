"use client";

import { create } from "zustand";
import type { SessionRuntime } from "@/lib/adaptive/session";

type Store = {
  runtime: SessionRuntime | null;
  coachMessage: string;
  showCalm: boolean;
  transitionWarning: string | null;
  setRuntime: (runtime: SessionRuntime | null) => void;
  setCoachMessage: (msg: string) => void;
  setShowCalm: (v: boolean) => void;
  setTransitionWarning: (msg: string | null) => void;
};

export const useSessionStore = create<Store>((set) => ({
  runtime: null,
  coachMessage: "Hi. I am Lumi. We can learn together.",
  showCalm: false,
  transitionWarning: null,
  setRuntime: (runtime) => set({ runtime }),
  setCoachMessage: (coachMessage) => set({ coachMessage }),
  setShowCalm: (showCalm) => set({ showCalm }),
  setTransitionWarning: (transitionWarning) => set({ transitionWarning }),
}));
