"use client";

import { Resize, useGLTF } from "@react-three/drei";
import { GroupProps } from "@react-three/fiber";
import { useMemo } from "react";
import {
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
} from "three";

const baseMaterial = new MeshPhysicalMaterial({
  color: 0xffffff,
  metalness: 0.8,
});
const pannelMaterial = new MeshPhysicalMaterial({ color: 0x0000ff });

useGLTF.preload("/arsat.glb");

export function Arsat(props: GroupProps) {
  const { scene } = useGLTF("/arsat.glb");

  useMemo(() => {
    scene.traverse((child) => {
      if ("material" in child) {
        if (child.name === "paneles") {
          child.material = pannelMaterial;
          return;
        }
        child.material = baseMaterial;
      }
    });
  }, [scene]);

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
