import {App} from "vue";
import {EvDialogSymbol} from "@/composables/dialog.ts";

/**
 * EvDialogService
 */
export const EvDialogService = {
    install: (app: App) => {
        const service = {
            open: (options) => {


                console.log('open dialog', options);
            }
        };

        // For options API - use with `this.$dialog`
        app.config.globalProperties.$dialog = service;

        // For composition API - use with `useDialog()`
        app.provide(EvDialogSymbol, service);
    }
};

export default EvDialogService;