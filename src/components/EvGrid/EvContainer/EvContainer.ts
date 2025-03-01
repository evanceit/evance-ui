import { propsFactory } from "@/util";
import { makeComponentProps } from "@/composables/component";
import { makeTagProps } from "@/composables/tag";
import { PropType } from "vue";
import { DisplayRuleProp, VisibilityRuleProp } from "@/composables/display";

/**
 * # makeEvContainerProps
 */
export const makeEvContainerProps = propsFactory(
    {
        fluid: {
            type: Boolean,
            default: false,
        },
        fill: Boolean,
        hidden: [Boolean, String, Array] as PropType<VisibilityRuleProp>,
        height: [String, Number, Object] as PropType<DisplayRuleProp>,
        width: [String, Number, Object] as PropType<DisplayRuleProp>,

        ...makeComponentProps(),
        ...makeTagProps(),
    },
    "EvContainer",
);
