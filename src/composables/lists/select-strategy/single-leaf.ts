import { SelectStrategy } from "@/composables/lists";
import { singleAny } from "./single-any.ts";
import { toRaw } from "vue";

/**
 * # Single Leaf Select Strategy
 *
 * Only one leaf node (items without children) can be selected.
 *
 * @param isRequired
 */
export const singleLeaf = (isRequired?: boolean): SelectStrategy => {
    const parentStrategy = singleAny(isRequired);

    return {
        select: ({ id, selected, children, ...rest }) => {
            id = toRaw(id);
            if (children.has(id)) {
                return selected;
            }
            return parentStrategy.select({ id, selected, children, ...rest });
        },
        in: parentStrategy.in,
        out: parentStrategy.out,
    };
};
