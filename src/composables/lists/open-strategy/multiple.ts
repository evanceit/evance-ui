import {OpenStrategy} from "../open-strategies";

/**
 * # Multiple Open Strategy
 */
export const multipleOpenStrategy: OpenStrategy = {
    open: ({ id, value, opened, parents }) => {
        if (value) {
            let parent = parents.get(id);
            opened.add(id);
            while (parent != null && parent !== id) {
                opened.add(parent);
                parent = parents.get(parent);
            }
            return opened;
        }
        opened.delete(id);
        return opened;
    },
    select: () => null
};