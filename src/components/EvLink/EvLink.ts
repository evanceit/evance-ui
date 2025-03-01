import { propsFactory } from "@/util";
import { PropType } from "vue";
import { makeComponentProps } from "@/composables/component";
import { IconProp } from "@/composables/icons";
import { makeRouterLinkOrHrefProps } from "@/composables/router";

export type LinkAppearance = "default" | "subtle";

export const makeEvLinkProps = propsFactory(
    {
        appearance: {
            type: String as PropType<LinkAppearance>,
            default: "default",
        },
        disabled: Boolean,
        iconStart: IconProp,
        iconEnd: IconProp,
        text: String,
        ...makeComponentProps(),
        ...makeRouterLinkOrHrefProps(),
    },
    "EvLink",
);