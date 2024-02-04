import {OpenStrategy} from "../open-strategies";

/**
 * # Single Open Strategy
 */
export const singleOpenStrategy: OpenStrategy = {
    open: ({ id, value, opened, parents }) => {
        if (value) {
            const newOpened = new Set<unknown>();
            newOpened.add(id);
            let parent = parents.get(id);
            while (parent != null) {
                newOpened.add(parent);
                parent = parents.get(parent);
            }
            return newOpened;
        }
        opened.delete(id);
        return opened;
    },
    select: () => null
};