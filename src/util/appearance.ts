import {propsFactory} from "./props.ts";
import {computed, MaybeRef, PropType, Ref, unref} from "vue";
import {appearanceModifier, variantModifier} from "@/util/modifiers.ts";
import {GroupItemProvide} from "@/composables/groupItem.ts";

/**
 * # Appearance
 *
 * Default appearance keys for
 *
 */
export enum Appearance {
    default = 'default',
    danger = 'danger',
    information = 'information',
    notice = 'notice',
    primary = 'primary',
    success = 'success',
    warning = 'warning'
}
export type AppearanceProp = keyof typeof Appearance;

export enum Variant {
    default = 'default',
    bold = 'bold',
    outlined = 'outlined',
    subtle = 'subtle',
    tonal = 'tonal'
}
export type VariantProp = keyof typeof Variant;

export interface AppearanceProps {
    appearance: AppearanceProp,
    variant: VariantProp
}


export const makeAppearanceProps = propsFactory({
    appearance: {
        type: String as PropType<AppearanceProp>,
        default: Appearance.default
    },
    variant: {
        type: String as PropType<VariantProp>,
        default: Variant.default
    }
}, 'Appearance');


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
    isActive: Ref<boolean|undefined> | null = null,
    defaultVariant: string = Variant.default
) {

    const appearanceName = computed(() => {
        const { appearance } = unref(props);
        const value = (isActive?.value)
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
        let value = (isActive?.value)
            ? group?.selectedVariant.value ?? variant
            : variant;
        value = value ?? Variant.default;
        if (
            appearanceName.value !== Appearance.default
            && value === Variant.default
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
        variantClass
    };
}


/**
 * # Input Appearance
 */
export enum InputAppearance {
    default = Appearance.default,
    button = 'button',
    none = 'none',
    subtle = 'subtle'
}
export type InputAppearanceKey = keyof typeof InputAppearance;
export type InputAppearanceProp = typeof InputAppearance[InputAppearanceKey];
export const makeInputAppearanceProps = propsFactory({
    appearance: {
        type: String as PropType<InputAppearanceProp>,
        default: InputAppearance.default
    }
}, 'InputAppearance');


/**
 * # Input Sizes
 */
export enum InputSize {
    default = 'medium',
    xSmall = 'x-small',
    small = 'small',
    medium = 'medium',
    large = 'large',
    xLarge = 'x-large'
}

export type InputSizeCamel = keyof typeof InputSize;
export type InputSizeKebab =  'x-small' | 'x-large';
export type InputSizeProp = InputSizeCamel | InputSizeKebab;
export const makeInputSizeProps = propsFactory({
    size: {
        type: String as PropType<InputSizeProp>,
        default: InputSize.default
    }
}, 'InputSize');


/**
 * # Text Align
 */
export enum TextAlign {
    default = 'left',
    left = 'left',
    center = 'center',
    right = 'right'
}
export type TextAlignKey = keyof typeof TextAlign;
export type TextAlignProp = typeof TextAlign[TextAlignKey];
export const makeTextAlignProps = propsFactory({
    align: {
        type: String as PropType<TextAlignProp>,
        default: TextAlign.default
    }
}, 'TextAlign');