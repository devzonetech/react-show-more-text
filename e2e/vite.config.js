import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

export default defineConfig({
    configFile: false,
    root: fileURLToPath(new URL(".", import.meta.url)),
    plugins: [react()],
    server: {
        host: "127.0.0.1",
        port: 4173,
        strictPort: true,
    },
});
