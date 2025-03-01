import { propsFactory } from "@/util";
import { makeComponentProps } from "@/composables/component";

export const makeEvEditOnClickProps = propsFactory(
    {
        editing: Boolean,
        modelValue: null,
        persistent: Boolean,

        ...makeComponentProps(),
    },
    "EvEditOnClick",
)
