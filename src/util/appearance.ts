import {propsFactory} from "./props.ts";
import {computed, MaybeRef, PropType, unref} from "vue";
import {appearanceModifier} from "@/util/modifiers.ts";

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
export const makeAppearanceProps = propsFactory({
    appearance: {
        type: String as PropType<AppearanceProp>,
        default: Appearance.default
    }
}, 'Appearance');

export function useAppearance(
    props: MaybeRef
) {

    // Appearance modifier classes
    const appearanceClasses = computed(() => {
        const { appearance } = unref(props);
        return appearanceModifier(appearance);
    });

    return { appearanceClasses };
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