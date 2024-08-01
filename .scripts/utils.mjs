import {readFileSync} from "fs";
import path, {resolve} from "path";
import fg from "fast-glob";
import process from 'process';

const __dirname = process.cwd();

/**
 * # getComponents
 */
export function getComponentsMap() {
    const componentsIndex = readFileSync(resolve("src/components/index.ts"), {
        encoding: "utf8",
    });
    const block = Array.from(
        componentsIndex.matchAll(/^\/\/ export \* from '\.\/(.*)'$/gm),
        (m) => m[1],
    );
    const files = fg.sync(["src/components/**/index.ts"], { cwd: __dirname });
    const components = files.filter(
        (file) => !block.some((name) => file.includes(`/${name}/`)),
    );
    return new Map(
        components.flatMap((file) => {
            const src = readFileSync(file, { encoding: "utf8" });
            const matches = src.matchAll(
                /export const (Ev\w+)|export {\s+default as (Ev\w+)\s+}/gm,
            );
            return Array.from(matches, (m) => [
                m[1] || m[2],
                path.resolve(__dirname, path.dirname(file)),
            ]);
        }),
    );
}

/**
 * # getComponents
 * @return {any}
 */
export function getComponents() {
    return Object.fromEntries(getComponentsMap());
}