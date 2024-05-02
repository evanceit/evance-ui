import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import svgLoader from 'vite-svg-loader';
import {resolve} from 'path';
import dts from 'vite-plugin-dts';
import Components from 'unplugin-vue-components/vite';
import { readFileSync } from 'fs';
import fg from 'fast-glob';
import { fileURLToPath } from "url";
import { peerDependencies, version } from "./package.json";
import tsconfigPaths from "vite-tsconfig-paths";
import babel from "@rollup/plugin-babel";

const componentsIndex = readFileSync(resolve('src/components/index.ts'), { encoding: 'utf8' });
const block = Array.from(componentsIndex.matchAll(/^\/\/ export \* from '\.\/(.*)'$/gm), m => m[1]);
const files = fg.sync(['src/components/**/index.ts'], { cwd: __dirname });
const components = files.filter(file => !block.some(name => file.includes(`/${name}/`)));
const map = new Map(components.flatMap(file => {
    const src = readFileSync(file, { encoding: 'utf8' });
    const matches = src.matchAll(/export const (Ev\w+)|export {\s+default as (Ev\w+)\s+}/gm);
    return Array.from(matches, m => [m[1] || m[2], file.replace('src/', '@/').replace('.ts', '')]);
}));

const bannerTxt = `/*! Evance UI v${version} | MIT License */`;


// https://vitejs.dev/config/
/** @type {import('vite').UserConfig} */
export default defineConfig(({ mode }) => ({
    root: __dirname,
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
    server: {
        open: true,
        port: 3000,
    },
    build: {
        emptyOutDir: false,
        sourcemap: true,
        minify: mode === "minify",
        lib:
            mode === "minify"
                ? // build minified version with index.ts entry
                {
                    name: 'evance-ui',
                    entry: resolve('./src/index.ts'),
                    formats: ["umd", "es"],
                    fileName: (format) =>
                        format === "umd" ? "evance-ui.js" : "evance-ui.mjs"
                }
                : // build rollup output versions for all entries
                {
                    name: 'evance-ui',
                    entry: resolve('./src/index.ts'),
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
                            chunkFileNames: "[name]-[hash].mjs",
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
                            banner: bannerTxt,
                            globals: {
                                vue: "Vue",
                            },
                        },
                    ],
            // rollup plugins
            plugins: [
                babel({
                    babelHelpers: "bundled"
                })
            ]
        }
    },
    plugins: [
        tsconfigPaths(),
        vue(),
        dts({
            outDir: "./dist/types",
            exclude: [
                '**/*.stories.ts',
                '**/*.test.ts'
            ]
        }),
        svgLoader({
            svgo: false
        }),
        /*
        Components({
            dts: false,
            resolvers: [
                name => {
                    if (map.has(name)) {
                        return { name, from: map.get(name) }
                    }
                }
            ]
        })
        */
    ]
}));
