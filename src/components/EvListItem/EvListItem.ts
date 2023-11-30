import {propsFactory} from "@/util";
import {makeRouterLinkOrHrefProps} from "@/composables/router.ts";
import {IconValue} from "@/composables/icons.ts";
import {makeComponentProps} from "@/composables/component.ts";

export const makeEvListItemProps = propsFactory({
    active: {
        type: Boolean,
        default: undefined
    },
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

    ...makeRouterLinkOrHrefProps(),
    ...makeComponentProps()

}, 'EvListItem');