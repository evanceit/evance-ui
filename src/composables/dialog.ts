import {inject} from "vue";

export const EvDialogSymbol = Symbol.for('ev:dialog');

/**
 * # useDialog
 *
 * Requires that the App has provided `EvDialogService`.
 */
export function useDialog() {
    const dialogService = inject(EvDialogSymbol);
    if (!dialogService) {
        throw new Error('Unable to find injected dialog service');
    }
    return dialogService;
}