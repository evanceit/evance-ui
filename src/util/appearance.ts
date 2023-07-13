import {propsFactory} from "./props.ts";

/**
 * # Appearance
 *
 * Default appearance keys for
 *
 */
export enum Appearance {
    default = 'default',
    critical = 'critical',
    information = 'information',
    notice = 'notice',
    success = 'success',
    warning = 'warning'
}
export type AppearanceKey = keyof typeof Appearance;
export type AppearanceProp = typeof Appearance[AppearanceKey];
export const makeAppearanceProps = propsFactory({
    appearance: {
        type: String<AppearanceProp>,
        default: Appearance.default
    }
});


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
        type: String<InputAppearance>,
        default: InputAppearance.default
    }
});

/**
 * # Input Sizes
 */
export enum InputSize {
    default = 'medium',
    small = 'small',
    medium = 'medium',
    large = 'large'
}
export type InputSizeKey = keyof typeof InputSize;
export type InputSizeProp = typeof InputSize[InputSizeKey];
export const makeInputSizeProps = propsFactory({
    size: {
        type: String<InputSize>,
        default: InputSize.default
    }
});