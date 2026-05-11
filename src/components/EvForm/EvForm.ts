import { propsFactory } from "@/util";
import { ComponentProps, makeComponentProps } from "@/composables/component";
import { FormProps, makeFormProps } from "@/composables/form";
import { PropType } from "vue";
import { SpacerProp } from "@/components/EvGrid";

export interface EvFormProps extends FormProps, ComponentProps {}

export const makeEvFormProps = propsFactory(
    {
        gap: {
            type: [String, Number, Object] as PropType<SpacerProp>,
            default: "300",
        },

        ...makeComponentProps(),
        ...makeFormProps(),
    },
    "EvForm",
);
