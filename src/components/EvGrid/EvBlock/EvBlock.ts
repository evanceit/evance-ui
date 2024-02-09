import {propsFactory} from "@/util";
import {makeComponentProps} from "@/composables/component.ts";
import {makeTagProps} from "@/composables/tag.ts";
import {
    DisplayBreakpoint,
    DisplayRuleProp, HiddenRuleProp
} from "@/composables/display.ts";
import {PropType} from "vue";


/** Block Number Props */
export type BlockNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export type BlockNumberPropValue = BlockNumber | `${BlockNumber}`;
export type BlockNumberPropObject = {
    [key in DisplayBreakpoint]: BlockNumberPropValue
};
export type BlockNumberProp = BlockNumberPropValue | BlockNumberPropObject | undefined;


/** Block Size Props **/
export type BlockSizePropValue = 'auto' | 'grow' | BlockNumberPropValue;
export type BlockSizePropObject = {
    [key in DisplayBreakpoint]: BlockSizePropValue
};
export type BlockSizeProp = BlockSizePropValue | BlockSizePropObject;


/** Responsive Props */
export type ResponsivePropValue = string | number | boolean;
export type ResponsivePropObject = {
    [key in DisplayBreakpoint]: ResponsivePropValue
};
export type ResponsiveProp = ResponsivePropValue | ResponsivePropObject | undefined;


/** Align Self Props */
export type AlignSelfPropValue = 'auto' | 'start' | 'end' | 'center' | 'baseline' | 'stretch';
export type AlignSelfPropObject = {
    [key in DisplayBreakpoint]: AlignSelfPropValue
};
export type AlignSelfProp = AlignSelfPropValue | AlignSelfPropObject | undefined;


/**
 * # makeEvBlockProps
 */
export const makeEvBlockProps = propsFactory({
    alignSelf: [String, Object] as PropType<AlignSelfProp>,
    offset: [String, Number, Object] as PropType<BlockNumberProp>,
    order: [String, Number, Object] as PropType<BlockNumberProp>,
    scrollable: Boolean,
    size: [String, Number, Object] as PropType<BlockSizeProp>,
    hidden: [Boolean, String, Array] as PropType<HiddenRuleProp>,
    height: [String, Number, Object] as PropType<DisplayRuleProp>,
    width: [String, Number, Object] as PropType<DisplayRuleProp>,

    ...makeComponentProps(),
    ...makeTagProps()
}, 'EvBlock');
