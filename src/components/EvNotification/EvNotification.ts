import {propsFactory} from "@/util";
import {EvMessageProps, EvMessageSlots, makeEvMessageProps} from "../EvMessage";


/**
 * # EvNotificationProps
 */
export interface EvNotificationProps extends EvMessageProps {
    timeout?: number
}

export interface EvNotificationSlots extends EvMessageSlots {}


/**
 * # makeEvNotificationProps
 */
export const makeEvNotificationProps = propsFactory({
    timeout: Number,
    zIndex: {
        type: [Number, String],
        default: 2000,
    },

    ...makeEvMessageProps({
        tag: 'div' as const,
        dismissible: true,
        dismissDelay: true as const,
        variant: 'subtle'
    })
}, 'EvNotification');