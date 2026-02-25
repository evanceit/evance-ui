import { omit, propsFactory } from "@/util";
import {
    EvCardActionsProps,
    makeEvCardActionsProps,
} from "@/components/EvCard/EvCardActions";
import { PropType } from "vue";
import { EvButtonProps } from "@/components/EvButton";

export interface EvDialogFooterProps extends Omit<EvCardActionsProps, "items"> {
    actions: EvButtonProps[];
}

export const makeEvDialogFooterProps = propsFactory(
    {
        actions: {
            type: Array as PropType<readonly EvButtonProps[]>,
            default: () => [],
        },
        ...omit(makeEvCardActionsProps(), ["items"]),
    },
    "EvDialogFooter",
);
