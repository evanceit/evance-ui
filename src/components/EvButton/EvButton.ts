import {Appearance, InputSizeProp, propsFactory} from "@/util";
import {IconProp, IconValue} from "@/composables/icons.ts";
import {makeRouterLinkOrHrefProps, RouterLinkOrHrefProps} from "@/composables/router.ts";
import {PropType} from "vue";

/**
 * ## Button Appearance
 */
export type ButtonAppearanceProp = 'default'
    | 'danger'
    | 'primary'
    | 'subtle'
    | 'link';

/**
 * # EvButtonProps
 */
export interface EvButtonProps extends RouterLinkOrHrefProps {
    appearance?: ButtonAppearanceProp,
    disabled?: boolean,
    icon?: IconValue | boolean,
    iconStart?: IconValue,
    iconEnd?: IconValue,
    rounded?: boolean,
    size?: InputSizeProp,
    fullWidth?: boolean,
    text?: string,
    loading?: boolean,
    onClick?: () => void;
}

/**
 * # EvButton Props
 */
export const makeEvButtonProps = propsFactory({
    appearance: {
        type: String as PropType<ButtonAppearanceProp>,
        default: Appearance.default
    },
    disabled: {
        type: Boolean,
        default: false
    },
    icon: [Boolean, String, Function, Object] as PropType<boolean | IconValue>,
    iconStart: IconProp,
    iconEnd: IconProp,
    rounded: Boolean,
    size: String as PropType<InputSizeProp>,
    fullWidth: Boolean,
    text: String,
    loading: Boolean,

    ...makeRouterLinkOrHrefProps()
}, 'EvButton');