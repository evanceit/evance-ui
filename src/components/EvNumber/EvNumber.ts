import { NumberFormat, propsFactory } from "@/util";
import { makeComponentProps } from "@/composables";
import { PropType } from "vue";



export const makeEvNumberProps = propsFactory(
    {
        prefix: String,
        suffix: String,
        format: Object as PropType<NumberFormat>,
        value: [Number, String],
        duration: Number,
        ...makeComponentProps(),
    },
    "EvNumber",
);