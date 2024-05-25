import { AddEquation, Vector3 } from "three";
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
  const sunPosition = useSun((state) => state.sunPosition);

  const setSunDirection = useSun((state) => state.setSunDirection);

  setSunDirection(new Vector3(1, 0, 0.2).normalize());

  return (
    <mesh position={sunPosition as any}>
      <sphereGeometry args={[0.2, 32, 32]} />
      <meshStandardMaterial
        color="#ffffff"
        emissive="orange"
        emissiveIntensity={10}
        toneMapped={true}
        blendEquation={AddEquation}
      />
    </mesh>
  );
};
