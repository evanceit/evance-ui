import {App} from "vue";
import {EvNotificationServiceSymbol} from "@/components/EvNotifications";
import {EvNotificationsManager} from "@/components/EvNotifications/EvNotificationsManager.ts";

/**
 * # EvNotificationService
 */
export default {
    install: (app: App) => {

        const service = new EvNotificationsManager();

        // For options API - use with `this.$dialog`
        app.config.globalProperties.$notification = service;

        // For composition API - use with `useDialog()`
        app.provide(EvNotificationServiceSymbol, service);
    }
};