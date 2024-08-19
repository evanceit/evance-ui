import { propsFactory } from "@/util";
import { makeEvCardContentProps } from "@/components/EvCard";

export const makeEvFormHelpProps = propsFactory(
    {
        ...makeEvCardContentProps({
            size: "small",
        }),
    },
    "EvFormHelp",
)