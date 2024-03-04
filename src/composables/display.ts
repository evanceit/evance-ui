import {computed, inject, InjectionKey, isRef, reactive, Ref, shallowRef, toRefs, watchEffect} from "vue";
import {
    Browser,
    consoleWarn, isBoolean,
    isObject,
    isString,
    mergeDeep, spaceSeparatedValues,
    toCamelCase,
    toKebabCase,
    toWebUnit,
    trimEnd
} from "@/util";
import {ResponsiveProp, ResponsivePropObject} from "@/components";

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
    xsUp: Ref<boolean>;
    smUp: Ref<boolean>;
    mdUp: Ref<boolean>;
    lgUp: Ref<boolean>;
    xlUp: Ref<boolean>;
    xxlUp: Ref<boolean>;
    smDown: Ref<boolean>;
    mdDown: Ref<boolean>;
    lgDown: Ref<boolean>;
    xlDown: Ref<boolean>;
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

export const defaultDisplayOptions: DisplayOptions = {
    mobileBreakpoint: 'lg',
    thresholds: {
        xs: 0,
        sm: 600,
        md: 960,
        lg: 1200,
        xl: 1600,
        xxl: 2400
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
        state.xsUp = true;
        state.smUp = !xs;
        state.mdUp = !(xs || sm);
        state.lgUp = !(xs || sm || md);
        state.xlUp = !(xs || sm || md || lg);
        state.xxlUp = !(xs || sm || md || lg || xl);
        state.smDown = !(md || lg || xl || xxl);
        state.mdDown = !(lg || xl || xxl);
        state.lgDown = !(xl || xxl);
        state.xlDown = !xxl;
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
        throw new Error("Evance UI: Could not find `ev:display` injection symbol");
    }
    return display;
}

/**
 * # Display Point Options
 *
 * These are listed in order of calculation priority.
 */
export const displayRules = [
    'xxl', 'xl', 'lg', 'md', 'sm', 'xs',
    'xxlOnly', 'xlOnly', 'lgOnly', 'mdOnly', 'smOnly', 'xsOnly',
    'xxlUp', 'xlUp', 'lgUp', 'mdUp', 'smUp', 'xsUp',
    'smDown', 'mdDown', 'lgDown', 'xlDown'
] as const;
export const displayRulesKebab = [
    'xxl-only', 'xl-only', 'lg-only', 'md-only', 'sm-only', 'xs-only',
    'xxl-up', 'xl-up', 'lg-up', 'md-up', 'sm-up', 'xs-up',
    'sm-down', 'md-down', 'lg-down', 'xl-down'
] as const;

export type DisplayRuleSuffix = 'only' | 'up' | 'down';
export type DisplayRuleKey = typeof displayRules[number];
export type DisplayRuleKebab = typeof displayRulesKebab[number];
export type DisplayRuleValue = number | string;
export type DisplayRuleObject = {
    [key in DisplayRuleKey]?: DisplayRuleValue
};
export type DisplayRuleProp = DisplayRuleValue | DisplayRuleObject;
export type DisplayRuleListProp = DisplayRuleKey
    | DisplayRuleKey[]
    | DisplayRuleKebab
    | DisplayRuleKebab[];

/** Hidden props */
export type HiddenRuleProp = DisplayRuleListProp | boolean;

/**
 * # calculateDisplayRuleValue
 *
 * @param rules
 */
export function calculateDisplayRuleValue(rules?: DisplayRuleObject | DisplayRuleValue) {
    const display = useDisplay();
    if (!isObject(rules)) {
        return toWebUnit(rules);
    }
    for (const ruleKey of displayRules) {
        let displayKey = toDisplayStateKey(ruleKey);
        const displayState = display[displayKey as keyof DisplayInstance];
        if (isRef(displayState) && displayState.value && !!rules[ruleKey]) {
            return toWebUnit(rules[ruleKey]);
        }
    }
    return undefined;
}


/**
 * # To Display Key
 *
 * @param displayRule
 */
export function toDisplayStateKey(displayRule: string): string {
    if (toDisplayStateKey.cache.has(displayRule)) {
        return toDisplayStateKey.cache.get(displayRule)!;
    }
    let value = toCamelCase(displayRule);
    if (isDisplayBreakpoint(value)) {
        value = `${value}Up`;
    }
    value = trimEnd(value, 'Only');
    toKebabCase.cache.set(displayRule, value);
    return value;
}
toDisplayStateKey.cache = new Map<string, string>();


/**
 * # To Display Rule Kebab
 *
 * @param displayRule
 */
export function toDisplayRuleKebab(displayRule: string): string {
    if (toDisplayRuleKebab.cache.has(displayRule)) {
        return toDisplayRuleKebab.cache.get(displayRule)!;
    }
    let value = toKebabCase(displayRule);
    if (isDisplayBreakpoint(value)) {
        value = `${value}-up`;
    }
    toDisplayRuleKebab.cache.set(displayRule, value);
    return value;
}
toDisplayRuleKebab.cache = new Map<string, string>();




/**
 * # isDisplayRule
 *
 * @param value
 * @param acceptKebabs
 */
export function isDisplayRule(value: unknown, acceptKebabs: boolean = true): value is DisplayRuleKey | DisplayRuleKebab {
    return (
        displayRules.includes(value as DisplayRuleKey)
        || (acceptKebabs && displayRulesKebab.includes(value as DisplayRuleKebab))
    );
}


/**
 * # isDisplayBreakpoint
 *
 * @param value
 */
export function isDisplayBreakpoint(value: unknown): value is DisplayBreakpoint {
    return ['xs', ...breakpoints].includes(value as DisplayBreakpoint);
}



/**
 * # createBreakpointClasses
 *
 * @param props
 * @param propName
 * @param prefix
 * @param useXs
 */
export function useBreakpointClasses<
    PropsObject extends object,
    PropName extends Extract<keyof PropsObject, string>,
    Prefix extends string | undefined,
    UseXs extends boolean
> (
    props: PropsObject,
    propName: PropName,
    prefix: Prefix = undefined as Prefix,
    useXs: UseXs = false as UseXs
) {
    return computed(() => {
        const prop = props[propName] as ResponsiveProp;
        if (!prop) {
            return [];
        }
        const classes = [];
        const values = (typeof prop !== 'object')
            ? { xs: prop } as ResponsivePropObject
            : prop;
        for (const [breakpoint, value] of Object.entries(values)) {
            const className = [];
            if (prefix) {
                className.push(prefix);
            }
            if (useXs || breakpoint !== 'xs') {
                className.push(breakpoint);
            }
            className.push(value);
            classes.push(className.join('-'));
        }
        return classes;
    });
}


/**
 * # useDisplayRuleClasses
 *
 * @param props
 * @param propName
 * @param prefix
 */
export function useDisplayRuleClasses<
    PropsObject extends object,
    PropName extends Extract<keyof PropsObject, string>,
    Prefix extends string | undefined
> (
    props: PropsObject,
    propName: PropName,
    prefix: Prefix = undefined as Prefix
) {
    return computed(() => {
        const classes = [];
        const rules = toDisplayRuleArray(props[propName]);
        for (const rule of rules) {
            if (!isString(rule)) {
                // Gracefully ignore anything that is not a string.
                continue;
            }
            if (!isDisplayRule(rule)) {
                consoleWarn(`The display rule '${rule}' is not valid and will be ignored.`);
                continue;
            }
            const suffix = toDisplayRuleKebab(rule);
            classes.push(`${prefix}-${suffix}`);
        }
        return classes;
    });
}


/**
 * # toDisplayRuleArray
 *
 * @param prop
 */
export function toDisplayRuleArray(prop: unknown): string[] {
    if (Array.isArray(prop)) {
        return prop;
    }
    if (isString(prop)) {
        return spaceSeparatedValues(prop as string);
    }
    if (isObject(prop)) {
        return <string[]>Object.entries(prop)
            .map(([key, value]) => {
                if (isBoolean(value)) {
                    return value ? key : undefined;
                }
                return isString(value) ? `${key}-${value.toLowerCase()}` : undefined;
            })
            .filter(value => value !== undefined);
    }
    return [];
}