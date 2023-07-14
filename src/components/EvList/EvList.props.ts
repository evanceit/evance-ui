import {propsFactory} from "../../util";
import {makeListItemsProps} from "../../composables/list-items.ts";

export const makeEvListProps = propsFactory({
    disabled: Boolean,
    tag: {
        type: String,
        default: 'div'
    },

    ...makeListItemsProps()

}, 'EvList');