import {propsFactory} from "@/util";
import {makeComponentProps} from "@/composables/component.ts";
import {makeTagProps} from "@/composables/tag.ts";
import {PropType} from "vue";
import {DisplayRuleProp, HiddenRuleProp} from "@/composables/display.ts";

/**
 * # makeEvContainerProps
 */
export const makeEvContainerProps = propsFactory({
    fluid: {
        type: Boolean,
        default: false,
    },
    fill: Boolean,
    hidden: [Boolean, String, Array] as PropType<HiddenRuleProp>,
    height: [String, Number, Object] as PropType<DisplayRuleProp>,
    width: [String, Number, Object] as PropType<DisplayRuleProp>,

    ...makeComponentProps(),
    ...makeTagProps()
}, 'EvContainer');