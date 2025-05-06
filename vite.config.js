import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        historyApiFallback: true,
    },
    resolve: {
        alias: {
            "@": path.resolve(import.meta.dirname, "src"),
        },
        extensions: [".js", ".jsx"],
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes("node_modules")) {
                        return id
                            .toString()
                            .split("node_modules/")[1]
                            .split("/")[0]
                            .toString();
                    }
                },
            },
        },
    },
});
