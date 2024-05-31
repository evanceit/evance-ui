import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the path to the components.d.ts file
const dtsPath = path.resolve(__dirname, '../components.d.ts');

// Read the components.d.ts file
fs.readFile(dtsPath, 'utf8', (err, data) => {
    if (err) {
        console.error(`Error reading ${dtsPath}:`, err);
        return;
    }

    // Replace import statements to match the desired format
    let transformedData = data.replace(
        /import\('.*?'\)\['default'\]/g,
        (match) => {
            const componentNameMatch = match.match(/import\('.*?\/([^/]+)\.vue'\)\['default'\]/);
            if (componentNameMatch) {
                const componentName = componentNameMatch[1];
                return `import('@evance/evance-ui')['${componentName}']`;
            }
            return match;
        }
    );

    transformedData = transformedData.replace(/RouterLink:.*\n/g, '')
        .replace(/RouterView:.*\n/g, '');

    // Write the transformed data back to the components.d.ts file
    fs.writeFile(dtsPath, transformedData, 'utf8', (err) => {
        if (err) {
            console.error(`Error writing ${dtsPath}:`, err);
            return;
        }
        console.log(`Transformed ${dtsPath} successfully.`);
    });
});
