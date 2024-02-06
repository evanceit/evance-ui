import {consoleWarn, isString, propsFactory, toKebabCase} from "@/util";
import {makeComponentProps} from "@/composables/component.ts";
import {makeTagProps} from "@/composables/tag.ts";
import {
    DisplayBreakpoint,
    DisplayRuleListProp,
    DisplayRuleProp, isDisplayRule
} from "@/composables/display.ts";
import {computed, PropType} from "vue";


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
export type AlignSelfPropValue = 'auto' | 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
export type AlignSelfPropObject = {
    [key in DisplayBreakpoint]: AlignSelfPropValue
};
export type AlignSelfProp = AlignSelfPropValue | AlignSelfPropObject | undefined;


/** Hidden props */
export type HiddenRuleProp = DisplayRuleListProp | boolean;

/**
 * # makeEvBlockProps
 */
export const makeEvBlockProps = propsFactory({
    alignSelf: [String, Object] as PropType<AlignSelfProp>,
    offset: [String, Number, Object] as PropType<BlockNumberProp>,
    order: [String, Number, Object] as PropType<BlockNumberProp>,
    scrollable: Boolean,
    size: [String, Number, Object] as PropType<BlockSizeProp>,
    width: [String, Number, Object] as PropType<DisplayRuleProp>,
    hidden: [Boolean, String, Array] as PropType<HiddenRuleProp>,
    height: [String, Number, Object] as PropType<DisplayRuleProp>,

    ...makeComponentProps(),
    ...makeTagProps()
}, 'EvBlock');


/**
 * # createBreakpointClasses
 *
 * @param props
 * @param propName
 * @param prefix
 * @param useXs
 */
export function useBreakpointClasses<
    PropsObject extends object,
    PropName extends Extract<keyof PropsObject, string>,
    Prefix extends string | undefined,
    UseXs extends boolean
> (
    props: PropsObject,
    propName: PropName,
    prefix: Prefix = undefined as Prefix,
    useXs: UseXs = false as UseXs
) {
    return computed(() => {
        const prop = props[propName] as ResponsiveProp;
        if (!prop) {
            return [];
        }
        const classes = [];
        const values = (typeof prop !== 'object')
            ? { xs: prop } as ResponsivePropObject
            : prop;
        for (const [breakpoint, value] of Object.entries(values)) {
            const className = [];
            if (prefix) {
                className.push(prefix);
            }
            if (useXs || breakpoint !== 'xs') {
                className.push(breakpoint);
            }
            className.push(value);
            classes.push(className.join('-'));
        }
        return classes;
    });
}

/**
 * # useDisplayRuleClasses
 *
 * @param props
 * @param propName
 * @param prefix
 */
export function useDisplayRuleClasses<
    PropsObject extends object,
    PropName extends Extract<keyof PropsObject, string>,
    Prefix extends string | undefined
> (
    props: PropsObject,
    propName: PropName,
    prefix: Prefix = undefined as Prefix
) {
    return computed(() => {
        const prop = props[propName];
        if (!prop) {
            return [];
        }
        const classes = [];
        const rules = !Array.isArray(prop) ? [prop] : prop;
        if (Array.isArray(rules)) {
            for (const rule of rules) {
                if (!isString(rule)) {
                    // Gracefully ignore anything that is not a string.
                    continue;
                }
                const ruleKebab = toKebabCase(rule);
                if (!isDisplayRule(rule)) {
                    consoleWarn(`The display rule '${rule}' is not valid and will be ignored.`);
                    continue;
                }
                classes.push(`${prefix}-${ruleKebab}`);
            }
        }
        return classes;
    });
}