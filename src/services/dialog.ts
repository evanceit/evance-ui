import {App} from "vue";
import {EvDialogServiceSymbol} from "@/composables/dialog.ts";
import {EvDialogServiceOpener} from "@/components/EvDialog/EvDialogServiceOpener.ts";

/**
 * # EvDialogService
 */
export default {
    install: (app: App) => {
        const service = new EvDialogServiceOpener(app);

        // For options API - use with `this.$dialog`
        app.config.globalProperties.$dialog = service;

        // For composition API - use with `useDialog()`
        app.provide(EvDialogServiceSymbol, service);
    }
};