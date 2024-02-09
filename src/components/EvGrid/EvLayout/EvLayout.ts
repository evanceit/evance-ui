import {propsFactory} from "@/util";
import {makeComponentProps} from "@/composables/component.ts";
import {makeTagProps} from "@/composables/tag.ts";
import {DisplayBreakpoint, DisplayRuleProp, HiddenRuleProp} from "@/composables/display.ts";
import {PropType} from "vue";

/** Align Items **/
export type AlignItemsValue = 'start' | 'end' | 'center' | 'baseline' | 'stretch';
export type AlignItemsObject = {
    [key in DisplayBreakpoint]: AlignItemsValue
};
export type AlignItemsProp = AlignItemsValue | AlignItemsObject | undefined;


/** Align Content **/
export type AlignContentValue = 'start' | 'end' | 'center' | 'stretch' | 'space-between' | 'space-around' | 'space-evenly';
export type AlignContentObject = {
    [key in DisplayBreakpoint]: AlignContentValue
};
export type AlignContentProp = AlignContentValue | AlignContentObject | undefined;

/** Justify Content **/
export type JustifyContentValue = 'start' | 'end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
export type JustifyContentObject = {
    [key in DisplayBreakpoint]: JustifyContentValue
};
export type JustifyContentProp = JustifyContentValue | JustifyContentObject | undefined;

/** Spacers **/
export type SpacerValue = number | string | undefined;
export type SpacerObject = {
    [key in DisplayBreakpoint]: SpacerValue
};
export type SpacerProp = SpacerValue | SpacerObject | undefined;

/**
 * # makeEvLayoutProps
 */
export const makeEvLayoutProps = propsFactory({
    align: [String, Object] as PropType<AlignItemsProp>,
    alignContent: [String, Object] as PropType<AlignContentProp>,
    column: Boolean,
    gutter: [String, Number, Object] as PropType<SpacerProp>,
    justify: [String, Object] as PropType<JustifyContentProp>,
    nowrap: Boolean,
    hidden: [Boolean, String, Array] as PropType<HiddenRuleProp>,
    height: [String, Number, Object] as PropType<DisplayRuleProp>,
    width: [String, Number, Object] as PropType<DisplayRuleProp>,

    ...makeComponentProps(),
    ...makeTagProps()
}, 'EvLayout');
