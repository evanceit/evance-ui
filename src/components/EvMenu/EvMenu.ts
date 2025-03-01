import { AnchorSelector, propsFactory } from "@/util";
import { makeEvOverlayProps } from "@/components/EvOverlay/EvOverlay";
import EvMenuTransition from "./EvMenuTransition.vue";

export const makeEvMenuProps = propsFactory(
    {
        id: String,

        ...makeEvOverlayProps({
            closeDelay: 250,
            closeOnContentClick: true,
            position: "bottom-start" as AnchorSelector,
            positionStrategy: "connected" as const,
            openDelay: 250,
            veil: false,
            scrollStrategy: "reposition" as const,
            transition: { component: EvMenuTransition },
        }),
    },
    "EvMenu",
);
