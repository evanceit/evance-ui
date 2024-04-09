import {Appearance, InputSizeProp, propsFactory} from "@/util";
import {IconProp, IconValue} from "@/composables/icons.ts";
import {makeRouterLinkOrHrefProps, RouterLinkOrHrefProps} from "@/composables/router.ts";
import {PropType} from "vue";
import {makeComponentProps} from "@/composables/component.ts";
import {EvButtonToggleSymbol} from "@/components/EvButtonToggle/EvButtonToggle.ts";

/**
 * ## Button Appearance
 */
export type ButtonAppearanceProp = 'default'
    | 'danger'
    | 'information'
    | 'notice'
    | 'primary'
    | 'success'
    | 'warning'
    | 'inverse';

export type ButtonVariantProp = 'default'
    | 'bold'
    | 'outlined'
    | 'subtle'
    | 'tonal'
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
    onClick?: () => void,
    variant?: ButtonVariantProp
}

/**
 * # EvButton Props
 */
export const makeEvButtonProps = propsFactory({
    active: {
        type: Boolean,
        default: undefined,
    },
    symbol: {
        type: null,
        default: EvButtonToggleSymbol,
    },
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
    variant: {
        type: String as PropType<ButtonVariantProp>,
        default: 'default'
    },

    ...makeComponentProps(),
    ...makeRouterLinkOrHrefProps()
}, 'EvButton');