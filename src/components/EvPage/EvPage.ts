import { propsFactory } from "@/util";
import { makeComponentProps } from "@/composables";
import { PropType } from "vue";
import { ContainerSizeProp } from "@/components/EvGrid/EvContainer";

export const makeEvPageProps = propsFactory(
    {
        sunken: Boolean,
        inlineSize: String as PropType<ContainerSizeProp>,

        ...makeComponentProps(),
    },
    "EvPage",
);