import { WebGl } from "./three/canvas";

export default function TrackerPage() {
  return (
    <main className="flex min-h-[100svh] w-full relative">
      <div className="absolute inset-0">
        <WebGl />
      </div>
    </main>
  );
}
