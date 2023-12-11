import {App} from "vue";
import {EvDialogServiceSymbol} from "@/composables/dialog.ts";
import {EvDialogService} from "@/components/EvDialog/EvDialogService.ts";

/**
 * # EvDialogService
 */
export const EvDialogServiceInstaller = {
    install: (app: App) => {
        const service = new EvDialogService(app);

        // For options API - use with `this.$dialog`
        app.config.globalProperties.$dialog = service;

        // For composition API - use with `useDialog()`
        app.provide(EvDialogServiceSymbol, service);
    }
};

export default EvDialogServiceInstaller;



