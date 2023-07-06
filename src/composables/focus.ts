import {useModelProxy} from "./modelProxy.ts";
import {computed} from "vue";

/**
 * # Focus Props Type
 */
export interface FocusProps {
    focused: boolean
    'onUpdate:focused': ((focused: boolean) => any) | undefined
}


/**
 * # Use Focus Composable
 */
export function useFocus(props: FocusProps) {
    const isFocused = useModelProxy(props, 'focused');
    const focusClasses = computed(() => {
        return {
            'is-focused': isFocused.value,
        };
    });

    function focus() {
        isFocused.value = true;
    }

    function blur() {
        isFocused.value = false;
    }

    return { isFocused, focusClasses, focus, blur };
}