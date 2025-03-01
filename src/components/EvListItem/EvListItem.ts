import { propsFactory } from "@/util";
import { makeRouterLinkOrHrefProps } from "@/composables/router";
import { IconProp } from "@/composables/icons";
import { makeComponentProps } from "@/composables/component";

export const makeEvListItemProps = propsFactory(
    {
        active: {
            type: Boolean,
            default: undefined,
        },
        activeExact: {
            type: Boolean,
            default: undefined,
        },
        disabled: Boolean,
        iconEnd: IconProp,
        iconStart: IconProp,
        link: {
            type: Boolean,
            default: undefined,
        },
        tag: {
            type: String,
            default: "div",
        },
        title: [String, Number, Boolean],
        value: null,

        ...makeRouterLinkOrHrefProps(),
        ...makeComponentProps(),
    },
    "EvListItem",
);
