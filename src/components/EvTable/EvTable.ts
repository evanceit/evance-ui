import { isBoolean, propsFactory } from "@/util";
import { makeComponentProps, makeTagProps } from "@/composables";
import { PropType } from "vue";

export type Gridlines = "horizontal" | "vertical" | "all";

export const makeEvTableProps = propsFactory(
    {
        hover: Boolean,
        density: {
            type: String as PropType<"default" | "compact" | "comfortable">,
            default: "default",
            validator: (v: any) => {
                return ["default", "compact", "comfortable"].includes(v);
            },
        },
        gridlines: {
            type: [Boolean, String] as PropType<boolean | Gridlines>,
            default: "horizontal",
            validator: (v: any) => {
                return (
                    isBoolean(v) ||
                    ["horizontal", "vertical", "all"].includes(v)
                );
            },
        },

        ...makeComponentProps(),
        ...makeTagProps(),
    },
    "EvTable",
);
