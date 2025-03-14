import {
    computed,
    inject,
    InjectionKey,
    PropType,
    provide,
    Ref,
    ref,
} from "vue";
import { getCurrentComponent, mergeDeep, propsFactory } from "@/util";

export type Theme = "system" | "light" | "dark";

export type ThemeOptions = {
    defaultTheme?: Theme;
};

export interface ThemeInstance {
    readonly name: Readonly<Ref<Theme>>;
    readonly themeClasses: Readonly<Ref<string | undefined>>;
}

export const ThemeSymbol: InjectionKey<ThemeInstance> = Symbol.for("ev:theme");

export const makeThemeProps = propsFactory(
    {
        theme: String as PropType<Theme>,
    },
    "theme",
);

const defaultThemeOptions: ThemeOptions = {
    defaultTheme: "system",
};

function parseThemeOptions(
    options: ThemeOptions = defaultThemeOptions,
): ThemeOptions {
    return !options
        ? defaultThemeOptions
        : mergeDeep(defaultThemeOptions, options);
}

export function createTheme(options?: ThemeOptions): ThemeInstance {
    const parsedOptions = parseThemeOptions(options);
    const name = ref<Theme>(parsedOptions.defaultTheme);
    const themeClasses = computed(() => `ev-theme-${name.value}`);

    return {
        name,
        themeClasses,
    };
}

/**
 * # `provideTheme`
 *
 * @param props
 */
export function provideTheme(props: { theme?: Theme }) {
    getCurrentComponent("provideTheme");
    const theme = inject(ThemeSymbol, null);
    if (!theme) {
        throw new Error("Unable to find theme provider.");
    }
    const name = computed(() => props.theme ?? theme.name.value);
    const themeClasses = computed(() => `ev-theme-${name.value}`);
    const newTheme: ThemeInstance = {
        name,
        themeClasses,
    };
    provide(ThemeSymbol, newTheme);
    return newTheme;
}

export function useTheme() {
    getCurrentComponent("useTheme");
    const theme = inject(ThemeSymbol, null);
    if (!theme) {
        throw new Error("Unable to find theme provider.");
    }
    return theme;
}
