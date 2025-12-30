import { EventProp, propsFactory } from "@/util";
import {
    makeRouterLinkOrHrefProps,
    RouterLinkOrHrefProps,
} from "@/composables/router";
import { IconProp, IconValue } from "@/composables/icons";
import { ComponentProps, makeComponentProps } from "@/composables/component";
import { EvTextProps } from "@/components/EvText";
import { EvButtonProps } from "@/components/EvButton";
import { PropType } from "vue";
import { ListItem } from "@/composables/lists";

export interface EvListItemProps extends ComponentProps, RouterLinkOrHrefProps {
    active?: boolean;
    actions?: EvButtonProps[];
    actionsOnHover?: EvButtonProps[];
    children?: ListItem[];
    disabled?: boolean;
    iconEnd?: IconValue;
    iconStart?: IconValue;
    link?: boolean;
    tag?: string;
    title?: string | number | boolean;
    subtitle?: string | number | boolean;
    value?: any;
}

export const makeEvListItemProps = propsFactory(
    {
        active: {
            type: Boolean,
            default: undefined,
        },
        actions: {
            type: Array as PropType<readonly EvButtonProps[]>,
            default: () => [],
        },
        actionsOnHover: {
            type: Array as PropType<readonly EvButtonProps[]>,
            default: () => [],
        },
        children: Array as PropType<readonly ListItem[]>,
        disabled: Boolean,
        iconEnd: IconProp,
        iconStart: IconProp,
        link: {
            type: Boolean,
            default: undefined,
        },
        loading: Boolean,
        tag: {
            type: String,
            default: "div",
        },
        title: [String, Number, Boolean],
        titleProps: {
            type: Object as PropType<EvTextProps>,
            default: () => ({}),
        },
        subtitle: [String, Number, Boolean],
        subtitleProps: {
            type: Object as PropType<EvTextProps>,
            default: () => ({}),
        },
        value: null,
        onClick: EventProp<[MouseEvent]>(),

        ...makeRouterLinkOrHrefProps({
            exact: undefined,
        }),
        ...makeComponentProps(),
    },
    "EvListItem",
);
