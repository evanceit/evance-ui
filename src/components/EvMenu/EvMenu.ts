import {propsFactory} from "../../util";
import {makeEvOverlayProps} from "../EvOverlay";

export const makeEvMenuProps = propsFactory({
    id: String,

    ...makeEvOverlayProps({
        closeDelay: 250,
        closeOnContentClick: true,
        positionStrategy: 'connected' as const,
        openDelay: 250,
        veil: false,
        scrollStrategy: 'reposition' as const
    })
}, 'EvMenu');