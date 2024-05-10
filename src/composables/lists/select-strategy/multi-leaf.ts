import { SelectStrategy } from "@/composables/lists";
import { multiAny } from "./multi-any.ts";
import { toRaw } from "vue";

/**
 * # Multi-Leaf Select Strategy
 *
 * Only leaf nodes (items without children) can be selected.
 *
 * @param isRequired
 */
export const multiLeaf = (isRequired?: boolean): SelectStrategy => {
    const parentStrategy = multiAny(isRequired);

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
