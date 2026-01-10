import { themes } from '@storybook/theming';
import {addons, useArgs} from '@storybook/preview-api';
import { setup } from '@storybook/vue3';
import * as directives from "../src/directives";
import * as services from "../src/services";
import {createEvanceUi} from "../src/framework";
import React from "react";
import {DARK_MODE_EVENT_NAME} from "storybook-dark-mode";
import {DocsContainer} from "@storybook/blocks";

import '../src/css/core.scss';
import '../src/css/runtime.scss';

const brandTheme = {
    brandTitle: 'Evance UI',
    brandImage: '/assets/evance-ui-logo.svg',
    fontBase: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, "Helvetica Neue", Arial, sans-serif',
    fontCode: '"JetBrains Mono", ui-monospace, Menlo, Monaco, "Cascadia Code", "Segoe UI Mono", "Roboto Mono", "Ubuntu Monospace", "Courier New", monospace',
}

/**
 * Light Mode Theme
 * ---
 */
const lightTheme = {
    ...themes.light,
    ...brandTheme,
    appBg: '#eff2f9',
    appBorderColor: '#0414661f',
    appContentBg: '#eff2f9',
    appPreviewBg: '#eff2f9',
    barBg: '#eff2f9',
    barHoverColor: '#814EFA',
    barSelectedColor: '#814EFA',
    barTextColor: '#3f4355',
    colorPrimary: '#814EFA',
    colorSecondary: '#814EFA',
    textColor: '#3f4355',
    textMutedColor: '#545A7D'
};

/**
 * Dark Mode Theme
 * ---
 */
const darkTheme = {
    ...themes.dark,
    ...brandTheme,
    appBg: '#131321',
    appBorderColor: '#a2a9cd29',
    appContentBg: '#131321',
    appPreviewBg: '#131321',
    barBg: '#131321',
    barHoverColor: '#9873FF',
    barSelectedColor: '#9873FF',
    barTextColor: '#bcc4db',
    colorPrimary: '#9772FF',
    colorSecondary: '#9772FF',
    textColor: '#bcc4db',
    textMutedColor: '#737AA1',
};

const channel = addons.getChannel();

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
        darkMode: {
            classTarget: 'html',
            dark: darkTheme,
            darkClass: 'ev-theme-dark',
            light: lightTheme,
            lightClass: 'ev-theme-light',
            stylePreview: true
        },
        docs: {
            container: (props) => {
                const [isDark, setDark] = React.useState();
                React.useEffect(() => {
                    channel.on(DARK_MODE_EVENT_NAME, setDark);
                    return () => channel.removeListener(DARK_MODE_EVENT_NAME, setDark);
                }, [channel, setDark]);

                return (
                    <DocsContainer {...props} theme={isDark ? darkTheme : lightTheme} />
                );
            }
        },
        options: {
            storySort: {
                order: ['Introduction', 'Components', 'Icons', 'Services'],
                method: 'alphabetical',
            }
        }
    },
};

setup((app) => {
    const evanceUi = createEvanceUi({
        directives,
        services
    });
    app.use(evanceUi);
});

export default preview;
