import { propsFactory } from "@/util";
import { PropType } from "vue";
import { makeComponentProps } from "@/composables/component.ts";
import { makeDimensionsProps } from "@/composables/dimensions.ts";

export const makeEvDataTableCellProps = propsFactory(
    {
        align: String as PropType<"start" | "center" | "end">,
        colspan: Number,
        noPadding: Boolean,
        tag: {
            type: String as PropType<"td" | "th">,
            default: "td",
        },
        ...makeDimensionsProps(),
        ...makeComponentProps(),
    },
    "EvDataTableCell",
);
