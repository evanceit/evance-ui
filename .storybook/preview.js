import { create, themes } from '@storybook/theming';
import React from 'react';
import { DocsContainer } from '@storybook/addon-docs';
import { useDarkMode } from 'storybook-dark-mode'

import '../src/css/reset.scss';

/**
 * Light Mode Theme
 * ---
 */
const lightTheme = create({
  base: 'light',
  appBg: '#F3F5F9',
  appContentBg: '#F3F5F9',
  barBg: '#F3F5F9'
});

/**
 * Dark Mode Theme
 * ---
 */
const darkTheme = create({
  base: 'dark',
  appBg: '#1E1D2B',
  appContentBg: '#1E1D2B',
  barBg: '#1E1D2B'
});


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
    dark: darkTheme,
    // Override the default light theme
    light: lightTheme,
    // Set Dark Mode Parameters
    darkMode: {
      classTarget: 'html',
      current: 'light',
      darkClass: 'ev-theme-dark',
      lightClass: 'ev-theme-light',
      stylePreview: true
    },
    docs: {
      container: (props) => {
        const isDark = useDarkMode();
        const currentProps = { ...props };
        currentProps.theme = isDark ? darkTheme : lightTheme;
        return React.createElement(DocsContainer, currentProps);
      },
    },
  },
};

export default preview;