// tsup.config.ts
import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts"], // adjust to your entry(s)
  format: ["esm"],
  dts: true, // emits .d.ts
  sourcemap: true,
  clean: true,
  target: "node16",
  platform: "node",
});
