import {GroupProvide, makeGroupProps} from "@/composables/group.ts";
import {InjectionKey} from "vue";
import {propsFactory} from "@/util";
import {makeEvButtonGroupProps} from "@/components/EvButtonGroup/EvButtonGroup.ts";


export type ButtonToggleSlotProps = 'isSelected' | 'select' | 'selected' | 'next' | 'prev';
export interface DefaultButtonToggleSlot extends Pick<GroupProvide, ButtonToggleSlotProps> {}

export const EvButtonToggleSymbol: InjectionKey<GroupProvide> = Symbol.for('ev:button-toggle');

export type EvButtonToggleSlots = {
    default: DefaultButtonToggleSlot
}

/**
 * # makeEvButtonToggleProps
 */
export const makeEvButtonToggleProps = propsFactory({
    ...makeEvButtonGroupProps(),
    ...makeGroupProps()
}, 'EvButtonToggle');