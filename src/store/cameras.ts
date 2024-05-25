export const CAMERAS = {
  ORBIT_CAMERA: 'orbit',
} as const;

export type CameraName = typeof CAMERAS[keyof typeof CAMERAS];