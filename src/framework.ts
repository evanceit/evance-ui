import {createDisplay, DisplayOptions, DisplaySymbol, SSROptions} from "./composables/display.ts";
import {Browser, getNextId, mergeDeep} from "./util";
import {App, nextTick} from "vue";

export interface EvanceUiOptions {
    blueprint?: Blueprint,
    components?: Record<string, any>,
    directives?: Record<string, any>,
    display?: DisplayOptions,
    // locale?: LocaleOptions & RtlOptions,
    ssr?: SSROptions
}

export interface Blueprint extends Omit<EvanceUiOptions, 'blueprint'> {}

/**
 * # Create Evance UI
 * @param evanceUi
 */
export function createEvanceUi(evanceUi: EvanceUiOptions = {}) {
    const { blueprint, ...rest } = evanceUi;
    const options: EvanceUiOptions = mergeDeep(blueprint, rest);

    const {
        components = {},
        directives = {},
    } = options;

    const display = createDisplay(options.display, options.ssr);

    const install = (app: App) => {

        // Install Directives
        for (const key in directives) {
            app.directive(key, directives[key]);
        }

        // Install Components
        for (const key in components) {
            app.component(key, components[key]);
        }

        // Add default `provide` symbols
        app.provide(DisplaySymbol, display);

        if (Browser.hasWindow && options.ssr) {
            if (app.$nuxt) {
                app.$nuxt.hook('app:suspense:resolve', () => {
                    display.update();
                });
            } else {
                const { mount } = app;
                app.mount = (...args) => {
                    const vm = mount(...args);
                    nextTick(() => display.update());
                    app.mount = mount;
                    return vm;
                }
            }
        }

        getNextId.reset();
    };

    return {
        install,
        display
    };
}