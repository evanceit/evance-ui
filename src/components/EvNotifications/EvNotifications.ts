import {EvNotificationProps, EvNotificationSlots} from "../EvNotification";
import {inject, InjectionKey} from "vue";
import {EvNotificationsManager} from "./EvNotificationsManager.ts";

/**
 * # EvNotificationServiceOptions
 */
export interface EvNotificationOptions {
    props: EvNotificationProps,
    slots?: EvNotificationSlots
}

export interface Notification {
    id: number,
    props: EvNotificationProps,
    slots: EvNotificationSlots
}

export const EvNotificationServiceSymbol: InjectionKey<EvNotificationsManager> = Symbol.for('ev:notification-service');

/**
 * # injectNotifications
 */
export function injectNotifications() {
    const service = inject(EvNotificationServiceSymbol);
    if (!service) {
        throw new Error('Unable to find inject notification service');
    }
    return service;
}

/**
 * # useNotification
 */
export function useNotification() {
    const service = injectNotifications();
    return {
        add: (options: EvNotificationOptions) => {
            return service.add(options);
        },
        dismiss: (id: number) => {
            return service.dismiss(id);
        }
    };
}