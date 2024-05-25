import { Sphere } from "@react-three/drei";
import { SRGBColorSpace, TextureLoader, Vector3 } from "three";
import { GroupProps, useFrame, useLoader } from "@react-three/fiber";

import { earthFragmentShader, earthVertexShader } from "./shaders";
import { useEffect, useRef } from "react";
import { Atmosphere } from "../atmosphere";

const verteces = Math.pow(2, 9);

export interface EarthProps {
  lightDirection: Vector3;
}

export const Earth = ({
  lightDirection,
  ...props
}: EarthProps & GroupProps) => {
  const [earthDayTexture, nightTexture, cloudTexture] = useLoader(
    TextureLoader,
    [
      "/experiment-earth-assets/8k_earth_daymap.jpg",
      "/experiment-earth-assets/8k_earth_nightmap.jpg",
      "/experiment-earth-assets/8k_earth_clouds.jpg",
    ]
  );

  earthDayTexture.colorSpace =
    nightTexture.colorSpace =
    cloudTexture.colorSpace =
      SRGBColorSpace;

  const uniformsRef = useRef({
    dayMap: { value: earthDayTexture },
    nightMap: { value: nightTexture },
    cloudMap: { value: cloudTexture },
    uTime: { value: 0 },
    lightDirection: { value: lightDirection.clone() },
  });

  useFrame((_, delta) => {
    uniformsRef.current.uTime.value += delta;
  });
  useEffect(() => {
    uniformsRef.current.lightDirection.value.copy(lightDirection);
  }, [lightDirection]);

  return (
    <group {...props}>
      <Sphere args={[1, verteces, verteces]}>
        <shaderMaterial
          vertexShader={earthVertexShader}
          fragmentShader={earthFragmentShader}
          uniforms={uniformsRef.current}
        />
        <Atmosphere lightDirection={lightDirection} />
      </Sphere>
    </group>
  );
};
