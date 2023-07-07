<script setup lang="ts">
/**
 * # EvLozenge
 *
 * `<ev-lozenge />`
 */
import './EvLozenge.scss';
import {appearanceModifier, isIntegerish} from "../../util";

/**
 * ## Lozenge Appearance
 */
type Appearance = 'default'
    | 'critical'
    | 'information'
    | 'notice'
    | 'success'
    | 'warning';

/**
 * ## Lozenge Props
 */
interface LozengeProps {
    appearance?: Appearance,
    bold?: boolean,
    maxWidth?: number | string;
}
const props = withDefaults(defineProps<LozengeProps>(), {
    appearance: 'default',
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
    return /%$/.test(props.maxWidth);
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
    return isMaxWidthPercent() ? '100%' : `calc(${getMaxWidthWithUnits()} - var(--spacer-100))`
};

/**
 * ## Get Max Width with Units
 * When a `maxWidth` is numeric (supplied without units), we assume `px`.
 */
const getMaxWidthWithUnits = () => {
    return isMaxWidthNumeric() ? `${props.maxWidth}px` : props.maxWidth;
}

</script>
<template>
    <span
        class="ev-lozenge"
        :class="[
            appearanceModifier(props.appearance),
            {
                'is-bold': bold
            }
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