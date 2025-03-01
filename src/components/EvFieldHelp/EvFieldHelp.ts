import { propsFactory } from "@/util";
import { makeComponentProps } from "@/composables/component";
import { PropType } from "vue";
import { Breakpoint } from "@/composables/display";

export const makeEvFieldHelpProps = propsFactory(
    {
        breakpoint: String as PropType<Breakpoint>,
        ...makeComponentProps(),
    },
    "EvFieldHelp",
);
