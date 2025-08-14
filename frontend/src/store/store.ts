import { create } from "zustand";

export type Point = { x: number; y: number };

export type RunDetail = {
  id: string;
  n: number;
  m: number;
  p: number;
  matrix: number[][];
  minFuel: number;
  path: { x: number; y: number }[];
  createdAt: string;
};

export type HistoryItem = {
  id: string;
  createdAt: string;
  n: number;
  m: number;
  p: number;
  minFuel: number;
};

type State = {
  selectedRun: RunDetail | null;
  setSelectedRun: (run: RunDetail | null) => void;

  n: number;
  m: number;
  p: number;
  matrixText: string;
  setInputs: (next: {
    n?: number;
    m?: number;
    p?: number;
    matrixText?: string;
  }) => void;

  historyItems: HistoryItem[];
  setHistory: (items: HistoryItem[]) => void;
  prependHistory: (item: HistoryItem) => void;
};

export const useTreasureStore = create<State>((set) => ({
  selectedRun: null,
  setSelectedRun: (run) => set({ selectedRun: run }),

  n: 3,
  m: 3,
  p: 3,
  matrixText: "3 2 2\n2 2 2\n2 2 1",
  setInputs: (next) =>
    set((s) => ({
      n: next.n ?? s.n,
      m: next.m ?? s.m,
      p: next.p ?? s.p,
      matrixText: next.matrixText ?? s.matrixText,
    })),

  historyItems: [],
  setHistory: (items) => set({ historyItems: items }),
  prependHistory: (item) =>
    set((s) => ({ historyItems: [item, ...s.historyItems] })),
}));
