import {Appearance, InputSizeProp, propsFactory} from "@/util";
import {makeComponentProps} from "@/composables/component.ts";
import {makeTagProps} from "@/composables/tag.ts";
import {PropType} from "vue";
import {ButtonAppearanceProp, ButtonVariantProp} from "@/components/EvButton/EvButton.ts";


export const makeEvButtonGroupProps = propsFactory({

    appearance: {
        type: String as PropType<ButtonAppearanceProp>,
        default: Appearance.default
    },
    rounded: Boolean,
    size: String as PropType<InputSizeProp>,
    variant: {
        type: String as PropType<ButtonVariantProp>,
        default: 'outlined'
    },

    ...makeComponentProps(),
    ...makeTagProps()
}, 'EvButtonGroup');