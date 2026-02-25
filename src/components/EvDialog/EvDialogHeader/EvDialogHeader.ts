import { propsFactory } from "@/util";
import { makeEvToolbarProps } from "@/components/EvToolbar";

export const makeEvDialogHeaderProps = propsFactory(
    {
        modelValue: Boolean,
        closeable: {
            type: Boolean,
            default: true,
        },
        ...makeEvToolbarProps({
            size: "large",
        }),
    },
    "EvDialogHeader",
);