import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import svgLoader from 'vite-svg-loader';
import {resolve} from 'path';
import dts from 'vite-plugin-dts';
import Components from 'unplugin-vue-components/vite';
import fs, { readFileSync } from 'fs';
import fg from 'fast-glob';

const componentsIndex = readFileSync(resolve('src/components/index.ts'), { encoding: 'utf8' });
const block = Array.from(componentsIndex.matchAll(/^\/\/ export \* from '\.\/(.*)'$/gm), m => m[1]);
const files = fg.sync(['src/components/**/index.ts'], { cwd: __dirname });
const components = files.filter(file => !block.some(name => file.includes(`/${name}/`)));
const map = new Map(components.flatMap(file => {
    const src = readFileSync(file, { encoding: 'utf8' });
    const matches = src.matchAll(/export const (Ev\w+)|export {\s+default as (Ev\w+)\s+}/gm);
    return Array.from(matches, m => [m[1] || m[2], file.replace('src/', '@/').replace('.ts', '')]);
}));

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        dts({
            insertTypesEntry: true,
            exclude: [
                '**/*.stories.ts',
                '**/*.test.ts'
            ]
        }),
        svgLoader({
            svgo: false
        }),
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
    ],
    build: {
        lib: {
            entry: resolve('./src/entry-bundler.ts'),
            name: 'evance-ui',
            fileName: (format) => `evance-ui.${format}.js`,
        },
        rollupOptions: {
            external: ['vue'],
            output: {
                globals: {
                    vue: 'Vue'
                }
            }
        }
    },
    resolve: {
        alias: [
            {find: /^evance$/, replacement: resolve('./src/framework.ts')},
            {find: /^@\/(.*)/, replacement: resolve('./src/$1')}
        ]
    }
})
