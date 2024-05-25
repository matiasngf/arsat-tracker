import { useApp } from "@/store";
import { CAMERAS, CameraName } from "@/store/cameras";
import { useControls } from "leva";

export const Debug = () => {
  useControls(() => ({
    Camera: {
      value: CAMERAS.ORBIT_CAMERA,
      options: CAMERAS,
      onChange: (value: CameraName) => {
        useApp.setState({ activeCamera: value });
      },
    },
  }));

  return null;
};
