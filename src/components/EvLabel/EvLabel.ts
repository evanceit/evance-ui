import {propsFactory} from "@/util";
import {makeComponentProps} from "@/composables/component.ts";


export const makeEvLabelProps = propsFactory({
    text: String,
    clickable: Boolean,

    ...makeComponentProps()
}, 'EvLabel');