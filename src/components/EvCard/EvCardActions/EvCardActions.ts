import { omit, propsFactory } from "@/util";
import { PropType } from "vue";
import { JustifyContentValue } from "@/components/EvGrid/EvLayout";
import { EvCardContentSize } from "@/components/EvCard/EvCardContent";
import {
    EvButtonGroupProps,
    makeEvButtonGroupProps,
} from "@/components/EvButtonGroup";

export interface EvCardActionsProps extends EvButtonGroupProps {
    justify?: JustifyContentValue;
    size?: EvCardContentSize;
}

export const makeEvCardActionsProps = propsFactory(
    {
        justify: {
            type: String as PropType<JustifyContentValue>,
            default: "end",
        },
        size: {
            type: String as PropType<EvCardContentSize>,
            default: "medium",
        },

        ...omit(makeEvButtonGroupProps(), ["size"]),
    },
    "EvCardActions",
);
