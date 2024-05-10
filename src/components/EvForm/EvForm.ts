import { propsFactory } from "@/util";
import { makeComponentProps } from "@/composables/component.ts";
import { makeFormProps } from "@/composables/form.ts";

export const makeEvFormProps = propsFactory(
    {
        ...makeComponentProps(),
        ...makeFormProps(),
    },
    "EvForm",
);
