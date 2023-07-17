import {computed, ComputedRef, PropType} from "vue";
import {isObject, propsFactory} from "../../util";
import {multiAny} from "./select-strategy";

/**
 * # Select Strategy
 */
export type SelectStrategy = {
    select: SelectStrategyFn,
    transformIn: SelectTransformInFn,
    transformOut: SelectTransformOutFn
};

/**
 * # Selected
 */
export type Selected = 'on' | 'off' | 'indeterminate';

/**
 * # Select Strategy Data
 */
export interface SelectStrategyData {
    id: unknown
    value: boolean
    selected: Map<unknown, Selected>
    children: Map<unknown, unknown[]>
    parents: Map<unknown, unknown>
    event?: Event
}

/**
 * # Select Strategy Function
 */
export type SelectStrategyFn = (data: SelectStrategyData) => Map<unknown, Selected>;

/**
 * # Select Strategy Reference
 * Recognised selection strategy strings.
 */
export type SelectStrategyRef = 'multi-any';

/**
 * # Select Strategy Props
 * Defines the `props` required by components to be able to use `SelectStrategy`.
 */
export interface SelectStrategyProps {
    selectStrategy: SelectStrategyRef | SelectStrategyFn | undefined;
    selected: readonly unknownp[] | undefined;
    required: boolean,
    'onUpdate:selected': ((values: unknown[]) => void) | undefined
}

/**
 * # Select Transform In
 */
export type SelectTransformInFn = (
    values: readonly unknown[] | unknown,
    children: Map<unknown, unknown[]>,
    parents: Map<unknown, unknown>
) => Map<unknown, Selected>;

/**
 * # Select Transform Out
 */
export type SelectTransformOutFn = (
    values: Map<unknown, Selected>,
    children: Map<unknown, unknown[]>,
    parents: Map<unknown, unknown>
) => Map<unknown, Selected>;


/**
 * # Make Selected Props
 */
export const makeSelectedProps = propsFactory({
    selectStrategy: [String, Function] as PropType<SelectStrategyRef | SelectStrategyFn>,
    selected: Array as PropType<readonly unknown[]>,
    required: Boolean
}, 'select-strategies');


/**
 * # Use Select Strategy
 * @todo: Need SelectStrategyProps
 * @param props
 */
export function useSelectStrategy(props: SelectStrategyProps): ComputedRef<SelectStrategy> {
    return computed(() => {
        if (isObject(props.selectStrategy)) {
            return props.selectStrategy;
        }

        // @todo: More strategies to come

        return multiAny(props.required);
    });
}

/**
 * # Use Selected Values
 * @param selected
 */
export function useSelectedValues(selected) {
    return computed(() => {
        const values = [];
        for (const [key, value] of selected.value.entries()) {
            if (value === 'on') {
                values.push(key);
            }
        }
        return values;
    });
}