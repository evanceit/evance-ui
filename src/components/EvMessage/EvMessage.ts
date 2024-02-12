import {AppearanceProp, makeAppearanceProps, propsFactory} from "@/util";
import {PropType, Ref} from "vue";
import {IconProp, IconValue} from "@/composables/icons.ts";
import {makeTagProps} from "@/composables/tag.ts";
import {makeComponentProps} from "@/composables/component.ts";
import {EvButtonProps} from "@/components";


type ModelValueProp = boolean | Ref<boolean>;
type EvMessageVariant = 'subtle' | 'tonal' | 'bold';


/**
 * # EvMessageProps
 */
export interface EvMessageProps {
    description?: string,
    dismissible?: boolean,
    expandable?: boolean,
    icon?: IconValue,
    modelValue?: Ref<boolean>,
    title?: string,
    variant?: EvMessageVariant,
    actions?: EvButtonProps[],
    appearance?: AppearanceProp,
    onDismiss?: Function
}

export interface EvMessageSlots {
    icon?: any,
    default?: any,
    actions?: any
}


/**
 * # makeEvMessageProps
 */
export const makeEvMessageProps = propsFactory({
    description: String,
    dismissDelay: {
        type: [Boolean, Number],
        default: 0
    },
    dismissible: [Boolean, Object] as PropType<ModelValueProp>,
    expandable: Boolean,
    icon: IconProp,
    modelValue: {
        type: [Boolean, Object] as PropType<ModelValueProp>,
        default: true
    },
    title: String,
    variant: {
        type: String as PropType<EvMessageVariant>,
        default: 'tonal'
    },
    actions: Array as PropType<EvButtonProps[]>,

    ...makeAppearanceProps(),
    ...makeTagProps({
        tag: 'section'
    }),
    ...makeComponentProps()

}, 'EvMessage');