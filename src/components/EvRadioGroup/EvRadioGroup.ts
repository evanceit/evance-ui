import {propsFactory} from "@/util";
import {makeComponentProps} from "@/composables/component.ts";
import {makeFormFieldProps} from "@/composables/validation.ts";
import {InjectionKey, Ref} from "vue";

export interface EvRadioGroupContext {
    modelValue: Ref<any>
}

export const EvRadioGroupSymbol: InjectionKey<EvRadioGroupContext> = Symbol.for('ev:radio-group');

export const makeEvRadioGroupProps = propsFactory({
    label: String,

    ...makeFormFieldProps(),
    ...makeComponentProps()

}, 'EvRadioGroup');