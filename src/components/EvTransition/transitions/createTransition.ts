import { FunctionalComponent, h, Transition } from "vue";


/**
 * # createJavaScriptTransition
 *
 * @param name
 * @param functions
 * @param mode
 *
 */
export function createJavaScriptTransition(
    name: string,
    functions: Record<string, any>,
    mode = "in-out",
): FunctionalComponent {
    return (props: any, { slots }) => {
        return h(
            Transition,
            {
                name: props.disabled ? "" : name,
                css: !props.disabled,
                ...(props.disabled ? {} : functions),
            },
            slots.default,
        );
    };
}