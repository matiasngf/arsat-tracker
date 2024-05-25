import { OrbitControls, PerspectiveCamera } from "@react-three/drei";

import { useApp } from "@/store";
import { useEffect, useMemo, useState } from "react";
import type { Camera, Texture } from "three";
import {
  PerspectiveCamera as ThreePerspectiveCamera,
  Vector3,
  WebGLRenderTarget,
} from "three";
import { Arsat } from "@/app/three/components/arsat";
import { RenderTexture } from "../components/render-texture";
import { useUniforms } from "../hooks/use-uniforms";
import { useFrame, useThree } from "@react-three/fiber";
import {
  EffectComposer,
  FXAAShader,
  ShaderPass,
} from "three/examples/jsm/Addons.js";
import {
  RenderUniforms,
  defaultRenderUniforms,
  drawPass,
} from "../utils/draw-pass";
import { Earth } from "../components/earth";

// Clones of the camera that will be injected into each scene
const innerCameras = {
  arsat: new ThreePerspectiveCamera(),
  earth: new ThreePerspectiveCamera(),
} as const;

export const MainScene = () => {
  const gl = useThree((s) => s.gl);

  const [_, setRenderUniforms] = useUniforms<RenderUniforms>(
    defaultRenderUniforms,
    {
      syncShader: drawPass,
    }
  );

  const renderer = useMemo(() => {
    const composer = new EffectComposer(gl as any);
    composer.addPass(drawPass as any);
    const fxaaPass = new ShaderPass(FXAAShader);
    composer.addPass(fxaaPass);

    return {
      composer,
      drawPass,
      fxaaPass,
    };
  }, [gl]);
  const [camera, setCamera] = useState<ThreePerspectiveCamera | undefined>(
    undefined
  );

  const activeCamera = useApp((s) => s.activeCamera);

  const width = useThree((s) => s.size.width);
  const height = useThree((s) => s.size.height);

  useEffect(() => {
    if (camera) {
      innerCameras.arsat.aspect = camera.aspect;
      innerCameras.arsat.updateProjectionMatrix();
      innerCameras.earth.aspect = camera.aspect;
      innerCameras.earth.updateProjectionMatrix();
    }
    renderer.composer.setSize(width, height);
  }, [width, height, renderer, camera]);

  useFrame(() => {
    if (camera) {
      innerCameras.arsat.position.copy(camera.position);
      innerCameras.arsat.quaternion.copy(camera.quaternion);
      innerCameras.arsat.fov = camera.fov;

      innerCameras.earth.position.set(0.5, 0, 1.5);
      innerCameras.earth.quaternion.copy(camera.quaternion);
      innerCameras.earth.fov = camera.fov;
    }

    renderer.composer.render();
  }, 1);

  return (
    <>
      <PerspectiveCamera
        attach={"camera"}
        makeDefault={activeCamera === "orbit"}
        position={[0, 5, 10]}
        ref={(r) => {
          r && setCamera(r as ThreePerspectiveCamera);
        }}
      />
      <OrbitControls camera={camera as any} />

      <RenderTexture
        width={width}
        height={height}
        camera={innerCameras.arsat}
        onMapTexture={(arsatFbo) => {
          setRenderUniforms({ arsatFbo });
        }}
      >
        <primitive object={innerCameras.arsat} />
        <Arsat />
        <directionalLight position={[1, 0.5, 0]} intensity={2} />
        <ambientLight intensity={1} />
      </RenderTexture>

      <RenderTexture
        width={width}
        height={height}
        camera={innerCameras.earth}
        onMapTexture={(earthFbo) => {
          setRenderUniforms({ earthFbo });
        }}
      >
        <primitive object={innerCameras.earth} />
        <Earth lightDirection={new Vector3(1, 0.5, 0)} />
        <ambientLight intensity={1} />
      </RenderTexture>
    </>
  );
};
