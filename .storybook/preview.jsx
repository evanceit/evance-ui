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

const brandTheme = {
    brandTitle: 'Evance UI',
    brandImage: 'src/stories/assets/evance-ui-logo.svg',
    fontBase: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, "Helvetica Neue", Arial, sans-serif',
    fontCode: 'ui-monospace, Menlo, Monaco, "Cascadia Code", "Segoe UI Mono", "Roboto Mono", "Ubuntu Monospace", "Courier New", monospace',
}

/**
 * Light Mode Theme
 * ---
 */
const lightTheme = {
    ...themes.light,
    ...brandTheme,
    appBg: '#EFF2F9',
    appBorderColor: '#0A14331F',
    appContentBg: '#EFF2F9',
    appPreviewBg: '#EFF2F9',
    barBg: '#EFF2F9',
    barHoverColor: '#814EFA',
    barSelectedColor: '#814EFA',
    barTextColor: '#535A74',
    colorPrimary: '#814EFA',
    colorSecondary: '#814EFA',
    textColor: '#535A74',
    textMutedColor: '#747794'
};

/**
 * Dark Mode Theme
 * ---
 */
const darkTheme = {
    ...themes.dark,
    ...brandTheme,
    appBg: '#131321',
    appBorderColor: '#A3A7CC29',
    appContentBg: '#131321',
    appPreviewBg: '#131321',
    barBg: '#131321',
    barHoverColor: '#9873FF',
    barSelectedColor: '#9873FF',
    barTextColor: '#A0A6BC',
    colorPrimary: '#9772FF',
    colorSecondary: '#9772FF',
    textColor: '#A0A6BC',
    textMutedColor: '#8386A5',
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