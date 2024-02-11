import {propsFactory} from "@/util";
import {makeEvMessageProps} from "../EvMessage";

export const makeEvNotificationProps = propsFactory({
    zIndex: {
        type: [Number, String],
        default: 2000,
    },
    timeout: Number,

    ...makeEvMessageProps({
        tag: 'div' as const,
        dismissDelay: true as const
    })
}, 'EvNotification');