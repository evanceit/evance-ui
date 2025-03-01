import { onScopeDispose, PropType, ref, Ref, watch } from "vue";
import {
    connectedPositionStrategy,
    staticPositionStrategy,
} from "./position-strategy";
import { AnchorSelector, Browser, isFunction, propsFactory } from "@/util";
import { useToggleScope } from "@/composables/toggleScope";

export interface PositionStrategyData {
    contentEl: Ref<HTMLElement | undefined>;
    activatorEl: Ref<HTMLElement | undefined>;
    isActive: Ref<boolean>;
    isRtl: Ref<boolean>;
}

type PositionStrategyFn = (
    data: PositionStrategyData,
    props: PositionStrategyProps,
    contentStyles: Ref<Record<string, string>>,
) => undefined | { updatePosition: (e: Event) => void };

const positionStrategies = {
    static: staticPositionStrategy, // specific viewport position, usually centered
    connected: connectedPositionStrategy, // connected to a certain element
};

export interface PositionStrategyProps {
    positionStrategy: keyof typeof positionStrategies | PositionStrategyFn;
    position: AnchorSelector;
    origin: AnchorSelector | "overlap";
    offset?: number | string | number[];
    maxHeight?: number | string;
    maxWidth?: number | string;
    minHeight?: number | string;
    minWidth?: number | string;
}

/**
 * # Make Position Strategy Props
 */
export const makePositionStrategyProps = propsFactory(
    {
        positionStrategy: {
            type: [String, Function] as PropType<
                PositionStrategyProps["positionStrategy"]
            >,
            default: "connected",
            validator: (value: any) =>
                typeof value === "function" || value in positionStrategies,
        },
        position: {
            type: String as PropType<AnchorSelector>,
            default: "auto",
        },
        origin: {
            type: String as PropType<PositionStrategyProps["origin"]>,
            default: "auto",
        },
        offset: [Number, String, Array] as PropType<
            PositionStrategyProps["offset"]
        >,
    },
    "EvOverlay/position",
);

/**
 * # Use Position Strategies
 */
export function usePositionStrategies(
    props: PositionStrategyProps,
    data: PositionStrategyData,
) {
    const contentStyles = ref({});
    const updatePosition = ref<(e: Event) => void>();

    /**
     * ## On Resize
     * Update the position when the window resizes.
     * @param e
     */
    function onResize(e: Event) {
        updatePosition.value?.(e);
    }

    if (Browser.hasWindow) {
        useToggleScope(
            () => {
                return !!(data.isActive.value && props.positionStrategy);
            },
            (reset) => {
                watch(() => props.positionStrategy, reset);
                onScopeDispose(() => {
                    updatePosition.value = undefined;
                });
                let positionStrategyFn: PositionStrategyFn;
                if (isFunction(props.positionStrategy)) {
                    positionStrategyFn = props.positionStrategy;
                } else {
                    positionStrategyFn = positionStrategies[
                        props.positionStrategy
                    ] as PositionStrategyFn;
                }
                updatePosition.value = positionStrategyFn(
                    data,
                    props,
                    contentStyles,
                )?.updatePosition;
            },
        );

        window.addEventListener("resize", onResize, { passive: true });

        onScopeDispose(() => {
            window.removeEventListener("resize", onResize);
            updatePosition.value = undefined;
        });
    }

    return {
        contentStyles,
        updatePosition,
    };
}
