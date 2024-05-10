import { Selected } from "@/composables/lists/select-strategies.ts";
import { EventProp, isObject, propsFactory } from "@/util";
import { computed, ComputedRef, PropType } from "vue";
import {
    listOpenStrategy,
    multipleOpenStrategy,
    singleOpenStrategy,
} from "@/composables/lists/open-strategy";

/**
 * # Open Strategy
 */
export type OpenStrategy = {
    open: OpenStrategyFn;
    select: OpenSelectStrategyFn;
};

/**
 * # Open Strategy Data
 */
export interface OpenStrategyData {
    id: unknown;
    value: boolean;
    opened: Set<unknown>;
    children: Map<unknown, unknown[]>;
    parents: Map<unknown, unknown>;
    event?: Event;
}

/**
 * # Open Strategy Function
 */
export type OpenStrategyFn = (data: OpenStrategyData) => Set<unknown>;

/**
 * # Open Select Strategy Data
 */
export interface OpenSelectStrategyData extends OpenStrategyData {
    selected: Map<unknown, Selected>;
}

/**
 * # Open Select Strategy Function
 */
export type OpenSelectStrategyFn = (
    data: OpenSelectStrategyData,
) => Set<unknown> | null;

/**
 * # Open Strategy Reference
 * Recognised open strategy strings.
 */
export type OpenStrategyRef = "single" | "multiple" | "list";
export type OpenStrategyProp = OpenStrategyRef | OpenStrategy;

/**
 * # Open Strategy Props
 * Defines the `props` required by components to be able to use `OpenStrategy`.
 */
export interface OpenStrategyProps {
    openStrategy?: OpenStrategyProp;
    opened?: readonly unknown[];
    "onUpdate:opened"?: EventProp<[unknown[]]>;
}

/**
 * # Make Open Strategy Props
 */
export const makeOpenStrategyProps = propsFactory(
    {
        openStrategy: [String, Object] as PropType<
            OpenStrategyRef | OpenStrategy
        >,
        opened: Array as PropType<readonly unknown[]>,
    },
    "open-strategies",
);

/**
 * # Use Open Strategy
 * @param props
 */
export function useOpenStrategy(
    props: OpenStrategyProps,
): ComputedRef<OpenStrategy> {
    return computed(() => {
        if (isObject(props.openStrategy)) {
            return props.openStrategy as OpenStrategy;
        }
        switch (props.openStrategy) {
            case "list":
                return listOpenStrategy;
            case "single":
                return singleOpenStrategy;
            case "multiple":
            default:
                return multipleOpenStrategy;
        }
    });
}
