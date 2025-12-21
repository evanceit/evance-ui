import { omit, propsFactory } from "@/util";
import { makeEvTextfieldProps } from "@/components";
import { TimeIcon } from "@/icons";

export const makeEvTimeFieldProps = propsFactory(
    {
        ...omit(
            makeEvTextfieldProps({
                iconStart: TimeIcon,
            }),
            ["type"],
        ),
    },
    "EvTimeField",
);