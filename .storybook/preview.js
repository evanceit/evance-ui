import { create } from '@storybook/theming';
import React from 'react';
import { DocsContainer } from '@storybook/addon-docs';
import { useDarkMode } from 'storybook-dark-mode'
import { useArgs } from '@storybook/preview-api';
import { setup } from '@storybook/vue3';


/**
 * @todo: Experimenting with app setup and directives
 *        Ideally, I would like to have something like Vuetify's setup process
 */
import '../src/css/core.scss';
import * as directives from "../src/directives";
import * as services from "../src/services";
import {createEvanceUi} from "../src/framework";

setup((app) => {

  const evanceUi = createEvanceUi({
    directives,
    services
  });

  app.use(evanceUi);
});



/**
 * Light Mode Theme
 * ---
 */
const lightTheme = create({
  base: 'light',
  appBg: '#EFF2F9',
  appContentBg: '#EFF2F9',
  barBg: '#EFF2F9'
});

/**
 * Dark Mode Theme
 * ---
 */
const darkTheme = create({
  base: 'dark',
  appBg: '#131321',
  appContentBg: '#131321',
  barBg: '#131321'
});


/** @type { import('@storybook/vue3').Preview } */
const preview = {
  decorators: [
    /**
     * Support `v-model` for vue
     * @see {@link https://craigbaldwin.com/blog/updating-args-storybook-vue/}
     */
    (story, context) => {
      const [args, updateArgs] = useArgs();
      if ('modelValue' in args) {
        const update = args['onUpdate:model-value'] || args['onUpdate:modelValue'];
        args['onUpdate:model-value'] = undefined;
        args['onUpdate:modelValue'] = (...vals) => {
          update?.(...vals);
          /**
           * Arg with `undefined` will be deleted by `deleteUndefined()`, then loss of reactive
           * @see {@link https://github.com/storybookjs/storybook/blob/next/code/lib/preview-api/src/modules/store/ArgsStore.ts#L63}
           */
          const modelValue = vals[0] === undefined ? null : vals[0];
          updateArgs({modelValue});
        };
      }
      return story({...context, updateArgs});
    }
  ],
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