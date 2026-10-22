import {
    breakpoints,
    defaultDisplayOptions,
    DisplayBreakpoint,
    DisplayThresholds,
    useDisplay,
} from "@/composables/display";
import {
    ComponentPublicInstance,
    computed,
    inject,
    InjectionKey,
    MaybeRefOrGetter,
    onScopeDispose,
    provide,
    readonly,
    Ref,
    shallowRef,
    toValue,
    watch,
} from "vue";

export interface ContainerOptions {
    thresholds?: Partial<DisplayThresholds>;
}
const thresholdKeys = ["xs", ...breakpoints];
const containerScale = 0.6;

export const defaultContainerOptions: ContainerOptions = {
    thresholds: Object.fromEntries(
        Object.entries(defaultDisplayOptions.thresholds).map(([key, value]) => [
            key,
            Math.round(value * containerScale),
        ]),
    ),
};

type R<T> = Readonly<Ref<T>>;

export interface ContainerState {
    width: R<number>;
    height: R<number>;
    ready: R<boolean>;
    name: R<DisplayBreakpoint>;
    thresholds: DisplayThresholds;
    xs: R<boolean>;
    sm: R<boolean>;
    md: R<boolean>;
    lg: R<boolean>;
    xl: R<boolean>;
    xxl: R<boolean>;
    xsUp: R<boolean>;
    smUp: R<boolean>;
    mdUp: R<boolean>;
    lgUp: R<boolean>;
    xlUp: R<boolean>;
    xxlUp: R<boolean>;
    smDown: R<boolean>;
    mdDown: R<boolean>;
    lgDown: R<boolean>;
    xlDown: R<boolean>;
}

type Target = Element | ComponentPublicInstance | null | undefined;
const containerSymbol: InjectionKey<ContainerState> = Symbol("container");

/**
 * Shared resize observer for containment.
 */
type Listener = (width: number, height: number) => void;
const listeners = new WeakMap<Element, Set<Listener>>();
let observer: ResizeObserver | null = null;

function getObserver(): ResizeObserver {
    return (observer ??= new ResizeObserver((entries) => {
        for (const entry of entries) {
            const { width, height } = entry.contentRect;
            listeners.get(entry.target)?.forEach((fn) => fn(width, height));
        }
    }));
}

function observe(el: Element, fn: Listener): () => void {
    let set = listeners.get(el);
    if (!set) {
        set = new Set();
        listeners.set(el, set);
        getObserver().observe(el);
    }
    set.add(fn);
    return () => {
        set!.delete(fn);
        if (set!.size === 0) {
            listeners.delete(el);
            observer.unobserve(el);
        }
    };
}

/**
 * Synchronous content-box measurement so the first render after mount is already correct.
 */
function measure(el: Element): { width: number; height: number } {
    const cs = getComputedStyle(el);
    const px = (v: string) => parseFloat(v) || 0;
    return {
        width: Math.max(
            0,
            el.clientWidth - px(cs.paddingLeft) - px(cs.paddingRight),
        ),
        height: Math.max(
            0,
            el.clientHeight - px(cs.paddingTop) - px(cs.paddingBottom),
        ),
    };
}

function resolveEl(t: Target): Element | null {
    if (!t) return null;
    if (t instanceof Element) return t;
    const el = (t as ComponentPublicInstance).$el;
    return el instanceof Element ? el : null; // fragment roots resolve to text nodes
}

/**
 * Container State
 */
function buildState(
    width: Ref<number>,
    height: Ref<number>,
    ready: Ref<boolean>,
    thresholds: DisplayThresholds,
): ContainerState {
    const name = computed<DisplayBreakpoint>(() => {
        for (let i = thresholdKeys.length - 1; i > 0; i--) {
            if (width.value >= thresholds[thresholdKeys[i]]) {
                return thresholdKeys[i] as DisplayBreakpoint;
            }
        }
        return "xs";
    });

    const index = computed(() => thresholdKeys.indexOf(name.value));
    const is = (bp: DisplayBreakpoint) => {
        return computed(() => name.value === bp);
    };
    const up = (bp: DisplayBreakpoint) => {
        return computed(() => index.value >= thresholdKeys.indexOf(bp));
    };
    const down = (bp: DisplayBreakpoint) => {
        return computed(() => index.value <= thresholdKeys.indexOf(bp));
    };

    return {
        width: readonly(width),
        height: readonly(height),
        ready: readonly(ready),
        name,
        thresholds,

        xs: is("xs"),
        sm: is("sm"),
        md: is("md"),
        lg: is("lg"),
        xl: is("xl"),
        xxl: is("xxl"),

        xsUp: up("xs"),
        smUp: up("sm"),
        mdUp: up("md"),
        lgUp: up("lg"),
        xlUp: up("xl"),
        xxlUp: up("xxl"),

        smDown: down("sm"),
        mdDown: down("md"),
        lgDown: down("lg"),
        xlDown: down("xl"),
    };
}

function createContainer(
    target: MaybeRefOrGetter<Target>,
    options: ContainerOptions = {},
): ContainerState {
    const width = shallowRef(0);
    const height = shallowRef(0);
    const ready = shallowRef(false);
    const thresholds = {
        ...defaultContainerOptions.thresholds,
        ...options.thresholds,
    };

    if (typeof ResizeObserver !== "undefined") {
        let stop: (() => void) | undefined;

        watch(
            () => resolveEl(toValue(target)),
            (el) => {
                stop?.();
                stop = undefined;
                if (!el) {
                    ready.value = false;
                    return;
                }
                const size = measure(el);
                width.value = size.width;
                height.value = size.height;
                ready.value = true;
                stop = observe(el, (w, h) => {
                    width.value = w;
                    height.value = h;
                });
            },
            { immediate: true, flush: "post" },
        );

        onScopeDispose(() => stop?.());
    }

    return buildState(width, height, ready, thresholds);
}

function fromViewport(): ContainerState {
    const d = useDisplay();
    return {
        width: d.width,
        height: d.height,
        ready: shallowRef(true),
        name: d.name as R<DisplayBreakpoint>,
        thresholds: d.thresholds.value as DisplayThresholds,

        xs: d.xs,
        sm: d.sm,
        md: d.md,
        lg: d.lg,
        xl: d.xl,
        xxl: d.xxl,

        xsUp: d.xsUp,
        smUp: d.smUp,
        mdUp: d.mdUp,
        lgUp: d.lgUp,
        xlUp: d.xlUp,
        xxlUp: d.xxlUp,

        smDown: d.smDown,
        mdDown: d.mdDown,
        lgDown: d.lgDown,
        xlDown: d.xlDown,
    };
}

/**
 * Public API:
 * - provideContainer
 * - useContainer
 */
/** Measure an element and make it the nearest container for all descendants. */
export function provideContainer(
    target: MaybeRefOrGetter<Target>,
    options?: ContainerOptions,
): ContainerState {
    const state = createContainer(target, options);
    provide(containerSymbol, state);
    return state;
}

/**
 * useContainer() → nearest provided container, falling back to the viewport (useDisplay)
 * useContainer(elRef) → measure a local element (not provided to children)
 */
export function useContainer(
    target?: MaybeRefOrGetter<Target>,
    options?: ContainerOptions,
): ContainerState {
    if (target !== undefined) return createContainer(target, options);
    return inject(containerSymbol, null) ?? fromViewport();
}
