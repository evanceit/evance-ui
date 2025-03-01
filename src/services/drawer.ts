import { App } from "vue";
import { EvDrawerServiceSymbol } from "@/composables/drawer";
import { EvDrawerServiceOpener } from "@/components/EvDrawer/EvDrawerServiceOpener";

/**
 * # EvDialogService
 */
export default {
    install: (app: App) => {
        const service = new EvDrawerServiceOpener(app);

        // For options API - use with `this.$drawer`
        app.config.globalProperties.$drawer = service;

        // For composition API - use with `useDrawer()`
        app.provide(EvDrawerServiceSymbol, service);
    },
};
