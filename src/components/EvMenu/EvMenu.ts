import {propsFactory} from "../../util";
import {makeEvOverlayProps} from "../EvOverlay";
import {Component} from "vue";
import EvMenuTransition from "./EvMenuTransition.vue";

export const makeEvMenuProps = propsFactory({
    id: String,

    ...makeEvOverlayProps({
        closeDelay: 250,
        closeOnContentClick: true,
        position: 'bottom-start',
        positionStrategy: 'connected' as const,
        openDelay: 250,
        veil: false,
        scrollStrategy: 'reposition' as const,
        transition: { component: EvMenuTransition as Component }
    })
}, 'EvMenu');