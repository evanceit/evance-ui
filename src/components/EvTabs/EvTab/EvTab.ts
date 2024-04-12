import {omit, propsFactory} from "@/util";
import {makeEvButtonProps} from "@/components";
import {PropType} from "vue";

/**
 * # makeEvTabProps()
 */
export const makeEvTabProps = propsFactory({
    direction: {
        type: String as PropType<'horizontal' | 'vertical'>,
        default: 'horizontal',
    },

    ...omit(makeEvButtonProps({
        variant: 'subtle' as const,
        selectedClass: 'is-selected',
        selectedAppearance: 'primary',
        selectedVariant: 'subtle'
    }), [
        'active',
        'symbol'
    ])
}, 'EvTab');