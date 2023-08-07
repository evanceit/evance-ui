import {propsFactory} from "../../util";
import {makeRouterLinkOrHrefProps} from "../../composables/router";
import {IconValue} from "../../composables/icons.ts";

export const makeEvListItemProps = propsFactory({
    active: {
        type: Boolean,
        default: undefined
    },
    children: undefined, // @todo: <--- YOU ARE HERE (trying to figure this one out).
    activeExact: {
        type: Boolean,
        default: undefined
    },
    disabled: Boolean,
    iconEnd: IconValue,
    iconStart: IconValue,
    link: {
        type: Boolean,
        default: undefined
    },
    tag: {
        type: String,
        default: 'div'
    },
    title: [String, Number, Boolean],
    value: null,

    ...makeRouterLinkOrHrefProps()

}, 'EvListItem');