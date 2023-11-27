import {createDisplay, DisplayOptions, DisplaySymbol, SSROptions} from "./composables/display.ts";
import {Browser, getNextId, mergeDeep} from "./util";
import {App, nextTick} from "vue";
import {createLocaleManager, LocaleSymbol} from "@/composables/locale.ts";
import {LocaleOptions} from "@/modules/Locale/LocaleManager.ts";
import {createDate, DateAdapterSymbol, DateOptions} from "@/composables/date/date.ts";
import {SlotsDirective} from "@/directives";

export interface EvanceUiOptions {
    blueprint?: Blueprint,
    components?: Record<string, any>,
    date?: DateOptions,
    directives?: Record<string, any>,
    display?: DisplayOptions,
    locale?: LocaleOptions, // & RtlOptions,  // @todo: <--- YOU ARE HERE
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
    const locale = createLocaleManager(options.locale ?? {}); // @todo: <--- YOU ARE HERE!
    const date = createDate(options.date, locale);

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
        app.provide(LocaleSymbol, locale);
        app.provide(DateAdapterSymbol, date);

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