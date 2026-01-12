import { propsFactory } from "@/util";
import { makeComponentProps } from "@/composables/component";
import { PropType } from "vue";

export const KbdVariant = {
    default: "default",
    tonal: "tonal",
    outlined: "outlined",
    bold: "bold",
    text: "text",
};
export type KbdVariantProp = (typeof KbdVariant)[keyof typeof KbdVariant];

export const makeEvKbdProps = propsFactory(
    {
        value: String,
        variant: String as PropType<KbdVariantProp>,

        ...makeComponentProps(),
    },
    "EvKbd",
);
