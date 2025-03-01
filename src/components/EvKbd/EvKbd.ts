import { InputSizeProp, propsFactory } from "@/util";
import { makeComponentProps } from "@/composables/component";
import { PropType } from "vue";

export const makeEvKbdProps = propsFactory(
    {
        value: String,
        size: String as PropType<InputSizeProp>,

        ...makeComponentProps(),
    },
    "EvKbd",
);
