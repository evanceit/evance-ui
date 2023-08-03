import {Component, computed, FunctionalComponent, mergeProps, PropType, Transition, TransitionProps, h} from "vue";
import {isBoolean, isEmpty, isObject, isString, propsFactory} from "../../util";

/**
 * # EvTransition
 *
 * A functional component for handling transitions, which can either be a name, object or component.
 *
 * There is no `.vue` component file for this component.
 *
 * @param props
 * @param slots
 * @constructor
 */
export const EvTransition: FunctionalComponent<EvTransitionProps> = (props, { slots }) => {
    const { transition, disabled, ...remainingProps } = props;
    const { component: transitionComponent = Transition, ...customProps } = isObject(transition) ? transition : {};
    const transitionProps = isString(transition) ? { name: disabled ? '' : transition } : customProps as any;

    return h(
        transitionComponent,
        mergeProps(
            transitionProps,
            remainingProps as any,
            { disabled }
        ),
        slots
    );
};

export type EvTransitionProp = string | boolean | TransitionProps & { component?: Component };

export interface EvTransitionProps {
    transition?: EvTransitionProp;
    disabled?: boolean;
}

/**
 * # Make Transition Props
 */
export const makeEvTransitionProps = propsFactory({
    transition: {
        type: [Boolean, String, Object] as PropType<EvTransitionProp>,
        default: true
    }
}, 'transitions');


/**
 * # Use Transition
 *
 * Prepares `transition` props for use
 *
 * @param props
 * @param defaultTransition
 */
export function useEvTransition(props: EvTransitionProps, defaultTransition: string = 'transition-fade') {
    return computed(() => {
        if (isEmpty(props.transition) || isBoolean(props.transition)) {
            return {
                name: (!!props.transition && !props.disabled) ? defaultTransition : ''
            };
        }
        if (isString(props.transition)) {
            return {
                name: props.disabled ? '' : props.transition
            };
        }
        return props.transition;
    });
}
