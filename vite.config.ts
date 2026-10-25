import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./",
  server: { host: "127.0.0.1", port: 5199, strictPort: true },
  // Целевые браузеры сборки: Safari 14+, Chrome 87+, Firefox 78+, Edge 88+ (esbuild добавит префиксы и транспилирует синтаксис)
  build: { target: ["es2020", "safari14", "chrome87", "firefox78", "edge88"], cssTarget: ["safari14", "chrome87", "firefox78", "edge88"] },
  test: { environment: "node", include: ["src/**/*.test.ts"] },
});
