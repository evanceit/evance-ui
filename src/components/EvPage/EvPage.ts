import { propsFactory } from "@/util";
import { makeComponentProps } from "@/composables";

export const makeEvPageProps = propsFactory(
    {
        ...makeComponentProps(),
    },
    "EvPage",
);