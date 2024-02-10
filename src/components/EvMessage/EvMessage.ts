import {makeAppearanceProps, propsFactory} from "@/util";
import {PropType, Ref} from "vue";
import {IconValue} from "@/composables/icons.ts";
import {makeTagProps} from "@/composables/tag.ts";
import {makeComponentProps} from "@/composables/component.ts";

type ModelValueProp = boolean | Ref<boolean>;

export const makeEvMessageProps = propsFactory({

    dismissible: Boolean,
    expandable: Boolean,
    icon: [Boolean, String, Function, Object] as PropType<boolean | IconValue>,
    modelValue: {
        type: [Boolean, Object] as PropType<ModelValueProp>,
        default: true
    },
    title: String,

    ...makeAppearanceProps(),
    ...makeTagProps({
        tag: 'section'
    }),
    ...makeComponentProps()

}, 'EvMessage');