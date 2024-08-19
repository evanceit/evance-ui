import { propsFactory } from "@/util";
import { makeEvCardContentProps } from "@/components/EvCard";

export const makeEvFieldHelpProps = propsFactory(
    {
        ...makeEvCardContentProps({
            size: "small",
        }),
    },
    "EvFieldHelp",
)