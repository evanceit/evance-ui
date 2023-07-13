import {Appearance, InputSizeProp, propsFactory} from "../../util";
import {IconValue} from "../../composables/icons.ts";
import {makeRouterLinkOrHrefProps} from "../../composables/router.ts";

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
        type: String<ButtonAppearanceProp>,
        default: Appearance.default
    },
    disabled: {
        type: Boolean,
        default: false
    },
    icon: IconValue,
    iconAfter: IconValue,
    iconBefore: IconValue,
    rounded: Boolean,
    size: String<InputSizeProp>,
    fullWidth: Boolean,
    loading: Boolean,

    ...makeRouterLinkOrHrefProps()
}, 'EvButton');