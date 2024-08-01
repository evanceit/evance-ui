
import {getComponents} from "./utils.mjs";
import process from "process";
const componentPaths = getComponents();

const __dirname = process.cwd();

for (const [componentName, componentDirectory] of Object.entries(componentPaths)) {

    console.log(__dirname);
    console.log(`[${componentName}] ${componentDirectory}`);

    const url = `file:///${componentDirectory.replace(/\\/g, '/')}`;


}