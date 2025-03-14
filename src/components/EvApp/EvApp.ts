import { propsFactory } from "@/util";
import { makeComponentProps } from "@/composables";
import { makeThemeProps } from "@/composables/theme";

export const makeEvAppProps = propsFactory(
    {
        ...makeComponentProps(),
        ...makeThemeProps(),
    },
    "EvApp",
);
