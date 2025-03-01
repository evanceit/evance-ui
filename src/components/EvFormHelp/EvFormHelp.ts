import { propsFactory } from "@/util";
import { PropType } from "vue";
import { Breakpoint } from "@/composables/display";
import { makeComponentProps } from "@/composables/component";

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
