import {makeAppearanceProps, propsFactory} from "@/util";
import {PropType, Ref} from "vue";
import {IconProp, IconValue} from "@/composables/icons.ts";
import {makeTagProps} from "@/composables/tag.ts";
import {makeComponentProps} from "@/composables/component.ts";
import {EvButtonProps} from "@/components";

type ModelValueProp = boolean | Ref<boolean>;
type EvMessageVariant = 'subtle' | 'tonal' | 'bold';

export interface EvMessageProps {
    dismissible?: boolean,
    expandable?: boolean,
    icon?: IconValue,
    modelValue: ModelValueProp,
    title?: string,
}

/**
 * # makeEvMessageProps
 */
export const makeEvMessageProps = propsFactory({

    dismissDelay: {
        type: [Boolean, Number],
        default: 0
    },
    dismissible: Boolean,
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