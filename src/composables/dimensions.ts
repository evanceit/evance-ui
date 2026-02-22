import { propsFactory } from "../util";
import { computed, PropType } from "vue";
import {
    calculateDisplayRuleValue,
    DisplayRuleProp,
} from "@/composables/display";

/**
 * # Dimensions Props
 */
export interface DimensionsProps {
    height?: DisplayRuleProp;
    maxHeight?: DisplayRuleProp;
    maxWidth?: DisplayRuleProp;
    minHeight?: DisplayRuleProp;
    minWidth?: DisplayRuleProp;
    width?: DisplayRuleProp;
}

/**
 * # Make Dimensions Props
 */
export const makeDimensionsProps = propsFactory(
    {
        height: [String, Number, Object] as PropType<DisplayRuleProp>,
        maxHeight: [String, Number, Object] as PropType<DisplayRuleProp>,
        maxWidth: [String, Number, Object] as PropType<DisplayRuleProp>,
        minHeight: [String, Number, Object] as PropType<DisplayRuleProp>,
        minWidth: [String, Number, Object] as PropType<DisplayRuleProp>,
        width: [String, Number, Object] as PropType<DisplayRuleProp>,
    },
    "dimensions",
);

/**
 * # Use Dimensions
 *
 * @param props
 */
export function useDimensions(props: DimensionsProps) {
    return computed(() => ({
        height: calculateDisplayRuleValue(props.height),
        maxHeight: calculateDisplayRuleValue(props.maxHeight),
        maxWidth: calculateDisplayRuleValue(props.maxWidth),
        minHeight: calculateDisplayRuleValue(props.minHeight),
        minWidth: calculateDisplayRuleValue(props.minWidth),
        width: calculateDisplayRuleValue(props.width),
    }));
}
