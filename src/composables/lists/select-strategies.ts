import { computed, ComputedRef, PropType, Ref } from "vue";
import { isFunction, isObject, propsFactory } from "@/util";
import {
    cascadeLeaf,
    multiAny,
    multiLeaf,
    singleLeaf,
} from "./select-strategy";
import { singleAny } from "./select-strategy/single-any";

/**
 * # Select Strategy
 */
export type SelectStrategy = {
    select: SelectStrategyFn;
    in: SelectTransformInFn;
    out: SelectTransformOutFn;
};

/**
 * # Selected
 */
export type Selected = "on" | "off" | "indeterminate";

/**
 * # Select Strategy Data
 */
export interface SelectStrategyData {
    id: unknown;
    value: boolean;
    selected: Map<unknown, Selected>;
    children: Map<unknown, unknown[]>;
    parents: Map<unknown, unknown>;
    event?: Event;
}

/**
 * # Select Strategy Function
 */
export type SelectStrategyFn = (
    data: SelectStrategyData,
) => Map<unknown, Selected>;

/**
 * # Select Strategy Reference
 * Recognised selection strategy strings.
 */
export type SelectStrategyRef =
    | "cascade-leaf"
    | "multi-any"
    | "multi-leaf"
    | "single-any"
    | "single-leaf";

/**
 * # Select Strategy Props
 * Defines the `props` required by components to be able to use `SelectStrategy`.
 */
export interface SelectStrategyProps {
    selectStrategy?: SelectStrategyRef | SelectStrategyFn;
    selected?: readonly unknown[];
    required?: boolean;
    "onUpdate:selected"?: ((values: unknown[]) => void) | undefined;
}

/**
 * # Select Transform In
 */
export type SelectTransformInFn = (
    values: readonly unknown[] | unknown,
    children: Map<unknown, unknown[]>,
    parents: Map<unknown, unknown>,
) => Map<unknown, Selected>;

/**
 * # Select Transform Out
 */
export type SelectTransformOutFn = (
    values: Map<unknown, Selected>,
    children: Map<unknown, unknown[]>,
    parents: Map<unknown, unknown>,
) => unknown[];

/**
 * # Make Selected Props
 */
export const makeSelectedProps = propsFactory(
    {
        selectStrategy: [String, Function] as PropType<
            SelectStrategyRef | SelectStrategyFn
        >,
        selected: Array as PropType<readonly unknown[]>,
        required: Boolean,
    },
    "select-strategies",
);

/**
 * # Use Select Strategy
 * @param props
 */
export function useSelectStrategy(
    props: SelectStrategyProps,
): ComputedRef<SelectStrategy> {
    return computed(() => {
        if (
            isObject(props.selectStrategy) &&
            !isFunction(props.selectStrategy)
        ) {
            return props.selectStrategy as SelectStrategy;
        }
        switch (props.selectStrategy) {
            case "single-leaf":
                return singleLeaf(props.required);
            case "single-any":
                return singleAny(props.required);
            case "multi-leaf":
                return multiLeaf(props.required);
            case "multi-any":
                return multiAny(props.required);
            case "cascade-leaf":
            default:
                return cascadeLeaf(props.required);
        }
    });
}

/**
 * # Use Selected Values
 * @param selected
 */
export function useSelectedValues(selected: Ref<Map<unknown, Selected>>) {
    return computed(() => {
        const values = [];
        for (const [key, value] of selected.value.entries()) {
            if (value === "on") {
                values.push(key);
            }
        }
        return values;
    });
}
