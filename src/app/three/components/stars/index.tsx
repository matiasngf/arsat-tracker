import { useEffect, useState } from "react";
import {
  BackSide,
  RepeatWrapping,
  SRGBColorSpace,
  ShaderMaterial,
} from "three";
import { useTexture } from "@react-three/drei";

export const Stars = () => {
  const [shaderRef, setShaderRef] = useState<ShaderMaterial | null>(null);

  const t = useTexture("/experiment-earth-assets/starmap_g4k.jpg");

  useEffect(() => {
    if (t && shaderRef) {
      t.colorSpace = SRGBColorSpace;
      t.wrapS = t.wrapT = RepeatWrapping;
      shaderRef.uniforms.map.value = t;
    }
  }, [shaderRef, t]);

  return (
    <mesh>
      <sphereGeometry args={[20, 12, 12]} />
      <shaderMaterial
        ref={setShaderRef as any}
        uniforms={{
          map: { value: null },
        }}
        side={BackSide}
        vertexShader={
          /*glsl*/ `
            varying vec2 vUv;
            void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
      `
        }
        fragmentShader={
          /*glsl*/ `
          varying vec2 vUv;
          uniform sampler2D map;

          float getLuminosity(vec3 color) {
            return 0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b;
          }
          
          void main() {
            vec3 color = texture2D(map, vUv).rgb;
            float luminosity = getLuminosity(color);
            color *= luminosity * luminosity;
            gl_FragColor = vec4(color, 1.0);
          }
        `
        }
      />
    </mesh>
  );
};
