import { inject, InjectionKey, provide } from "vue";
import { EvDialogInstance } from "@/components/EvDialog/EvDialogInstance";
import { EvDialogServiceOpener } from "@/components/EvDialog/EvDialogServiceOpener";

export const EvDialogServiceSymbol: InjectionKey<EvDialogServiceOpener> =
    Symbol.for("ev:dialog-service");
export const EvDialogInstanceSymbol: InjectionKey<
    EvDialogInstance | undefined
> = Symbol.for("ev:dialog-instance");

/**
 * # useDialog
 *
 * Requires that the App has provided `EvDialogService`.
 */
export function useDialog(): EvDialogServiceOpener {
    const dialogService = inject(EvDialogServiceSymbol);
    if (!dialogService) {
        throw new Error("Evance UI: Unable to find injected dialog service");
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
