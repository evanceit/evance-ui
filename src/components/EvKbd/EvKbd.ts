import {InputSize, propsFactory} from "@/util";
import {makeComponentProps} from "@/composables/component.ts";

export const makeEvKbdProps = propsFactory({
    value: String,
    size: String<InputSize>,

    ...makeComponentProps()
}, 'EvKbd');