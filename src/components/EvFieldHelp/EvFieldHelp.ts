import { propsFactory } from "@/util";
import { makeComponentProps } from "@/composables/component.ts";
import { PropType } from "vue";
import { Breakpoint } from "@/composables/display.ts";

export const makeEvFieldHelpProps = propsFactory(
    {
        breakpoint: String as PropType<Breakpoint>,
        ...makeComponentProps(),
    },
    "EvFieldHelp",
);
