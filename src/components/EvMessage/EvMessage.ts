import {makeAppearanceProps, propsFactory} from "@/util";
import {PropType, Ref} from "vue";
import {IconProp} from "@/composables/icons.ts";
import {makeTagProps} from "@/composables/tag.ts";
import {makeComponentProps} from "@/composables/component.ts";
import {EvButtonProps} from "@/components";

type ModelValueProp = boolean | Ref<boolean>;

/**
 * # makeEvMessageProps
 */
export const makeEvMessageProps = propsFactory({

    dismissible: Boolean,
    expandable: Boolean,
    icon: IconProp,
    modelValue: {
        type: [Boolean, Object] as PropType<ModelValueProp>,
        default: true
    },
    title: String,
    transparent: Boolean,
    actions: Array as PropType<EvButtonProps[]>,

    ...makeAppearanceProps(),
    ...makeTagProps({
        tag: 'section'
    }),
    ...makeComponentProps()

}, 'EvMessage');