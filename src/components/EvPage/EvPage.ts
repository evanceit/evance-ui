import { propsFactory } from "@/util";
import { makeComponentProps } from "@/composables";
import { PropType } from "vue";
import { ContainerSizeProp } from "@/components/EvGrid/EvContainer";
import { SurfaceElevation } from "@/components/EvSurface";

export const makeEvPageProps = propsFactory(
    {
        inlineSize: String as PropType<ContainerSizeProp>,
        elevation: {
            type: String as PropType<SurfaceElevation>,
            default: "sunken",
        },
        ...makeComponentProps(),
    },
    "EvPage",
);