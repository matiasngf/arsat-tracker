import { ShaderMaterial, Texture } from "three"
import { ShaderPass } from "postprocessing"
import { Uniforms } from "../hooks/use-uniforms";

const drawVertexShader = /*glsl*/`
varying vec2 vUv;

void main() {
  vUv = uv;

  gl_Position = vec4(position, 1.0);
}
`

const drawFragmentShader = /*glsl*/`
varying vec2 vUv;

uniform highp sampler2D sunFbo;
uniform highp sampler2D earthFbo;
uniform highp sampler2D arsatFbo;

void main() {
  vec4 sunSample = texture2D(sunFbo, vUv);
  vec4 earthSample = texture2D(earthFbo, vUv);
  vec4 arsatSample = texture2D(arsatFbo, vUv);

  float gamma = 1.2;
  vec3 sunColor = sunSample.rgb;
  vec3 earthColor = earthSample.rgb;
  vec3 arsatColor = arsatSample.rgb;

  vec3 color;
  color = mix(sunColor, earthColor, earthSample.a);
  color = mix(color, arsatColor, arsatSample.a);

  vec4 frag = vec4(color, 1.0);
  gl_FragColor = frag;
}
`

export type RenderUniforms = {
  arsatFbo: Texture | null;
  earthFbo: Texture | null;
  sunFbo: Texture | null;
};

export const defaultRenderUniforms: RenderUniforms = {
  arsatFbo: null,
  earthFbo: null,
  sunFbo: null,
};

const getDrawPass = () => {
  const uniforms: Uniforms<RenderUniforms> = {
    arsatFbo: { value: null },
    earthFbo: { value: null },
    sunFbo: { value: null },
  }

  const drawMaterial = new ShaderMaterial({
    vertexShader: drawVertexShader,
    fragmentShader: drawFragmentShader,
    uniforms
  })

  const shaderPass = new ShaderPass(drawMaterial as any)

  return [shaderPass, drawMaterial] as const
}

export const [drawPass, drawMaterial] = getDrawPass();