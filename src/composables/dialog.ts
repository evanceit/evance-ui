import {inject, InjectionKey, provide} from "vue";
import {EvDialogInstance} from "@/components/EvDialog/EvDialogInstance.ts";
import {EvDialogService} from "@/components/EvDialog/EvDialogService.ts";

export const EvDialogServiceSymbol: InjectionKey<EvDialogService> = Symbol.for('ev:dialog-service');
export const EvDialogInstanceSymbol: InjectionKey<EvDialogInstance | undefined> = Symbol.for('ev:dialog-instance');

/**
 * # useDialog
 *
 * Requires that the App has provided `EvDialogService`.
 */
export function useDialog(): EvDialogService {
    const dialogService = inject(EvDialogServiceSymbol);
    if (!dialogService) {
        throw new Error('Unable to find injected dialog service');
    }
    return dialogService;
}

/**
 * # injectDialog
 */
export function injectDialog(): EvDialogInstance | undefined {
    return inject(EvDialogInstanceSymbol);
}

/**
 * # provideDialog
 * @param instance
 */
export function provideDialog(instance: EvDialogInstance | undefined) {
    provide(EvDialogInstanceSymbol, instance);
}