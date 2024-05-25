import { useEffect, useState } from "react";
import { useThree } from "@react-three/fiber";
import { SRGBColorSpace, TextureLoader, WebGLCubeRenderTarget } from "three";

export const Stars = () => {
  const [cubeTexture, setCubeTexture] = useState(null);

  const { gl, scene } = useThree();

  useEffect(() => {
    const loader = new TextureLoader();
    loader.load("/experiment-earth-assets/starmap_g4k.jpg", (texture) => {
      texture.colorSpace = SRGBColorSpace;
      const cubeRenderTarget = new WebGLCubeRenderTarget(texture.image.height);
      cubeRenderTarget.fromEquirectangularTexture(gl as any, texture);
      setCubeTexture(cubeRenderTarget.texture as any);
    });
  }, [gl]);

  useEffect(() => {
    if (cubeTexture) {
      scene.background = cubeTexture;
    }
  }, [cubeTexture, scene]);

  return null;
};
