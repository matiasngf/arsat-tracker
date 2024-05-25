"use client";

import { useSearchParams } from "next/navigation";
import { Canvas } from "@react-three/fiber";
import { MainScene } from "./main-scene";
import { Leva } from "leva";
import { useApp } from "@/store";
import { Debug } from "./debug";

export const WebGl: React.FC = () => {
  const params = useSearchParams();
  const isDebug = params.get("debug") !== null;
  return (
    <div className="canvas-container">
      <Leva hidden={!isDebug} />
      <GlCanvas />
    </div>
  );
};

export const GlCanvas = () => {
  const params = useSearchParams();
  const isDebug = params.get("debug") !== null;

  return (
    <Canvas
      gl={{
        antialias: true,
        alpha: true,
      }}
      ref={(canvas) => {
        if (canvas) {
          useApp.setState({ canvas });
        }
      }}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        overflow: "visible",
      }}
    >
      <MainScene />
      {isDebug && <Debug />}
    </Canvas>
  );
};
