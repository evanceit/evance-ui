import {computed, PropType, TransitionProps} from "vue";
import {isBoolean, isEmpty, isString, propsFactory} from "../util";


export type EvTransition = string | boolean | TransitionProps;

export interface EvTransitionProps {
    transition?: EvTransition
}

/**
 * # Make Transition Props
 */
export const makeTransitionProps = propsFactory({
    transition: {
        type: [Boolean, String, Object] as PropType<string | boolean | TransitionProps>,
        default: true
    }
}, 'transitions');


/**
 * # Use Transition
 * @param props
 * @param defaultTransition
 */
export function useTransition(props: EvTransitionProps, defaultTransition: string = 'transition-fade') {
    return computed(() => {
        if (isEmpty(props.transition) || isBoolean(props.transition)) {
            return {
                name: !!props.transition ? defaultTransition : ''
            };
        }
        if (isString(props.transition)) {
            return {
                name: props.transition
            };
        }
        return props.transition;
    });
}