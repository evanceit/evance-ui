import {propsFactory} from "@/util";
import {makeComponentProps} from "@/composables/component.ts";
import {makeTagProps} from "@/composables/tag.ts";
import {DisplayBreakpoint} from "@/composables/display.ts";
import {computed, PropType} from "vue";


export type BlockNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export type BlockSize = 'auto' | 'grow' | BlockNumber;
export type BlockSizes = {
    [key in DisplayBreakpoint]: BlockSize
};
export type BlockSizeProp = BlockSize | BlockSizes;

export type ResponsivePropValue = string | number | boolean;
export type ResponsivePropObject = {
    [key in DisplayBreakpoint]: ResponsivePropValue
};
export type ResponsiveProp = ResponsivePropValue | ResponsivePropObject | undefined;

/**
 * # makeEvBlockProps
 */
export const makeEvBlockProps = propsFactory({

    scrollable: Boolean,
    size: [String, Number] as PropType<BlockSizeProp>,

    ...makeComponentProps(),
    ...makeTagProps()
}, 'EvBlock');

/**
 * # createBreakpointClasses
 *
 * @param props
 * @param propName
 * @param prefix
 */
export function useBreakpointClasses<
    PropsObject extends object,
    PropName extends Extract<keyof PropsObject, string>,
    Prefix extends string | undefined
> (
    props: PropsObject,
    propName: PropName,
    prefix: Prefix = undefined as Prefix
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
            classes.push(`${prefix ? `${prefix}-${breakpoint}-${value}` : `${breakpoint}-${value}`}`);
        }
        return classes;
    });
}