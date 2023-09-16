import {propsFactory} from "@/util";
import {makeFormFieldProps} from "@/composables/validation.ts";
import {makeComponentProps} from "@/composables/component.ts";

export const makeEvCheckboxProps = propsFactory({
    value: String,

    ...makeFormFieldProps(),
    ...makeComponentProps()
}, 'EvSwitch');