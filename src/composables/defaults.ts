import {
    computed,
    ComputedRef,
    inject,
    InjectionKey,
    MaybeRef,
    provide,
    ref,
    Ref,
    shallowRef,
    unref,
    VNode,
    watchEffect,
} from "vue";
import {
    getCurrentComponent,
    injectSelf,
    mergeDeep,
    toKebabCase,
} from "@/util";

export type DefaultsInstance =
    | undefined
    | {
          [key: string]: undefined | Record<string, unknown>;
          global?: Record<string, unknown>;
      };

export type DefaultsOptions = Partial<DefaultsInstance>;

export const DefaultsSymbol: InjectionKey<Ref<DefaultsInstance>> =
    Symbol.for("ev:defaults");

/**
 * # createDefaults
 * @param options
 */
export function createDefaults(
    options?: DefaultsInstance,
): Ref<DefaultsInstance> {
    return ref(options);
}

/**
 * # injectDefaults
 */
export function injectDefaults() {
    const defaults = inject(DefaultsSymbol);
    if (!defaults) {
        throw new Error("Evance UI: Could not find defaults instance");
    }
    return defaults;
}

/**
 * # provideDefaults
 * @param defaults
 * @param options
 */
export function provideDefaults(
    defaults?: MaybeRef<DefaultsInstance | undefined>,
    options?: {
        disabled?: MaybeRef<boolean | undefined>;
        reset?: MaybeRef<number | string | undefined>;
        root?: MaybeRef<boolean | string | undefined>;
        scoped?: MaybeRef<boolean | undefined>;
    },
) {
    const injectedDefaults = injectDefaults();
    const providedDefaults = ref(defaults);

    const newDefaults = computed(() => {
        const disabled = unref(options?.disabled);
        if (disabled) {
            return injectedDefaults.value;
        }

        const scoped = unref(options?.scoped);
        const reset = unref(options?.reset);
        const root = unref(options?.root);

        if (providedDefaults.value == null && !(scoped || reset || root)) {
            return injectedDefaults.value;
        }

        let properties = mergeDeep(providedDefaults.value, {
            previous: injectedDefaults.value,
        });

        if (scoped) {
            return properties;
        }

        if (reset || root) {
            const len = Number(reset || Infinity);

            for (let i = 0; i <= len; i++) {
                if (!properties || !("previous" in properties)) {
                    break;
                }
                properties = properties.previous;
            }

            if (properties && typeof root === "string" && root in properties) {
                properties = mergeDeep(
                    mergeDeep(properties, { previous: properties }),
                    properties[root],
                );
            }

            return properties;
        }

        return properties.previous
            ? mergeDeep(properties.previous, properties)
            : properties;
    }) as ComputedRef<DefaultsInstance>;

    provide(DefaultsSymbol, newDefaults);
    return newDefaults;
}

/**
 * # propIsDefined
 * @param vnode
 * @param prop
 */
function propIsDefined(vnode: VNode, prop: string) {
    return (
        typeof vnode.props?.[prop] !== "undefined" ||
        typeof vnode.props?.[toKebabCase(prop)] !== "undefined"
    );
}

/**
 * # internalUseDefaults
 * @param props
 * @param name
 * @param defaults
 */
export function internalUseDefaults(
    props: Record<string, any> = {},
    name?: string,
    defaults = injectDefaults(),
) {
    const component = getCurrentComponent("useDefaults");

    name = name ?? component.type.name ?? component.type.__name;
    if (!name) {
        throw new Error("Evance UI: Could not determine component name");
    }

    const componentDefaults = computed(
        () => defaults.value?.[props._as ?? name],
    );
    const internalProps = new Proxy(props, {
        get(target, prop) {
            const propValue = Reflect.get(target, prop);
            if (prop === "class" || prop === "style") {
                return [componentDefaults.value?.[prop], propValue].filter(
                    (v) => v != null,
                );
            } else if (
                typeof prop === "string" &&
                !propIsDefined(component.vnode, prop)
            ) {
                return (
                    componentDefaults.value?.[prop] ??
                    defaults.value?.global?.[prop] ??
                    propValue
                );
            }
            return propValue;
        },
    });

    const subcomponentDefaults = shallowRef();
    watchEffect(() => {
        if (componentDefaults.value) {
            const subComponents = Object.entries(
                componentDefaults.value,
            ).filter(([key]) => key.startsWith(key[0].toUpperCase()));
            subcomponentDefaults.value = subComponents.length
                ? Object.fromEntries(subComponents)
                : undefined;
        } else {
            subcomponentDefaults.value = undefined;
        }
    });

    function provideSubDefaults() {
        const injected = injectSelf(DefaultsSymbol, component);
        provide(
            DefaultsSymbol,
            computed(() => {
                return subcomponentDefaults.value
                    ? mergeDeep(
                          injected?.value ?? {},
                          subcomponentDefaults.value,
                      )
                    : injected?.value;
            }),
        );
    }

    return { props: internalProps, provideSubDefaults };
}

/**
 * # useDefaults
 *
 * @param props
 * @param name
 */
export function useDefaults<T extends Record<string, any>>(
    props: T,
    name?: string,
): T;
export function useDefaults(
    props?: undefined,
    name?: string,
): Record<string, any>;
export function useDefaults(props: Record<string, any> = {}, name?: string) {
    const { props: _props, provideSubDefaults } = internalUseDefaults(
        props,
        name,
    );
    provideSubDefaults();
    return _props;
}
