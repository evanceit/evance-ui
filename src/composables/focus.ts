import {useModelProxy} from "./modelProxy.ts";
import {computed, ref} from "vue";
import {Browser, propsFactory} from "../util";

/**
 * # Focus Props Type
 */
export interface FocusProps {
    focused: boolean
    'onUpdate:focused': ((focused: boolean) => any) | undefined
}


/**
 * # Make Focus Props
 */
export const makeFocusProps = propsFactory({
    focused: Boolean
}, 'focus');


/**
 * # Use Focus Composable
 */
export function useFocus(props: FocusProps) {
    const isFocused = useModelProxy(props, 'focused');
    const isFocusedVisible = ref(false);
    const focusClasses = computed(() => {
        return {
            'is-focused': isFocused.value,
            'is-focused-visible': isFocusedVisible.value
        };
    });

    function focus(e?: Event): void {
        isFocused.value = true;
        const el: HTMLElement | null = e?.target as HTMLElement;
        if (Browser.supportsFocusVisible && el?.matches(':focus-visible')) {
            isFocusedVisible.value = true;
        }
    }

    function blur(): void {
        isFocused.value = false;
        isFocusedVisible.value = false;
    }

    return { isFocused, isFocusedVisible, focusClasses, focus, blur };
}


/**
 * ## Auto Focus
 */
export interface AutofocusProps {
    autofocus: boolean;
}

/**
 * # Use Auto Focus
 * @param props
 */
export function useAutofocus(props: AutofocusProps) {
    return {
        mounted: (el) => {
            if (!props.autofocus) {
                return;
            }
            el.focus();
        }
    };
}