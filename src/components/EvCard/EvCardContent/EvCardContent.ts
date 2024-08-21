import { AppearanceProp, propsFactory } from "@/util";
import { IconProp } from "@/composables/icons.ts";
import { PropType } from "vue";
import { makeComponentProps } from "@/composables/component.ts";

export type EvCardContentSize = "small" | "medium" | "large" | "x-large";

export const makeEvCardContentProps = propsFactory(
    {
        appearance: String as PropType<AppearanceProp>,
        eyebrow: String,
        icon: IconProp,
        size: {
            type: String as PropType<EvCardContentSize>,
            default: "medium",
        },
        text: [String, Array],
        title: String,
        ...makeComponentProps(),
    },
    "EvCardContent",
);
