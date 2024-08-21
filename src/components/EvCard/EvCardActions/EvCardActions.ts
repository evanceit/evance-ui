import { propsFactory } from "@/util";
import { makeComponentProps } from "@/composables/component.ts";
import { PropType } from "vue";
import { EvButtonProps } from "@/components/EvButton/EvButton.ts";
import { JustifyContentValue } from "@/components/EvGrid/EvLayout";
import { EvCardContentSize } from "@/components/EvCard/EvCardContent";

export const makeEvCardActionsProps = propsFactory(
    {
        items: {
            type: Array as PropType<readonly EvButtonProps[]>,
            default: () => [],
        },
        justify: {
            type: String as PropType<JustifyContentValue>,
            default: "end",
        },
        size: {
            type: String as PropType<EvCardContentSize>,
            default: "medium",
        },
        ...makeComponentProps(),
    },
    "EvCardActions",
);
