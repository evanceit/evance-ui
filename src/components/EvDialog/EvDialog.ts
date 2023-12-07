import {propsFactory} from "@/util";
import {makeEvOverlayProps} from "@/components/EvOverlay";
import EvDialogTransition from "@/components/EvDialog/EvDialogTransition.vue";
import {Component} from "vue";


export const makeEvDialogProps = propsFactory({

    fullscreen: Boolean,
    retainFocus: {
        type: Boolean,
        default: true,
    },
    scrollable: Boolean,

    ...makeEvOverlayProps({
        origin: 'center center' as const,
        scrollStrategy: 'block' as const,
        positionStrategy: 'static' as const,
        transition: {
            component: EvDialogTransition as Component
        },
        zIndex: 2400,
    })

}, 'EvDialog');