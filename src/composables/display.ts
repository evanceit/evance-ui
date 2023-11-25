import {inject, InjectionKey, reactive, Ref, shallowRef, toRefs, watchEffect} from "vue";
import {Browser, isObject, mergeDeep} from "../util";

/**
 * # Breakpoints
 * Excludes `xs` as this is the smallest size - not really a breakpoint.
 */
export const breakpoints = ['sm', 'md', 'lg', 'xl', 'xxl'] as const;

export type Breakpoint = typeof breakpoints[number];

export type DisplayBreakpoint = 'xs' | Breakpoint;

export type DisplayThresholds = {
    [key in DisplayBreakpoint]: number
};

export interface DisplayOptions {
    mobileBreakpoint?: number | DisplayBreakpoint;
    thresholds?: Partial<DisplayThresholds>;
}

export interface InternalDisplayOptions {
    mobileBreakpoint: number | DisplayBreakpoint;
    thresholds: DisplayThresholds;
}

export type SSROptions = boolean | {
    clientWidth: number,
    clientHeight?: number
};

export interface DisplayPlatform {
    android: boolean;
    ios: boolean;
    cordova: boolean;
    electron: boolean;
    chrome: boolean;
    edge: boolean;
    firefox: boolean;
    opera: boolean;
    win: boolean;
    mac: boolean;
    linux: boolean;
    touch: boolean;
    ssr: boolean;
}

export interface DisplayInstance {
    xs: Ref<boolean>;
    sm: Ref<boolean>;
    md: Ref<boolean>;
    lg: Ref<boolean>;
    xl: Ref<boolean>;
    xxl: Ref<boolean>;
    smAndUp: Ref<boolean>;
    mdAndUp: Ref<boolean>;
    lgAndUp: Ref<boolean>;
    xlAndUp: Ref<boolean>;
    smAndDown: Ref<boolean>;
    mdAndDown: Ref<boolean>;
    lgAndDown: Ref<boolean>;
    xlAndDown: Ref<boolean>;
    name: Ref<DisplayBreakpoint>;
    height: Ref<number>;
    width: Ref<number>;
    mobile: Ref<boolean>;
    mobileBreakpoint: Ref<number | DisplayBreakpoint>;
    platform: Ref<DisplayPlatform>;
    thresholds: Ref<DisplayThresholds>;

    /** @internal */
    ssr: boolean;

    update (): void;
}


const parseDisplayOptions = (options: DisplayOptions = defaultDisplayOptions) => {
    return mergeDeep(defaultDisplayOptions, options) as InternalDisplayOptions;
}

function getClientWidth (ssr?: SSROptions) {
    return (Browser.hasWindow && !ssr) ? window.innerWidth : (isObject(ssr) && ssr.clientWidth) || 0;
}

function getClientHeight (ssr?: SSROptions) {
    return (Browser.hasWindow && !ssr) ? window.innerHeight : (isObject(ssr) && ssr.clientHeight) || 0;
}

function getPlatform (ssr?: SSROptions): DisplayPlatform {
    const userAgent = (Browser.hasWindow && !ssr) ? window.navigator.userAgent : 'ssr';

    function isUserAgent(regexp: RegExp) {
        return Boolean(userAgent.match(regexp));
    }

    return {
        android: isUserAgent(/android/i),
        ios: isUserAgent(/iphone|ipad|ipod/i),
        cordova: isUserAgent(/cordova/i),
        electron: isUserAgent(/electron/i),
        chrome: isUserAgent(/chrome/i),
        edge: isUserAgent(/edge/i),
        firefox: isUserAgent(/firefox/i),
        opera: isUserAgent(/opera/i),
        win: isUserAgent(/win/i),
        mac: isUserAgent(/mac/i),
        linux: isUserAgent(/linux/i),
        touch: Browser.supportsTouch,
        ssr: userAgent === 'ssr'
    }
}

export const DisplaySymbol: InjectionKey<DisplayInstance> = Symbol.for('ev:display')

const defaultDisplayOptions: DisplayOptions = {
    mobileBreakpoint: 'lg',
    thresholds: {
        xs: 0,
        sm: 600,
        md: 960,
        lg: 1200,
        xl: 1600,
        xxl: 2560
    }
}

/**
 * # Create Display
 * @param options
 * @param ssr
 */
export function createDisplay(
    options?: DisplayOptions,
    ssr?: SSROptions
): DisplayInstance {
    const { thresholds, mobileBreakpoint } = parseDisplayOptions(options);

    const height = shallowRef(getClientHeight(ssr));
    const platform = shallowRef(getPlatform(ssr));
    const state = reactive({} as DisplayInstance);
    const width = shallowRef(getClientWidth(ssr));

    function updateSize () {
        height.value = getClientHeight();
        width.value = getClientWidth();
    }

    function update () {
        updateSize();
        platform.value = getPlatform();
    }

    // eslint-disable-next-line max-statements
    watchEffect(() => {
        const xs = width.value < thresholds.sm;
        const sm = width.value < thresholds.md && !xs;
        const md = width.value < thresholds.lg && !(sm || xs);
        const lg = width.value < thresholds.xl && !(md || sm || xs);
        const xl = width.value < thresholds.xxl && !(lg || md || sm || xs);
        const xxl = width.value >= thresholds.xxl;
        const name =
            xs ? 'xs'
                : sm ? 'sm'
                    : md ? 'md'
                        : lg ? 'lg'
                            : xl ? 'xl'
                                : 'xxl';
        const breakpointValue = typeof mobileBreakpoint === 'number' ? mobileBreakpoint : thresholds[mobileBreakpoint];
        const mobile = width.value < breakpointValue;

        state.xs = xs;
        state.sm = sm;
        state.md = md;
        state.lg = lg;
        state.xl = xl;
        state.xxl = xxl;
        state.smAndUp = !xs;
        state.mdAndUp = !(xs || sm);
        state.lgAndUp = !(xs || sm || md);
        state.xlAndUp = !(xs || sm || md || lg);
        state.smAndDown = !(md || lg || xl || xxl);
        state.mdAndDown = !(lg || xl || xxl);
        state.lgAndDown = !(xl || xxl);
        state.xlAndDown = !xxl;
        state.name = name;
        state.height = height.value;
        state.width = width.value;
        state.mobile = mobile;
        state.mobileBreakpoint = mobileBreakpoint;
        state.platform = platform.value;
        state.thresholds = thresholds;
    });

    if (Browser.hasWindow) {
        window.addEventListener('resize', updateSize, { passive: true });
    }

    return {
        ...toRefs(state),
        update,
        ssr: !!ssr
    };
}


/**
 * # Use Display (from Symbol);
 */
export function useDisplay () {
    const display = inject(DisplaySymbol);
    if (!display) {
        throw new Error("Could not find 'ev:display' injection symbol");
    }
    return display;
}


