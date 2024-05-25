import { create } from "zustand";
import { CameraName } from "./cameras";


export interface AppStore {
  canvas?: HTMLCanvasElement
  activeCamera: CameraName
}

export const useApp = create<AppStore>(() => {
  const store: AppStore = {
    canvas: undefined,
    activeCamera: "orbit"
  }

  return store
})