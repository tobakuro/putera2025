import { create } from 'zustand';

type State = {
  score: number;
  addScore: (n: number) => void;
};

export const useGameStore = create<State>((set) => ({
  score: 0,
  addScore: (n) => set((s) => ({ score: s.score + n })),
}));

export default useGameStore;
