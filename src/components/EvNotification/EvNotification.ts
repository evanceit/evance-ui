import {propsFactory} from "@/util";
import {makeEvMessageProps} from "../EvMessage";

export const makeEvNotificationProps = propsFactory({
    ...makeEvMessageProps({
        tag: 'div' as const
    })
}, 'EvNotification');