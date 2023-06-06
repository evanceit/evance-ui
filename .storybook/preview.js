import { themes } from '@storybook/theming';

import '../src/css/reset.scss';

/** @type { import('@storybook/vue3').Preview } */
const preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    // Override the default dark theme
    dark: { ...themes.dark },
    // Override the default light theme
    light: { ...themes.normal },
    // Set Dark Mode Parameters
    darkMode: {
      classTarget: 'html',
      current: 'light',
      darkClass: 'ev-theme-dark',
      lightClass: 'ev-theme-light',
      stylePreview: true
    }
  },
};

export default preview;