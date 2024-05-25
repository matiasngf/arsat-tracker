import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Mesh, Vector3 } from "three";
import { create } from "zustand";

export interface SunStore {
  sunDirection: Vector3;
  sunPosition: Vector3;
  setSunDirection: (direction: Vector3) => void;
}

export const useSun = create<SunStore>((set) => {
  const store: SunStore = {
    sunDirection: new Vector3(),
    sunPosition: new Vector3(),
    setSunDirection: (direction) => {
      store.sunDirection.copy(direction);
      store.sunPosition.copy(direction).multiplyScalar(10);
    },
  };

  return store;
});

export const Sun = () => {
  const meshRef = useRef<Mesh>(null);

  const sunPosition = useSun((state) => state.sunPosition);
  const setSunDirection = useSun((state) => state.setSunDirection);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 0.1;
    const x = Math.sin(t);
    const z = Math.cos(t);
    setSunDirection(new Vector3(-x, 0, z).normalize());

    if (meshRef.current) {
      meshRef.current.position.copy(sunPosition);
    }
  });

  return (
    <mesh ref={meshRef as any} position={sunPosition as any}>
      <sphereGeometry args={[0.1, 32, 32]} />
      <meshStandardMaterial
        color="#ffffff"
        emissive="#fff2a8"
        emissiveIntensity={10}
        toneMapped={false}
      />
    </mesh>
  );
};
