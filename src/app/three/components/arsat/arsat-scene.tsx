import { DirectionalLight } from "three";
import { Arsat } from ".";
import { useSun } from "../sun";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export const ArsatScene = () => {
  const sunDirection = useSun((state) => state.sunDirection);

  const lightRef = useRef<DirectionalLight>(null!);

  useFrame(() => {
    if (lightRef.current) {
      lightRef.current.position.copy(sunDirection).multiplyScalar(2);
    }
  });

  return (
    <>
      <Arsat />
      <directionalLight ref={lightRef as any} intensity={2} />
      <ambientLight intensity={1} />
    </>
  );
};
