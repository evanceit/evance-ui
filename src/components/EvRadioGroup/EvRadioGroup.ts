import {propsFactory} from "@/util";
import {makeComponentProps} from "@/composables/component.ts";
import {makeFormFieldProps} from "@/composables/validation.ts";

export const makeEvRadioGroupProps = propsFactory({
    label: String,

    ...makeFormFieldProps(),
    ...makeComponentProps()

}, 'EvRadioGroup');