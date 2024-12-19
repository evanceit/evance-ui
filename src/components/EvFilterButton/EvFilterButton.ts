import { omit, propsFactory } from "@/util";
import { makeEvButtonProps } from "@/components/EvButton";
import { PropType } from "vue";

export const makeEvFilterButtonProps = propsFactory(
    {
        title: String,
        modelValue: {
            type: Array as PropType<readonly string[]>,
            default: () => [],
        },
        filterTitle: {
            type: String,
            default: "title",
        },
        ...omit(makeEvButtonProps(), ["text", "value"]),
    },
    "EvFilterButton",
)