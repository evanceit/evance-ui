import { propsFactory } from "@/util";
import { PropType } from "vue";
import { makeComponentProps } from "@/composables/component";
import { makeDimensionsProps } from "@/composables/dimensions";

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
