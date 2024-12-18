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
        ...omit(makeEvButtonProps(), ["text", "value"]),
    },
    "EvFilterButton",
)