import {SelectStrategy} from "@/composables/lists";
import {toRaw} from "vue";

/**
 * # Cascade Leaf Select Strategy
 *
 * This is the equivalent of Vuetify's classic select strategy.
 *
 * Selecting a parent node will cause all children to be selected,
 * parent nodes will be displayed as selected if all their descendants
 * are selected. Only leaf nodes will be added to the model.
 *
 * @param isRequired
 */
export const cascadeLeaf = (isRequired?: boolean): SelectStrategy => {
    const strategy: SelectStrategy = {
        select: ({ id, value, selected, children, parents }) => {
            id = toRaw(id);
            const original = new Map(selected);

            const items = [id];

            while (items.length) {
                const item = items.shift()!;

                selected.set(item, value ? 'on' : 'off');

                if (children.has(item)) {
                    items.push(...children.get(item)!);
                }
            }

            let parent = parents.get(id);

            while (parent) {
                const childrenIds = children.get(parent)!;
                const everySelected = childrenIds.every(cid => selected.get(cid) === 'on');
                const noneSelected = childrenIds.every(cid => !selected.has(cid) || selected.get(cid) === 'off');

                selected.set(parent, everySelected ? 'on' : noneSelected ? 'off' : 'indeterminate');

                parent = parents.get(parent);
            }

            // If mandatory and planned deselect results in no selected
            // items then we can't do it, so return original state
            if (isRequired && !value) {
                const on = Array.from(selected.entries()).reduce((arr, [key, value]) => value === 'on' ? [...arr, key] : arr, [] as unknown[]);
                if (on.length === 0) {
                    return original;
                }
            }

            return selected;
        },
        in: (values: any, children, parents) => {
            let map = new Map();
            for (const id of (values || [])) {
                map = strategy.select({
                    id,
                    value: true,
                    selected: new Map(map),
                    children,
                    parents,
                });
            }
            return map;
        },
        out: (values, children) => {
            const arr = [];
            for (const [key, value] of values.entries()) {
                if (value === 'on' && !children.has(key)) {
                    arr.push(key);
                }
            }
            return arr;
        }
    }

    return strategy;
}