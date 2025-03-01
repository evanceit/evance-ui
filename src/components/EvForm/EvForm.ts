import { propsFactory } from "@/util";
import { makeComponentProps } from "@/composables/component";
import { makeFormProps } from "@/composables/form";

export const makeEvFormProps = propsFactory(
    {
        ...makeComponentProps(),
        ...makeFormProps(),
    },
    "EvForm",
);
