import { OrbitControls, PerspectiveCamera } from "@react-three/drei";

import { useApp } from "@/store";
import { useEffect, useMemo, useState } from "react";
import {
  HalfFloatType,
  Scene,
  PerspectiveCamera as ThreePerspectiveCamera,
} from "three";
import { RenderTexture } from "../components/render-texture";
import { useUniforms } from "../hooks/use-uniforms";
import { createPortal, useFrame, useThree } from "@react-three/fiber";
// import { EffectComposer } from "three/examples/jsm/Addons.js";
import {
  RenderUniforms,
  defaultRenderUniforms,
  drawMaterial,
  drawPass,
} from "../utils/draw-pass";
import { Earth } from "../components/earth";
import { Stars } from "../components/stars";
import { Sun } from "../components/sun";
import { ArsatScene } from "../components/arsat/arsat-scene";
import {
  EffectComposer,
  BloomEffect,
  EffectPass,
  VignetteEffect,
  RenderPass,
} from "postprocessing";

// Clones of the camera that will be injected into each scene
const innerCameras = {
  arsat: new ThreePerspectiveCamera(),
  earth: new ThreePerspectiveCamera(),
  sun: new ThreePerspectiveCamera(),
} as const;

export const MainScene = () => {
  const gl = useThree((s) => s.gl);

  const [_, setRenderUniforms] = useUniforms<RenderUniforms>(
    defaultRenderUniforms,
    {
      syncShader: drawMaterial,
    }
  );

  const renderer = useMemo(() => {
    const composer = new EffectComposer(gl, {
      frameBufferType: HalfFloatType,
    });

    composer.addPass(drawPass);

    composer.addPass(
      new EffectPass(
        undefined,
        new BloomEffect({
          mipmapBlur: true,
          intensity: 10,
          levels: 6,
          luminanceThreshold: 0.71,
        })
      )
    );

    composer.addPass(new EffectPass(undefined, new VignetteEffect({})));

    return {
      composer,
      drawPass,
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

      innerCameras.sun.aspect = camera.aspect;
      innerCameras.sun.updateProjectionMatrix();
    }
    renderer.composer.setSize(width, height);
  }, [width, height, renderer, camera]);

  useFrame(({ clock }) => {
    if (camera) {
      innerCameras.arsat.position.copy(camera.position);
      innerCameras.arsat.quaternion.copy(camera.quaternion);
      innerCameras.arsat.fov = camera.fov;

      innerCameras.earth.position.set(0.5, 0, 1.5);
      innerCameras.earth.quaternion.copy(camera.quaternion);
      innerCameras.earth.fov = camera.fov;

      innerCameras.sun.position.set(0, 0, 0);
      innerCameras.sun.quaternion.copy(camera.quaternion);
      innerCameras.sun.fov = camera.fov;

      const t = clock.getElapsedTime() * 0.02;
      const x = Math.sin(t) * 0.3 + 0.8;
      const y = Math.cos(t * 0.5) * 0.3 - 0.2;
      innerCameras.earth.position.set(x, y, 1.5);
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
        <ArsatScene />
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
        <Earth />
        <ambientLight intensity={1} />
      </RenderTexture>

      <RenderTexture
        toneMappingExposure={10}
        width={width}
        height={height}
        camera={innerCameras.sun}
        onMapTexture={(sunFbo) => {
          setRenderUniforms({ sunFbo });
        }}
      >
        <primitive object={innerCameras.sun} />
        <Stars />
        <Sun />
      </RenderTexture>
    </>
  );
};
