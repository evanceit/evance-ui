import { propsFactory } from "@/util";
import { PropType } from "vue";
import { Breakpoint } from "@/composables/display.ts";
import { makeComponentProps } from "@/composables/component.ts";

export const makeEvFormHelpProps = propsFactory(
    {
        breakpoint: {
            type: String as PropType<Breakpoint>,
            default: "md",
        },
        ...makeComponentProps(),
    },
    "EvFormHelp",
);
