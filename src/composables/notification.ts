import { inject, InjectionKey } from "vue";
import { EvNotificationsManager } from "@/components/EvNotifications";
import { EvNotificationProps, EvNotificationSlots } from "@/components";

export const EvNotificationServiceSymbol: InjectionKey<EvNotificationsManager> =
    Symbol.for("ev:notification-service");

/**
 * # injectNotifications
 */
export function injectNotifications() {
    const service = inject(EvNotificationServiceSymbol);
    if (!service) {
        throw new Error(
            "Evance UI: Unable to find inject notification service.",
        );
    }
    return service;
}

/**
 * # useNotification
 */
export function useNotification() {
    const service = injectNotifications();
    return {
        add: (props: EvNotificationProps, slots?: EvNotificationSlots) => {
            return service.add(props, slots);
        },
        dismiss: (id: number) => {
            return service.dismiss(id);
        },
    };
}
