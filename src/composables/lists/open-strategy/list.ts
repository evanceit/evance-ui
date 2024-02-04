import {OpenStrategy} from "../open-strategies";
import {multipleOpenStrategy} from "./multiple";

/**
 * # List Open Strategy
 */
export const listOpenStrategy: OpenStrategy = {
    open: multipleOpenStrategy.open,
    select: ({ id, value, opened, parents }) => {
        if (!value) {
            return opened;
        }
        const path: unknown[] = [];
        let parent = parents.get(id);
        while (parent != null) {
            path.push(parent);
            parent = parents.get(parent);
        }
        return new Set(path);
    }
};