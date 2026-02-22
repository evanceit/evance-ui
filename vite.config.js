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

function stripVue2VirtualModules() {
    return {
        name: "strip-vue2-virtual-modules",
        generateBundle(_, bundle) {
            for (const fileName of Object.keys(bundle)) {
                // these are the leaked virtual modules (e.g. Foo.vue2.mjs)
                if (fileName.includes(".vue2.")) {
                    delete bundle[fileName];
                }
            }
        },
    };
}

// https://vitejs.dev/config/
/** @type {import('vite').UserConfig} */
export default defineConfig({
    base: "./",
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
                    const name = assetInfo.name ?? "";
                    // CSS
                    if (name.endsWith(".css")) {
                        return "evance-ui.css";
                    }
                    // Fonts
                    if (/\.(woff2?|ttf|otf|eot)$/.test(name)) {
                        return "fonts/[name].[hash][extname]";
                    }
                    return "assets/[name].[hash][extname]";
                },
            },
        },
    },
    plugins: [
        tsconfigPaths(),
        vue(),
        dts({
            copyDtsFiles: true,
            insertTypesEntry: true,
            respectExternal: true, // Ensures module imports are resolved correctly
            outDir: "./dist/types",
            exclude: ["**/*.stories.ts", "**/*.test.ts"],
            include: ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.vue"],
        }),
        svgLoader({
            svgo: false,
        }),
        Components({
            dts: "src/types/global-components.d.ts",
            globs: ["src/components/**/Ev*.vue"],
        }),
        stripVue2VirtualModules(),
    ],
});
