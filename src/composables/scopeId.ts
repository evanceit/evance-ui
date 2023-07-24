import {getCurrentComponent} from "../util";

export function useScopeId() {
    const component = getCurrentComponent('useScopeId');
    const scopeId = component!.vnode.scopeId;
    return {
        scopeId: scopeId ? { [scopeId]: '' } : undefined
    };
}
