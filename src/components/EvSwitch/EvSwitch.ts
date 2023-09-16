import {propsFactory} from "@/util";
import {makeComponentProps} from "@/composables/component.ts";
import {makeFormFieldProps} from "@/composables/validation.ts";


export const makeEvSwitchProps = propsFactory({

    ...makeFormFieldProps(),
    ...makeComponentProps()
}, 'EvSwitch');