import { create } from "zustand";

type SubmissionStore = {
  title: string;
  description: string;
  githubUrl: string;
  criteria: string[];

  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setGithubUrl: (githubUrl: string) => void;
  setCriteria: (criteria: string[]) => void;
};

export const useSubmissionStore = create<SubmissionStore>((set) => ({
  title: "",
  description: "",
  githubUrl: "",
  criteria: ["", "", ""],

  setTitle: (title) => set({ title }),
  setDescription: (description) => set({ description }),
  setGithubUrl: (githubUrl) => set({ githubUrl }),
  setCriteria: (criteria) => set({ criteria }),
}));