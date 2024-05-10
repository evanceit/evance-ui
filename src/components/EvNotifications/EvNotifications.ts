import { EvNotificationProps, EvNotificationSlots } from "../EvNotification";

/**
 * # EvNotificationServiceOptions
 */
export interface EvNotificationOptions {
    props: EvNotificationProps;
    slots?: EvNotificationSlots;
}

export interface Notification {
    id: number;
    props: EvNotificationProps;
    slots: EvNotificationSlots;
}
