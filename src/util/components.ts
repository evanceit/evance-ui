import { ComponentInternalInstance, getCurrentInstance } from "vue";

/**
 * # Get Current Component
 *
 * Gets the current instance of component from vue.
 *
 * @param callee
 */
export function getCurrentComponent(callee: string): ComponentInternalInstance {
    const component = getCurrentInstance();
    if (!component) {
        throw new Error(`Evance UI: ${callee} requires a component instance`);
    }
    return component;
}
