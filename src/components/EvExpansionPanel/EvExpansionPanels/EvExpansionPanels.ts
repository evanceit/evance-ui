import { propsFactory } from "@/util";
import { makeComponentProps, makeTagProps } from "@/composables";
import { makeGroupProps } from "@/composables/group";
import { PropType } from "vue";

const allowedVariants = ["default", "accordion", "spaced"] as const;

type ExpansionPanelsVariant = (typeof allowedVariants)[number];

export const makeEvExpansionPanelsProps = propsFactory(
    {
        variant: {
            type: String as PropType<ExpansionPanelsVariant>,
            default: "default",
            validator: (v: string) =>
                allowedVariants.includes(v as ExpansionPanelsVariant),
        },
        ...makeGroupProps(),
        ...makeComponentProps(),
        ...makeTagProps(),
    },
    "EvExpansionPanels",
);
