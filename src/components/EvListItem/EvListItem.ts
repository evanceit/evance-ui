import {propsFactory} from "../../util";
import {makeRouterLinkOrHrefProps} from "../../composables/router";

export const makeEvListItemProps = propsFactory({
    tag: {
        type: String,
        default: 'div'
    },

    ...makeRouterLinkOrHrefProps()
}, 'EvListItem');