import {propsFactory} from "../../util";
import {makeRouterLinkOrHrefProps} from "../../composables/router";

export const makeEvListItemProps = propsFactory({
    active: {
        type: Boolean,
        default: undefined
    },
    disabled: Boolean,
    link: {
        type: Boolean,
        default: undefined
    },
    tag: {
        type: String,
        default: 'div'
    },

    ...makeRouterLinkOrHrefProps()
}, 'EvListItem');