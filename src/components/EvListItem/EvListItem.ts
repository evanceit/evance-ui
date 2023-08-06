import {propsFactory} from "../../util";
import {makeRouterLinkOrHrefProps} from "../../composables/router";
import {IconValue} from "../../composables/icons.ts";

export const makeEvListItemProps = propsFactory({
    active: {
        type: Boolean,
        default: undefined
    },
    children: [],
    activeExact: {
        type: Boolean,
        default: undefined
    },
    appendIcon: IconValue,
    disabled: Boolean,
    link: {
        type: Boolean,
        default: undefined
    },
    prependIcon: IconValue,
    tag: {
        type: String,
        default: 'div'
    },
    title: [String, Number, Boolean],
    value: null,

    ...makeRouterLinkOrHrefProps()

}, 'EvListItem');