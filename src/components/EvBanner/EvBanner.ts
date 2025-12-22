import { AppearanceProp, makeAppearanceProps, propsFactory } from "@/util";
import {
    IconProp,
    IconValue,
    makeComponentProps,
    makeTagProps,
} from "@/composables";
import { PropType, Ref } from "vue";
import { EvButtonProps } from "@/components/EvButton";

type ModelValueProp = boolean | Ref<boolean>;

export interface EvBannerProps {
    actions?: EvButtonProps[];
    appearance?: AppearanceProp;
    dismissible?: boolean;
    icon?: IconValue;
    modelValue?: Ref<boolean>;
    onDismiss?: () => void;
    text?: string;
}

export interface EvBannerSlots {
    icon?: any;
    default?: any;
    actions?: any;
}

export const makeEvBannerProps = propsFactory(
    {
        actions: Array as PropType<EvButtonProps[]>,
        dismissible: [Boolean, Object] as PropType<ModelValueProp>,
        icon: IconProp,
        modelValue: {
            type: [Boolean, Object] as PropType<ModelValueProp>,
            default: true,
        },
        text: String,
        ...makeAppearanceProps({
            variant: "bold",
        }),
        ...makeTagProps({
            tag: "section",
        }),
        ...makeComponentProps(),
    },
    "EvBanner",
);