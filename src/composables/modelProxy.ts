import {ComponentInternalInstance, computed, getCurrentInstance, ref, toRaw, watch} from "vue";
import type { Ref } from 'vue';
import {toKebabCase} from "../util";
import {useToggleScope} from "./toggleScope.ts";

type InnerVal<T> = T extends any[] ? Readonly<T> : T;

/**
 * ## Has Prop
 *
 * Returns `true` if the `vueInstance` supplied has the `propName` in its list of props.
 *
 * @param vueInstance
 * @param propName
 */
function hasProp(vueInstance: ComponentInternalInstance, propName: string): boolean {
    return !!vueInstance.props?.hasOwnProperty(propName);
}

/**
 * # Model Proxy
 */
export function useModelProxy<
    PropsObject extends object & { [key in ModelName as `onUpdate:${ModelName}`]: ((value: any) => void) | undefined },
    ModelName extends Extract<keyof PropsObject, string>,
    Inner = PropsObject[ModelName]
> (
    props: PropsObject,
    modelName: ModelName,
    defaultValue?: PropsObject[ModelName],
    transformIn: (modelValue?: PropsObject[ModelName]) => Inner = (value: any) => value,
    transformOut: (modelValue: Inner) => PropsObject[ModelName] = (value: any) => value
) {
    const vueInstance: ComponentInternalInstance | null = getCurrentInstance();
    if (!vueInstance) {
        throw new Error('useModelProxy() requires a vue instance');
    }
    const modelRef: Ref<PropsObject[ModelName]> = ref(props[modelName] !== undefined ? props[modelName] : defaultValue) as Ref<PropsObject[ModelName]>;
    const modelNameKebab: string = toKebabCase(modelName);
    const isCheckKebabName: boolean = (modelName !== modelNameKebab);
    const isModelAvailable = computed(() => {
        // Ignore evaluation of props[modelName]
        void props[modelName];
        return (
            (hasProp(vueInstance, modelName) && hasProp(vueInstance, `onUpdate:${modelName}`))
            || (isCheckKebabName && hasProp(vueInstance, modelNameKebab) && hasProp(vueInstance, `onUpdate:${modelNameKebab}`))
        );
    });

    // Watch changes on the original model
    useToggleScope(
        () => !isModelAvailable.value,
        () => {
            watch(
                () => props[modelName],
                (value) => {
                    modelRef.value = value;
                }
            );
        }
    );

    // Define a computed model
    const model = computed({
        get (): any {
            const externalValue = props[modelName];
            return transformIn(isModelAvailable.value ? externalValue : modelRef.value);
        },
        set (internalValue): void {
            const newValue = transformOut(internalValue);
            const value = toRaw(isModelAvailable.value ? props[modelName] : modelRef.value);
            // Ignore if the value has not changed
            if (value === newValue || transformIn(value) === internalValue) {
                return;
            }
            modelRef.value = newValue;
            vueInstance.emit(`update:${modelName}`, newValue);
        }
    }) as any as Ref<InnerVal<any>> & { readonly externalValue: PropsObject[ModelName] };

    // Define an externalValue property to our model
    Object.defineProperty(model, 'externalValue', {
        get: () => {
            return isModelAvailable.value ? props[modelName] : modelRef.value;
        }
    });

    return model;
}