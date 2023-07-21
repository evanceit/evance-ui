import {
    ComponentInternalInstance,
    computed,
    inject,
    InjectionKey,
    onScopeDispose,
    provide,
    reactive,
    readonly, Ref,
    shallowRef,
    toRaw,
    watchEffect
} from "vue";
import {getCurrentComponent} from "../util";
import {useToggleScope} from "./toggleScope.ts";

interface StackProvide {
    activeChildren: Set<number>;
}

const StackSymbol: InjectionKey<StackProvide> = Symbol.for('ev:stack');

type StackEntry = [componentId: number, zIndex: number];

const globalStack = reactive<StackEntry[]>([]);


export function getComponentIndex(component: ComponentInternalInstance): number {
    return toRaw(globalStack).findIndex((stackEntry) => {
        return stackEntry[0] === component.uid;
    });
}

export function getLastZIndex(): number | undefined {
    return globalStack.at(-1)?.[1];
}

export function getNextZIndex(fallback: number): number {
    const lastZIndex = getLastZIndex();
    return lastZIndex ? lastZIndex + 10 : fallback;
}

export function isTopComponent(component: ComponentInternalInstance): boolean {
    return globalStack.at(-1)?.[0] === component.uid;
}

/**
 * # Use Stack
 * @param isActive
 * @param zIndex
 * @param isDisableGlobalStack
 */
export function useStack (
    isActive: Readonly<Ref<boolean>>,
    zIndex: Readonly<Ref<string | number>>,
    isDisableGlobalStack: boolean
) {
    const component = getCurrentComponent('useStack');
    const isCreateStackEntry = !isDisableGlobalStack;
    const parentStack = inject(StackSymbol, undefined);
    const stack: StackProvide = reactive({
        activeChildren: new Set<number>(),
    });
    provide(StackSymbol, stack);

    const zIndexRef = shallowRef(+zIndex.value);
    useToggleScope(isActive, () => {
        zIndexRef.value = getNextZIndex(+zIndex.value);
        if (isCreateStackEntry) {
            globalStack.push([component.uid, zIndexRef.value]);
        }
        parentStack?.activeChildren.add(component.uid);
        onScopeDispose(() => {
            if (isCreateStackEntry) {
                globalStack.splice(getComponentIndex(component), 1);
            }
            parentStack?.activeChildren.delete(component.uid);
        });
    })

    const isTopGlobal = shallowRef(true);
    if (isCreateStackEntry) {
        watchEffect(() => {
            const isTop = isTopComponent(component);
            setTimeout(() => isTopGlobal.value = isTop);
        });
    }

    const isTopLocal = computed(() => !stack.activeChildren.size);

    return {
        isTopGlobal: readonly(isTopGlobal),
        isTopLocal: isTopLocal,
        stackStyles: computed(() => ({ zIndex: zIndexRef.value }))
    };
}