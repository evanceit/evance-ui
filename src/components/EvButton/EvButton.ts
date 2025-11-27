import {
    Appearance,
    AppearanceProp,
    InputSizeProp,
    propsFactory,
    VariantProp,
} from "@/util";
import { IconProp, IconValue } from "@/composables/icons";
import {
    makeRouterLinkOrHrefProps,
    RouterLinkOrHrefProps,
} from "@/composables/router";
import { PropType } from "vue";
import { makeComponentProps } from "@/composables/component";
import { EvSelectButtonSymbol } from "@/components/EvSelectButton/EvSelectButton";
import { makeGroupItemProps } from "@/composables/groupItem";

/**
 * ## Button Appearance
 */
export type ButtonAppearanceProp = AppearanceProp | "inverse";
export type ButtonVariantProp = VariantProp | "link";

/**
 * # EvButtonProps
 */
export interface EvButtonProps extends RouterLinkOrHrefProps {
    appearance?: ButtonAppearanceProp;
    disabled?: boolean;
    icon?: IconValue | boolean;
    iconStart?: IconValue;
    iconEnd?: IconValue;
    rounded?: boolean;
    size?: InputSizeProp;
    fullWidth?: boolean;
    text?: string;
    loading?: boolean;
    onClick?: () => void;
    variant?: ButtonVariantProp;
}

/**
 * # EvButton Props
 */
export const makeEvButtonProps = propsFactory(
    {
        active: {
            type: Boolean,
            default: undefined,
        },
        symbol: {
            type: null,
            default: EvSelectButtonSymbol,
        },
        appearance: {
            type: String as PropType<ButtonAppearanceProp>,
            default: Appearance.default,
        },
        icon: [Boolean, String, Function, Object] as PropType<
            boolean | IconValue
        >,
        iconStart: IconProp,
        iconEnd: IconProp,
        rounded: Boolean,
        size: String as PropType<InputSizeProp>,
        fullWidth: Boolean,
        readonly: Boolean,
        selectedIcon: IconProp,
        selectedIconStart: IconProp,
        selectedIconEnd: IconProp,
        text: String,
        loading: Boolean,
        variant: {
            type: String as PropType<ButtonVariantProp>,
            default: "default",
        },
        ...makeComponentProps(),
        ...makeRouterLinkOrHrefProps(),
        ...makeGroupItemProps(),
    },
    "EvButton",
);
