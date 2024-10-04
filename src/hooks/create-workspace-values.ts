import { create } from "zustand";

type CreateWorkSpaceValues = {
  name: string;
  imageUrl: string;
  updateImageUrl: (url: string) => void;
  updateValues: (values: Partial<CreateWorkSpaceValues>) => void;
  currStep: number;
  setCurrStep: (step: number) => void;
};

export const userCreateWorkspaceValues = create<CreateWorkSpaceValues>(
  (set) => ({
    name: "",
    imageUrl: "",
    updateValues: (values) => set(values),
    updateImageUrl: (url) => set({ imageUrl: url }),
    currStep: 1,
    setCurrStep: (step) => set({ currStep: step }),
  })
);
