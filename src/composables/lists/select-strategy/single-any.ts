import {
    SelectStrategy,
    SelectStrategyData,
    SelectStrategyFn,
    SelectTransformInFn,
    SelectTransformOutFn
} from "@/composables/lists";
import {multiAny} from "./multi-any.ts";
import {toRaw} from "vue";

/**
 * # Single Any
 *
 * One node may be selected, regardless of whether the node has children.
 *
 * @param isRequired
 */
export const singleAny = (isRequired?: boolean): SelectStrategy => {
    const parentStrategy = multiAny(isRequired);

    const selectFn: SelectStrategyFn = (data: SelectStrategyData) => {
        const id = toRaw(data.id)
        const singleSelection = (data.selected.has(id) || isRequired) ? new Map([[id, data.selected.get(id)!]]) : new Map();
        return parentStrategy.select({
            ...data,
            id: id,
            selected: singleSelection
        });
    };

    const transformIn: SelectTransformInFn = (values, children, parents) => {
        let map = new Map();
        if (Array.isArray(values) && values.length) {
            map = parentStrategy.in(values.slice(0, 1), children, parents);
        }
        return map;
    };

    const transformOut: SelectTransformOutFn = (values, children, parents) => {
        return parentStrategy.out(values, children, parents);
    };

    return {
        select: selectFn,
        in: transformIn,
        out: transformOut
    };
};