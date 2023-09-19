import {omit, propsFactory} from "@/util";
import {makeEvOverlayProps} from "@/components";


export const makeEvTooltipProps = propsFactory({
    id: String,
    text: String,

    ...omit(makeEvOverlayProps({
        closeOnBack: false,
        position: 'end' as const,
        positionStrategy: 'connected' as const,
        minWidth: 0,
        offset: 10,
        openOnClick: false,
        openOnHover: true,
        origin: 'auto' as const,
        veil: false,
        scrollStrategy: 'reposition' as const,
        transition: false
    }), [
        'absolute',
        'persistent'
    ])

}, 'EvTooltip');