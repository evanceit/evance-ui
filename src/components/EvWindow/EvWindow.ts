import {GroupProvide} from "@/composables/group.ts";
import {ComputedRef, Ref, InjectionKey, PropType} from "vue";
import {GroupItemProvide} from "@/composables/groupItem.ts";
import {propsFactory} from "@/util";
import {makeComponentProps} from "@/composables/component.ts";
import {makeTagProps} from "@/composables/tag.ts";
import {IconProp} from "@/composables/icons.ts";
import {ArrowBack, ArrowContinue} from "@/icons";
import {TouchHandlers} from "@/directives";


export type EvWindowSlots = {
    default: {
        group: GroupProvide
    }
}

export type WindowProvide = {
    transition: ComputedRef<undefined | string>,
    transitionCount: Ref<number>,
    transitionHeight: Ref<undefined | string>,
    isReversed: Ref<boolean>,
    rootRef: Ref<HTMLElement | undefined>
};

export const EvWindowSymbol: InjectionKey<WindowProvide> = Symbol.for('ev:window');
export const EvWindowGroupSymbol: InjectionKey<GroupItemProvide> = Symbol.for('ev:window-group');

export const makeEvWindowProps = propsFactory({
    continuous: Boolean,
    direction: {
        type: String as PropType<'horizontal' | 'vertical'>,
        default: 'horizontal',
    },
    disabled: Boolean,
    iconNext: {
        type: IconProp,
        default: ArrowContinue
    },
    iconPrevious: {
        type: IconProp,
        default: ArrowBack
    },
    // TODO: mandatory should probably not be exposed but do this for now
    mandatory: {
        type: [Boolean, String] as PropType<boolean | 'force'>,
        default: 'force' as const,
    },
    modelValue: null,
    reverse: Boolean,
    selectedClass: {
        type: String,
        default: 'is-active',
    },
    showArrows: {
        type: [Boolean, String],
        validator: (v: any) => typeof v === 'boolean' || v === 'hover',
    },
    touch: {
        type: [Object, Boolean] as PropType<boolean | TouchHandlers>,
        default: undefined,
    },

    ...makeComponentProps(),
    ...makeTagProps()

}, 'EvWindow');