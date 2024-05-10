import { ComponentInternalInstance, computed, ref, toRaw, watch } from "vue";
import type { Ref } from "vue";
import { EventProp, getCurrentComponent, toKebabCase } from "@/util";
import { useToggleScope } from "./toggleScope.ts";

type InnerVal<T> = T extends any[] ? Readonly<T> : T;

/**
 * ## Has Prop
 *
 * Returns `true` if the `vueInstance` supplied has the `propName` in its list of props.
 *
 * @param vueInstance
 * @param propName
 */
function hasProp(
    vueInstance: ComponentInternalInstance,
    propName: string,
): boolean {
    return !!vueInstance.props?.hasOwnProperty(propName);
}

/**
 * # Model Proxy
 */
export function useModelProxy<
    PropsObject extends object &
        Partial<{
            [key in ModelName as `onUpdate:${ModelName}`]:
                | EventProp
                | undefined;
        }>,
    ModelName extends Extract<keyof PropsObject, string>,
    Inner = PropsObject[ModelName],
>(
    props: PropsObject,
    modelName: ModelName,
    defaultValue?: PropsObject[ModelName],
    transformIn: (modelValue?: PropsObject[ModelName]) => Inner = (
        value: any,
    ) => value,
    transformOut: (modelValue: Inner) => PropsObject[ModelName] = (
        value: any,
    ) => value,
) {
    const component: ComponentInternalInstance =
        getCurrentComponent("useModelProxy");
    const modelRef: Ref<PropsObject[ModelName]> = ref(
        props[modelName] !== undefined ? props[modelName] : defaultValue,
    ) as Ref<PropsObject[ModelName]>;
    const modelNameKebab: string = toKebabCase(modelName);
    const isCheckKebabName: boolean = modelName !== modelNameKebab;
    const isModelAvailable = computed(() => {
        // Ignore evaluation of props[modelName]
        void props[modelName];
        return (
            (hasProp(component, modelName) &&
                hasProp(component, `onUpdate:${modelName}`)) ||
            (isCheckKebabName &&
                hasProp(component, modelNameKebab) &&
                hasProp(component, `onUpdate:${modelNameKebab}`))
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
                },
            );
        },
    );

    // Define a computed model
    const model = computed({
        get(): any {
            const externalValue = props[modelName];
            return transformIn(
                isModelAvailable.value ? externalValue : modelRef.value,
            );
        },
        set(internalValue): void {
            const newValue = transformOut(internalValue);
            const value = toRaw(
                isModelAvailable.value ? props[modelName] : modelRef.value,
            );
            // Ignore if the value has not changed
            if (value === newValue || transformIn(value) === internalValue) {
                return;
            }
            modelRef.value = newValue;
            component.emit(`update:${modelName}`, newValue);
        },
    }) as any as Ref<InnerVal<any>> & {
        readonly externalValue: PropsObject[ModelName];
    };

    // Define an externalValue property to our model
    Object.defineProperty(model, "externalValue", {
        get: () => {
            return isModelAvailable.value ? props[modelName] : modelRef.value;
        },
    });

    return model;
}
