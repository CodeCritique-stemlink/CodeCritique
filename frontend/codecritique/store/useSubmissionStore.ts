import { create } from "zustand";

interface SubmissionState {
    title: string;
    description: string;
    githubUrl : string;

    resetForm : ()=> void

}

export const useSubmissionStore = create<SubmissionState>((set) => ({
  title: "",
  description: "",
  githubUrl: "",

  setTitle: (title: any) => set({ title }),

  setDescription: (description: any) => set({ description }),

  setGithubUrl: (githubUrl: any) => set({ githubUrl }),

  resetForm: () =>
    set({
      title: "",
      description: "",
      githubUrl: "",
    }),
}));