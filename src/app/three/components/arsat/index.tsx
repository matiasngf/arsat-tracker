"use client";

import { Resize, useGLTF, useTexture } from "@react-three/drei";
import { GroupProps, useThree } from "@react-three/fiber";
import { useMemo } from "react";
import { MeshPhysicalMaterial, WebGLCubeRenderTarget } from "three";

const baseMaterial = new MeshPhysicalMaterial({
  color: 0xffffff,
  metalness: 1,
  roughness: 0.07,
  envMapIntensity: 1,
});
const pannelMaterial = new MeshPhysicalMaterial({
  color: 0x0000aa,
  metalness: 0.8,
  roughness: 0.5,
});

useGLTF.preload("/arsat.glb");

export function Arsat(props: GroupProps) {
  const { scene } = useGLTF("/arsat.glb");
  const gl = useThree((state) => state.gl);

  const t = useTexture("/experiment-earth-assets/starmap_g4k.jpg");

  const envMap = useMemo(() => {
    const cubeRenderTarget = new WebGLCubeRenderTarget(t.image.height);
    cubeRenderTarget.fromEquirectangularTexture(gl as any, t as any);
    return cubeRenderTarget;
  }, [t, gl]);

  useMemo(() => {
    baseMaterial.envMap = envMap.texture;
    baseMaterial.needsUpdate = true;
    pannelMaterial.envMap = envMap.texture;
    pannelMaterial.needsUpdate = true;
    scene.traverse((child) => {
      if ("material" in child) {
        if (child.name === "paneles") {
          child.material = pannelMaterial;
          return;
        }
        child.material = baseMaterial;
      }
    });
  }, [scene, envMap]);

  return (
    <group {...props}>
      <group scale={[10, 10, 10]}>
        <Resize>
          <primitive object={scene} />
        </Resize>
      </group>
    </group>
  );
}
