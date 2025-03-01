import { Appearance, EventProp, propsFactory } from "@/util";
import { makeTagProps } from "@/composables/tag";
import { makeComponentProps } from "@/composables/component";
import { makeGroupItemProps } from "@/composables/groupItem";
import { makeRoundedProps } from "@/composables/rounded";
import { IconProp } from "@/composables/icons";
import { CheckIcon } from "@/icons";
import { PropType } from "vue";
import { ButtonAppearanceProp, ButtonVariantProp } from "@/components/EvButton";

export type EvTagSlots = {
    default: {
        isSelected: boolean | undefined;
        selectedClass: boolean | (string | undefined)[] | undefined;
        select: ((value: boolean) => void) | undefined;
        toggle: (() => void) | undefined;
        value: unknown;
        disabled: boolean;
    };
    prefix: never;
    suffix: never;
    filter: never;
};

export const makeEvTagProps = propsFactory(
    {
        activeClass: String,
        appearance: {
            type: String as PropType<ButtonAppearanceProp>,
            default: Appearance.default,
        },
        avatarEnd: String,
        avatarStart: String,
        closable: Boolean,
        draggable: Boolean,
        filter: Boolean,
        iconEnd: IconProp,
        iconFilter: {
            type: IconProp,
            default: CheckIcon,
        },
        iconStart: IconProp,
        link: {
            type: Boolean,
            default: undefined,
        },
        modelValue: {
            type: Boolean,
            default: true,
        },
        text: String,

        variant: {
            type: String as PropType<ButtonVariantProp>,
            default: "default",
        },

        onClick: EventProp<[MouseEvent]>(),
        onClickOnce: EventProp<[MouseEvent]>(),

        ...makeGroupItemProps(),
        ...makeComponentProps(),
        ...makeRoundedProps(),
        ...makeTagProps({ tag: "span" }),
    },
    "EvTag",
);
