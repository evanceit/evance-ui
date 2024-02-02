// Utilities
import { propsFactory } from '@/util';

// Types
export interface TagProps {
    tag: string;
}

// Tag Props
export const makeTagProps = propsFactory({
    tag: {
        type: String,
        default: 'div',
    },
}, 'tag');