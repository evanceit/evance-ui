import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import svgLoader from "vite-svg-loader";
import path from "path";
import dts from "vite-plugin-dts";
import Components from "unplugin-vue-components/vite";
import { peerDependencies, version } from "./package.json";
import tsconfigPaths from "vite-tsconfig-paths";
import babel from "@rollup/plugin-babel";
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
export default defineConfig(({ mode }) => ({
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
        emptyOutDir: false,
        sourcemap: true,
        minify: mode === "minify",
        lib:
            mode === "minify"
                ? // build minified version with index.ts entry
                  {
                      name: "evance-ui",
                      entry: path.resolve(__dirname, "./src/index.ts"),
                      formats: ["umd", "es"],
                      fileName: (format) =>
                          format === "umd" ? "evance-ui.js" : "evance-ui.mjs",
                  }
                : // build rollup output versions for all entries
                  {
                      name: "evance-ui",
                      entry: entries,
                  },
        rollupOptions: {
            external: [...Object.keys(peerDependencies)],
            output:
                mode === "minify"
                    ? // Browser build minified version
                      {
                          banner: bannerTxt,
                          exports: "named",
                          // Provide global variables to use in the UMD build
                          // for externalized deps
                          globals: {
                              vue: "Vue",
                          },
                      }
                    : [
                          // ESM build
                          {
                              format: "esm",
                              dir: "dist/esm",
                              entryFileNames: "[name].mjs",
                              chunkFileNames: "chunks/[name]-[hash].mjs",
                              preserveModules: true,
                              banner: bannerTxt,
                              globals: {
                                  vue: "Vue",
                              },
                          },
                          // SSR build
                          {
                              format: "cjs",
                              dir: "dist/cjs",
                              exports: "named",
                              entryFileNames: "[name].cjs",
                              chunkFileNames: "chunks/[name]-[hash].cjs",
                              preserveModules: true,
                              banner: bannerTxt,
                              globals: {
                                  vue: "Vue",
                              },
                          },
                      ],
            // rollup plugins
            plugins: [
                babel({
                    babelHelpers: "bundled",
                }),
            ],
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
}));
