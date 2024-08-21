import { AppearanceProp, propsFactory } from "@/util";
import { IconProp } from "@/composables/icons.ts";
import { PropType } from "vue";
import { makeComponentProps } from "@/composables/component.ts";

export type EvCardContentSize = "small" | "medium" | "large" | "x-large";

export const makeEvCardContentProps = propsFactory(
    {
        appearance: String as PropType<AppearanceProp>,
        description: [String, Array],
        eyebrow: String,
        icon: IconProp,
        size: {
            type: String as PropType<EvCardContentSize>,
            default: "medium",
        },
        title: String,
        ...makeComponentProps(),
    },
    "EvCardContent",
);
