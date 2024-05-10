import { Browser, propsFactory } from "../../util";
import {
    effectScope,
    EffectScope,
    nextTick,
    onScopeDispose,
    PropType,
    Ref,
    watchEffect,
} from "vue";
import {
    blockScrollStrategy,
    closeScrollStrategy,
    repositionScrollStrategy,
} from "./scroll-strategy";

export interface ScrollStrategyData {
    containerEl: Ref<HTMLElement | undefined>;
    contentEl: Ref<HTMLElement | undefined>;
    activatorEl: Ref<HTMLElement | undefined>;
    isActive: Ref<boolean>;
    updatePosition: Ref<((e: Event) => void) | undefined>;
}

type ScrollStrategyFn = (
    data: ScrollStrategyData,
    props: ScrollStrategyProps,
    scope: EffectScope,
) => void;

const scrollStrategies = {
    none: null,
    close: closeScrollStrategy,
    block: blockScrollStrategy,
    reposition: repositionScrollStrategy,
};

export interface ScrollStrategyProps {
    scrollStrategy: keyof typeof scrollStrategies | ScrollStrategyFn;
    contained: boolean | undefined;
}

/**
 * # Make Scroll Strategy Props
 */
export const makeScrollStrategyProps = propsFactory(
    {
        scrollStrategy: {
            type: [String, Function] as PropType<
                ScrollStrategyProps["scrollStrategy"]
            >,
            default: "block",
            validator: (val: any) =>
                typeof val === "function" || val in scrollStrategies,
        },
    },
    "EvOverlay/scroll",
);

/**
 * # Use Scroll Strategies
 * @param props
 * @param data
 */
export function useScrollStrategies(
    props: ScrollStrategyProps,
    data: ScrollStrategyData,
) {
    if (!Browser.hasWindow) {
        return;
    }

    let scope: EffectScope | undefined;
    watchEffect(async () => {
        scope?.stop();

        if (!(data.isActive.value && props.scrollStrategy)) {
            return;
        }

        scope = effectScope();
        await nextTick();
        scope.active &&
            scope.run(() => {
                if (typeof props.scrollStrategy === "function") {
                    props.scrollStrategy(data, props, scope!);
                } else {
                    scrollStrategies[props.scrollStrategy]?.(
                        data,
                        props,
                        scope!,
                    );
                }
            });
    });

    onScopeDispose(() => {
        scope?.stop();
    });
}
