import { AppearanceProp, propsFactory } from "@/util";
import { IconProp, IconValue } from "@/composables/icons";
import { PropType } from "vue";
import { makeComponentProps } from "@/composables/component";

export type EvCardContentSize = "small" | "medium" | "large" | "x-large";

export interface EvCardContentProps {
    appearance?: AppearanceProp;
    eyebrow?: string;
    icon?: IconValue;
    size?: EvCardContentSize;
    text?: string | string[];
    title?: string;
}

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
