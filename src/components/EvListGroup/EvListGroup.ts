import { propsFactory } from "@/util";
import { makeEvListItemProps } from "@/components/EvListItem";

export const makeEvListGroupProps = propsFactory(
    {
        ...makeEvListItemProps(),
    },
    "EvListItemGroup",
);