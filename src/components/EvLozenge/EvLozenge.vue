<script setup lang="ts">
/**
 * # EvLozenge
 *
 * `<ev-lozenge />`
 */
import './EvLozenge.scss';
import {AppearanceProp, isIntegerish, useAppearance, VariantProp} from "@/util";

/**
 * ## Lozenge Props
 */
interface LozengeProps {
    appearance?: AppearanceProp,
    variant?: VariantProp,
    maxWidth?: number | string;
}
const props = withDefaults(defineProps<LozengeProps>(), {
    appearance: 'default',
    variant: 'default',
    maxWidth: 200
});

/**
 * ## Is the `maxWidth` prop numeric?
 * i.e. it does not have any web units.
 */
const isMaxWidthNumeric = () => {
    return isIntegerish(props.maxWidth);
};

/**
 * ## Is the `maxWidth` prop a percentage?
 */
const isMaxWidthPercent = () => {
    return /%$/.test(props.maxWidth.toString());
};

/**
 * ## Get Outer Max Width
 * Returns the `maxWidth` prop value if it was supplied as a percentage,
 * or simply returns '100%'.
 */
const getMaxWidthOuter = () => {
    return isMaxWidthPercent() ? props.maxWidth : '100%';
};

/**
 * ## Get Inner Max Width
 * Returns '100%' if the `maxWidth` prop was supplied as a percentage,
 * or returns a calculation of the `maxWidth` supplied minus double
 * the default padding.
 */
const getMaxWidthInner = () => {
    return isMaxWidthPercent() ? '100%' : `calc(${getMaxWidthWithUnits()} - var(--spacer-200))`
};

/**
 * ## Get Max Width with Units
 * When a `maxWidth` is numeric (supplied without units), we assume `px`.
 */
const getMaxWidthWithUnits = () => {
    return isMaxWidthNumeric() ? `${props.maxWidth}px` : props.maxWidth;
}

const { appearanceClass, variantClass } = useAppearance(props)

</script>
<template>
    <span
        :class="[
            'ev-lozenge',
            appearanceClass,
            variantClass
        ]"
        :style="{
            'max-width': getMaxWidthOuter()
        }">
        <span
            class="ev-lozenge--label"
            :style="{
                'max-width': getMaxWidthInner()
            }">
            <slot />
        </span>
    </span>
</template>