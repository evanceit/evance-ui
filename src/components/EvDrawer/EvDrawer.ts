import { omit, PhysicalSide, propsFactory } from "@/util";
import {
    EvDialogProps,
    EvDialogSlots,
    makeEvDialogProps,
} from "@/components/EvDialog";
import { PropType } from "vue";

export interface EvDrawerProps extends EvDialogProps {}
export interface EvDrawerSlots extends EvDialogSlots {}

export const makeEvDrawerProps = propsFactory(
    {
        position: {
            type: String as PropType<PhysicalSide>,
            default: "left",
        },

        ...omit(makeEvDialogProps(), ["position"]),
    },
    "EvDrawer",
);
