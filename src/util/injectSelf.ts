// Utilities

// Types
import type { ComponentInternalInstance, InjectionKey } from "vue";
import { getCurrentComponent } from "@/util/components.ts";

export function injectSelf<T>(
    key: InjectionKey<T> | string,
    vm?: ComponentInternalInstance,
): T | undefined;
export function injectSelf(
    key: InjectionKey<any> | string,
    component = getCurrentComponent("injectSelf"),
) {
    const { provides } = component as { provides?: any };

    if (provides && (key as string | symbol) in provides) {
        // TS doesn't allow symbol as index type
        return provides[key as string];
    }
    return undefined;
}
