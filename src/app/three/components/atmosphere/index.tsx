import { BackSide } from "three";
import { atmosphereFragmentShader, atmosphereVertexShader } from "./shaders";
import { useSun } from "../sun";

const verteces = Math.pow(2, 9);

export const Atmosphere = () => {
  const sunDirection = useSun((state) => state.sunDirection);

  return (
    <mesh>
      <sphereGeometry args={[1.04, verteces, verteces]} />
      <shaderMaterial
        side={BackSide}
        vertexShader={atmosphereVertexShader}
        fragmentShader={atmosphereFragmentShader}
        transparent
        uniforms={{
          lightDirection: { value: sunDirection },
        }}
      />
    </mesh>
  );
};
