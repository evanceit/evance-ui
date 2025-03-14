import { propsFactory } from "@/util";
import { makeComponentProps } from "@/composables";
import { makeThemeProps } from "@/composables/theme";
import { PropType } from "vue";

export type ThemeScope = "body" | "app";

export const makeEvAppProps = propsFactory(
    {
        themeScope: {
            type: String as PropType<ThemeScope>,
            default: "body",
        },
        ...makeComponentProps(),
        ...makeThemeProps(),
    },
    "EvApp",
);
