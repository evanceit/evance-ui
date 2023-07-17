import {SelectStrategy, SelectStrategyData, SelectTransformInFn, SelectTransformOutFn} from "../select-strategies.ts";
import {toRaw} from "vue";

/**
 * # Multi Any
 *
 * Any node may be selected regardless of whether it has children.
 *
 * @param isRequired
 */
export const multiAny = (isRequired?: boolean): SelectStrategy => {

    const selectFn = (data: SelectStrategyData) => {
        const id = toRaw(data.id);
        if (isRequired && !data.value) {
            const reducer = (arr, [key, value]) => {
                return (value === 'on') ? [...arr, key] : arr;
            };
            const on = Array.from(data.selected.entries()).reduce(reducer, []);
            if (on.length === 1 && on[0] === id) {
                return data.selected;
            }
        }
        data.selected.set(id, data.value ? 'on' : 'off');
        return data.selected;
    };

    const transformIn: SelectTransformInFn = (values, children, parents) => {
        let map = new Map();
        for (const id of (values || [])) {
            map = selectFn({
                id,
                value: true,
                selected: new Map(map),
                children,
                parents
            });
        }
        return map;
    };

    const transformOut: SelectTransformOutFn = (values) => {
        const selections = [];
        for (const [key, value] of values.entries()) {
            if (value === 'on') {
                selections.push(key);
            }
        }
        return selections;
    };

    return {
        select: selectFn,
        transformIn: transformIn,
        transformOut: transformOut
    };
};