import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import svgLoader from "vite-svg-loader";
import path from "path";
import dts from "vite-plugin-dts";
import Components from "unplugin-vue-components/vite";
import { peerDependencies, version } from "./package.json";
import tsconfigPaths from "vite-tsconfig-paths";
import { getComponents } from ".scripts/utils.mjs";

const bannerTxt = `/*! Evance UI v${version} | MIT License */`;
const entries = {
    index: path.resolve(__dirname, "./src/index.ts"),
    ...getComponents(),
    icons: path.resolve(__dirname, "./src/icons/index.ts"),
    "icons/editor": path.resolve(__dirname, "./src/icons/editor/index.ts"),
    "icons/brand": path.resolve(__dirname, "./src/icons/brand/index.ts"),
};

// https://vitejs.dev/config/
/** @type {import('vite').UserConfig} */
export default defineConfig({
    root: __dirname,
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src"),
        },
    },
    server: {
        open: true,
        port: +(process.env.PORT ?? 8090),
    },
    build: {
        assetsInlineLimit: 0,
        emptyOutDir: true,
        sourcemap: true,
        cssCodeSplit: false,
        rollupOptions: {
            input: entries,
            preserveEntrySignatures: "exports-only",
            external: (id) =>
                Object.keys(peerDependencies).some(
                    (pkg) => id === pkg || id.startsWith(pkg + "/"),
                ),
            output: {
                format: "esm",
                dir: "dist/esm",
                entryFileNames: "[name].mjs",
                chunkFileNames: "chunks/[name]-[hash].mjs",
                preserveModules: true,
                banner: bannerTxt,
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name?.endsWith(".css")) {
                        return "evance-ui.css";
                    }
                    return "[name].[hash][extname]";
                },
            },
        },
    },
    plugins: [
        tsconfigPaths(),
        vue(),
        dts({
            insertTypesEntry: true,
            respectExternal: true, // Ensures module imports are resolved correctly
            outDir: "./dist/types",
            exclude: ["**/*.stories.ts", "**/*.test.ts"],
        }),
        svgLoader({
            svgo: false,
        }),
        Components({
            dts: true,
            globs: ["src/components/**/Ev*.vue"],
        }),
    ],
});
