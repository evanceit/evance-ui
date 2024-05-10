import { inject, InjectionKey, provide } from "vue";
import { EvDrawerInstance } from "@/components/EvDrawer/EvDrawerInstance.ts";
import { EvDrawerServiceOpener } from "@/components/EvDrawer/EvDrawerServiceOpener.ts";

export const EvDrawerServiceSymbol: InjectionKey<EvDrawerServiceOpener> =
    Symbol.for("ev:drawer-service");
export const EvDrawerInstanceSymbol: InjectionKey<
    EvDrawerInstance | undefined
> = Symbol.for("ev:drawer-instance");

/**
 * # useDrawer
 *
 * Requires that the App has provided `EvDrawerService`.
 */
export function useDrawer(): EvDrawerServiceOpener {
    const service = inject(EvDrawerServiceSymbol);
    if (!service) {
        throw new Error("Evance UI: Unable to find injected drawer service");
    }
    return service;
}

/**
 * # injectDrawer
 */
export function injectDrawer(): EvDrawerInstance | undefined {
    return inject(EvDrawerInstanceSymbol);
}

/**
 * # provideDrawer
 * @param instance
 */
export function provideDrawer(instance: EvDrawerInstance | undefined) {
    provide(EvDrawerInstanceSymbol, instance);
}
