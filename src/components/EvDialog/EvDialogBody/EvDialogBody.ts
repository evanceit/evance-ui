import { propsFactory } from "@/util";
import {
    EvCardContentProps,
    makeEvCardContentProps,
} from "@/components/EvCard/EvCardContent";

export interface EvDialogBodyProps extends EvCardContentProps {
    padding?: boolean;
}

export const makeEvDialogBodyProps = propsFactory(
    {
        padding: {
            type: Boolean,
            default: true,
        },
        ...makeEvCardContentProps(),
    },
    "EvDialogBody",
);