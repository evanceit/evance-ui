import { propsFactory } from "../util";
import { computed, PropType } from "vue";
import {
    calculateDisplayRuleValue,
    DisplayRuleProp,
    useDisplay,
} from "@/composables/display";
import { ContainerState } from "@/composables/container";

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
 * @param containerState
 */
export function useDimensions(
    props: DimensionsProps,
    containerState?: ContainerState,
) {
    const display = containerState ?? useDisplay();
    return computed(() => ({
        height: calculateDisplayRuleValue(display, props.height),
        maxHeight: calculateDisplayRuleValue(display, props.maxHeight),
        maxWidth: calculateDisplayRuleValue(display, props.maxWidth),
        minHeight: calculateDisplayRuleValue(display, props.minHeight),
        minWidth: calculateDisplayRuleValue(display, props.minWidth),
        width: calculateDisplayRuleValue(display, props.width),
    }));
}
