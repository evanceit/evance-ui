import {
    createDisplay,
    DisplayOptions,
    DisplaySymbol,
    SSROptions,
} from "./composables/display";
import { Browser, getNextId, mergeDeep } from "./util";
import { App, nextTick } from "vue";
import { createLocaleManager, LocaleSymbol } from "@/composables/locale";
import { LocaleOptions } from "@/modules/Locale/LocaleManager";
import {
    createDate,
    DateAdapterSymbol,
    DateOptions,
} from "@/composables/date/date";
import {
    createDefaults,
    DefaultsOptions,
    DefaultsSymbol,
} from "@/composables/defaults";
import { ThemeOptions, createTheme, ThemeSymbol } from "@/composables/theme";

export * from "./composables";
export type { DateOptions, DateAdapterInstance } from "@/composables/date";

export interface EvanceUiOptions {
    blueprint?: Blueprint;
    components?: Record<string, any>;
    date?: DateOptions;
    defaults?: DefaultsOptions;
    directives?: Record<string, any>;
    display?: DisplayOptions;
    locale?: LocaleOptions; // & RtlOptions,  // @todo: <--- YOU ARE HERE
    ssr?: SSROptions;
    services?: Record<string, any>;
    theme?: ThemeOptions;
}

export interface Blueprint extends Omit<EvanceUiOptions, "blueprint"> {}

// Added to prevent strict errors
interface NuxtApp {
    hook: (hook: string, callback: () => void) => void;
}

/**
 * # Create Evance UI
 * @param evanceUi
 */
export function createEvanceUi(evanceUi: EvanceUiOptions = {}) {
    const { blueprint, ...rest } = evanceUi;
    const options: EvanceUiOptions = mergeDeep(blueprint, rest);

    const { components = {}, directives = {}, services = {} } = options;

    const defaults = createDefaults(options.defaults);
    const display = createDisplay(options.display, options.ssr);
    const locale = createLocaleManager(options.locale ?? {}); // @todo: <--- YOU ARE HERE!
    const date = createDate(options.date, locale);
    const theme = createTheme(options.theme);

    const install = (app: App) => {
        // Install Directives
        for (const key in directives) {
            app.directive(key, directives[key]);
        }

        // Install Components
        for (const key in components) {
            app.component(key, components[key]);
        }

        // Install Services
        for (const key in services) {
            app.use(services[key]);
        }

        // Add default `provide` symbols
        app.provide(DefaultsSymbol, defaults);
        app.provide(DisplaySymbol, display);
        app.provide(LocaleSymbol, locale);
        app.provide(DateAdapterSymbol, date);
        app.provide(ThemeSymbol, theme);

        if (Browser.hasWindow && options.ssr) {
            if ("$nuxt" in app) {
                (app.$nuxt as NuxtApp).hook("app:suspense:resolve", () => {
                    display.update();
                });
            } else {
                const { mount } = app;
                app.mount = (...args) => {
                    const vm = mount(...args);
                    nextTick(() => display.update());
                    app.mount = mount;
                    return vm;
                };
            }
        }

        getNextId.reset();
    };

    return {
        install,
        defaults,
        display,
        locale,
        date,
    };
}
