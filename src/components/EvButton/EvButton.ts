import {Appearance, InputSizeProp, propsFactory} from "@/util";
import {IconValue} from "@/composables/icons.ts";
import {makeRouterLinkOrHrefProps} from "@/composables/router.ts";
import {PropType} from "vue";

/**
 * ## Button Appearance
 */
export type ButtonAppearanceProp = 'default'
    | 'danger'
    | 'primary'
    | 'subtle';

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
    iconStart: IconValue,
    iconEnd: IconValue,
    rounded: Boolean,
    size: String as PropType<InputSizeProp>,
    fullWidth: Boolean,
    text: String,
    loading: Boolean,

    ...makeRouterLinkOrHrefProps()
}, 'EvButton');