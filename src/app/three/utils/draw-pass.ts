import { ShaderMaterial, Texture } from "three"
import { ShaderPass } from "three-stdlib"
import { Uniforms } from "../hooks/use-uniforms";

const drawVertexShader = /*glsl*/`
varying vec2 vUv;
// varying vec2 translatedUv;
// varying vec2 vAspectUV;
// varying vec2 translatedAspectUV;

void main() {
  // float translateFactor = 1.;
  // float aspect = resolution.x / resolution.y;
  vUv = uv;
  // translatedUv = uv + vec2(0.0, cameraY * translateFactor);
  // vAspectUV = uv * vec2(aspect, 1.0);
  // translatedAspectUV = translatedUv * vec2(aspect, 1.0);

  gl_Position = vec4(position, 1.0);
}
`

const drawFragmentShader = /*glsl*/`
varying vec2 vUv;
// varying vec2 translatedUv;
// varying vec2 vAspectUV;
// varying vec2 translatedAspectUV;

uniform sampler2D arsatFbo;
uniform sampler2D earthFbo;

void main() {
  vec4 earthSample = texture2D(earthFbo, vUv);
  vec4 arsatSample = texture2D(arsatFbo, vUv);

  vec3 color = mix(earthSample.rgb, arsatSample.rgb, arsatSample.a);
  vec4 frag = vec4(color, 1.0);
  gl_FragColor = frag;
}

`

export type RenderUniforms = {
  arsatFbo: Texture | null;
  earthFbo: Texture | null;
};

export const defaultRenderUniforms: RenderUniforms = {
  arsatFbo: null,
  earthFbo: null,
};

const getDrawPass = () => {
  const uniforms: Uniforms<RenderUniforms> = {
    arsatFbo: { value: null },
    earthFbo: { value: null },
  }

  const drawMaterial = new ShaderMaterial({
    vertexShader: drawVertexShader,
    fragmentShader: drawFragmentShader,
    uniforms
  })

  return new ShaderPass(drawMaterial)
}

export const drawPass = getDrawPass();