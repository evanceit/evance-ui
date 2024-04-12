import {InjectionKey, PropType} from "vue";
import {GroupProvide, makeGroupProps} from "@/composables/group.ts";
import {propsFactory} from "@/util";
import {makeComponentProps} from "@/composables/component.ts";
import {makeTagProps} from "@/composables/tag.ts";
import {IconProp} from "@/composables/icons.ts";
import {ChevronLeft, ChevronRight} from "@/icons";
import {VisibilityRuleProp} from "@/composables/display.ts";


export const EvSlideGroupSymbol: InjectionKey<GroupProvide> = Symbol.for('ev:slide-group');

export interface SlideGroupSlot {
    next: GroupProvide['next'];
    prev: GroupProvide['prev'];
    select: GroupProvide['select'];
    isSelected: GroupProvide['isSelected'];
}

export type EvSlideGroupSlot = {
    default: SlideGroupSlot,
    prev: SlideGroupSlot,
    next: SlideGroupSlot
};


export const makeEvSlideGroupProps = propsFactory({
    centerActive: Boolean,
    direction: {
        type: String as PropType<'horizontal' | 'vertical'>,
        default: 'horizontal',
    },
    iconNext: {
        type: IconProp,
        default: ChevronRight
    },
    iconPrevious: {
        type: IconProp,
        default: ChevronLeft
    },
    arrowsHidden: [Boolean, String, Array] as PropType<VisibilityRuleProp>,
    symbol: {
        type: null,
        default: EvSlideGroupSymbol
    },

    ...makeComponentProps(),
    ...makeTagProps(),
    ...makeGroupProps({
        selectedClass: 'is-active'
    })

}, 'EvSlideGroup');


