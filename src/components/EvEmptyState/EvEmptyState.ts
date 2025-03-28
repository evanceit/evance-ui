import { propsFactory } from "@/util";
import { makeComponentProps } from "@/composables";
import { PropType } from "vue";
import { EvButtonProps } from "@/components/EvButton";
import { EvHeadingProps } from "@/components/EvHeading";
import { EvTextProps } from "@/components/EvText";
import { IconProp, IconValue } from "@/composables/icons";
import { EvIconProps } from "@/components/EvIcon";
import { EvImgProps } from "@/components/EvImg";
import { ComponentProps } from "@/composables/component";

export interface EvEmptyStateProps extends ComponentProps {
    actions?: EvButtonProps[];
    icon?: IconValue;
    iconProps?: EvIconProps;
    image?: string;
    imageProps?: EvImgProps;
    size?: "small" | "medium" | "large";
    title?: string;
    titleProps?: EvHeadingProps;
    subtitle?: string;
    subtitleProps?: EvTextProps;
}

/**
 * @todo: add a `size` prop
 */

export const makeEvEmptyStateProps = propsFactory(
    {
        actions: {
            type: Array as PropType<readonly EvButtonProps[]>,
            default: () => [],
        },
        icon: IconProp,
        iconProps: {
            type: Object as PropType<EvIconProps>,
            default: () => ({}),
        },
        image: String,
        imageProps: {
            type: Object as PropType<EvImgProps>,
            default: () => ({}),
        },
        size: {
            type: String as PropType<EvEmptyStateProps["size"]>,
            default: "large",
        },
        title: String,
        titleProps: {
            type: Object as PropType<EvHeadingProps>,
            default: () => ({}),
        },
        subtitle: String,
        subtitleProps: {
            type: Object as PropType<EvTextProps>,
            default: () => ({}),
        },
        ...makeComponentProps(),
    },
    "EvEmptyState",
);