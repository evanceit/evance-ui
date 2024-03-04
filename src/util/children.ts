import {ComponentInternalInstance, InjectionKey, VNodeChild} from "vue";


/**
 * # findChildren
 *
 * @param vnode
 */
export function findChildren(vnode?: VNodeChild): ComponentInternalInstance[] {
    if (!vnode || typeof vnode !== 'object') {
        return [];
    }
    if (Array.isArray(vnode)) {
        return vnode
            .map(child => findChildren(child))
            .filter(v => v)
            .flat(1);
    } else if (Array.isArray(vnode.children)) {
        return vnode.children
            .map(child => findChildren(child))
            .filter(v => v)
            .flat(1);
    } else if (vnode.component) {
        return [vnode.component, ...findChildren(vnode.component?.subTree)]
            .filter(v => v)
            .flat(1);
    }
    return [];
}


/**
 * # findChildrenWithProvide
 *
 * @param key
 * @param vnode
 */
export function findChildrenWithProvide(
    key: InjectionKey<any> | symbol,
    vnode?: VNodeChild,
): ComponentInternalInstance[] {
    if (!vnode || typeof vnode !== 'object') {
        return [];
    }
    if (Array.isArray(vnode)) {
        return vnode
            .map(child => findChildrenWithProvide(key, child))
            .flat(1);
    } else if (Array.isArray(vnode.children)) {
        return vnode.children
            .map(child => findChildrenWithProvide(key, child))
            .flat(1);
    } else if (vnode.component) {
        if (Object.getOwnPropertySymbols(vnode.component.provides).includes(key as symbol)) {
            return [vnode.component];
        } else if (vnode.component.subTree) {
            return findChildrenWithProvide(key, vnode.component.subTree).flat(1);
        }
    }
    return [];
}