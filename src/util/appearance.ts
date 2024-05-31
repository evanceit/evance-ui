import { propsFactory } from "./props.ts";
import { computed, MaybeRef, PropType, Ref, unref } from "vue";
import { appearanceModifier, variantModifier } from "@/util/modifiers.ts";
import { GroupItemProvide } from "@/composables/groupItem.ts";

/**
 * # Appearance
 *
 * Default appearance keys for
 *
 */
export const Appearance = {
    default: "default",
    danger: "danger",
    information: "information",
    notice: "notice",
    primary: "primary",
    success: "success",
    warning: "warning",
} as const;

export type AppearanceProp = (typeof Appearance)[keyof typeof Appearance];

export const Variant = {
    default: "default",
    bold: "bold",
    outlined: "outlined",
    subtle: "subtle",
    tonal: "tonal",
} as const;

export type VariantProp = (typeof Variant)[keyof typeof Variant];

export interface AppearanceProps {
    appearance: AppearanceProp;
    variant: VariantProp;
}

export const makeAppearanceProps = propsFactory(
    {
        appearance: {
            type: String as PropType<AppearanceProp>,
            default: Appearance.default,
        },
        variant: {
            type: String as PropType<VariantProp>,
            default: Variant.default,
        },
    },
    "Appearance",
);

/**
 * # useAppearance
 *
 * @param props
 * @param group
 * @param isActive
 * @param defaultVariant
 */
export function useAppearance(
    props: MaybeRef<Partial<AppearanceProps>>,
    group: GroupItemProvide | null = null,
    isActive: Ref<boolean | undefined> | null = null,
    defaultVariant: string = Variant.default,
) {
    const appearanceName = computed(() => {
        const { appearance } = unref(props);
        const value = isActive?.value
            ? group?.selectedAppearance.value ?? appearance
            : appearance;
        return value ?? Appearance.default;
    });

    // Appearance modifier classes
    const appearanceClass = computed(() => {
        return appearanceModifier(appearanceName.value);
    });

    const variantName = computed(() => {
        const { variant } = unref(props);
        let value = isActive?.value
            ? group?.selectedVariant.value ?? variant
            : variant;
        value = value ?? Variant.default;
        if (
            appearanceName.value !== Appearance.default &&
            value === Variant.default
        ) {
            value = defaultVariant;
        }
        return value;
    });

    const variantClass = computed(() => {
        return variantModifier(variantName.value);
    });

    return {
        appearance: appearanceName,
        appearanceClass,
        variant: variantName,
        variantClass,
    };
}

/**
 * # Input Appearance
 */
export const InputAppearance = {
    default: Appearance.default,
    button: "button",
    none: "none",
    subtle: "subtle",
} as const;

export type InputAppearanceProp =
    (typeof InputAppearance)[keyof typeof InputAppearance];

export const makeInputAppearanceProps = propsFactory(
    {
        appearance: {
            type: String as PropType<InputAppearanceProp>,
            default: InputAppearance.default,
        },
    },
    "InputAppearance",
);

/**
 * # Input Sizes
 */
export const InputSize = {
    default: "medium",
    xSmall: "x-small",
    small: "small",
    medium: "medium",
    large: "large",
    xLarge: "x-large",
} as const;

export type InputSizeProp = (typeof InputSize)[keyof typeof InputSize];
export const makeInputSizeProps = propsFactory(
    {
        size: {
            type: String as PropType<InputSizeProp>,
            default: InputSize.default,
        },
    },
    "InputSize",
);

/**
 * # Text Align
 */
export const TextAlign = {
    default: "left",
    left: "left",
    center: "center",
    right: "right",
} as const;
export type TextAlignProp = (typeof TextAlign)[keyof typeof TextAlign];
export const makeTextAlignProps = propsFactory(
    {
        align: {
            type: String as PropType<TextAlignProp>,
            default: TextAlign.default,
        },
    },
    "TextAlign",
);
