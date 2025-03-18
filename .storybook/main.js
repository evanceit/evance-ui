/** @type { import('@storybook/vue3-vite').StorybookConfig } */
const config = {
    stories: [
        "../src/stories/Introduction.mdx",
        "../src/**/*.mdx",
        "../src/**/*.stories.@(js|jsx|ts|tsx)"
    ],
    addons: [
        "@storybook/addon-links",
        "@storybook/addon-essentials",
        "@storybook/addon-interactions",
        "storybook-dark-mode",
        "@storybook/addon-mdx-gfm",
        "@chromatic-com/storybook"
    ],
    framework: {
        name: "@storybook/vue3-vite",
        options: {},
    },
    docs: {},
};
export default config;
