<script setup lang="ts">
/**
 * # EvProgressCircular
 */
import './EvProgressCircular.scss';
import {useSlots, ref} from "vue";
import {appearanceModifier, AppearanceProp, toWebUnit} from "../../util";

type Size = 'default';

interface ProgressProps {
    appearance?: AppearanceProp,
    indeterminate?: boolean,
    percentage?: number,
    rotate?: number,
    size?: Size | number,
    thickness?: number
}
const props = withDefaults(defineProps<ProgressProps>(), {
    appearance: 'default',
    size: 'default',
    indeterminate: false,
    percentage: 0,
    rotate: 0,
    thickness: 2
});

const slots = useSlots();
const container = ref<HTMLElement | null>(null);
const defaultSize = 48;
const defaultRadius = (defaultSize / 2);
const defaultRotation = -90;

/**
 * ## Get Size with Units
 * The default units is `px` when only a number is supplied.
 */
function getSizeWithUnits() {
    if (props.size === 'default') {
        return null;
    }
    return toWebUnit(props.size);
}

/**
 * ## Get Circumference
 * Calculate the circumference of the inner circles.
 */
function getCircumference() {
    return Math.PI * (getRadius() * 2);
}

/**
 * ## Get Width
 * Returns the width of the container.
 */
function getContainerWidth() {
    return (!container.value) ? defaultSize : container.value.clientWidth;
}

/**
 * ## Get Progress Offset
 * Calculate progress offset based on the percentage of the circumference.
 */
function getProgressOffset() {
    return (props.indeterminate) ? 0 : (getCircumference() * (1 - props.percentage/100));
}

/**
 * ## Get Radius
 * Calculate the radius of the
 */
function getRadius() {
    return defaultRadius - (getThickness() / 2);
}

/**
 * ## Get Rotation
 * Returns the starting point rotation style.
 */
function getRotation() {
    const rotation = defaultRotation + props.rotate;
    return `rotate(${rotation}deg)`;
}

/**
 * ## Get Thickness (Stroke Width)
 * Calculate the requested stroke width as this will be different from
 * the actual stroke-width attribute.
 */
function getThickness() {
    const maxThickness = defaultSize / 2;
    const thickness = ((props.thickness / getContainerWidth()) * defaultSize);
    return (thickness > maxThickness) ? maxThickness : thickness;
}

</script>
<template>
    <span
        ref="container"
        role="progressbar"
        aria-valuemin="0"
        aria-valuemax="100"
        :aria-valuenow="percentage"
        class="ev-progress-circular"
        :class="[
            {
                'is-indeterminate': props.indeterminate,
                'size-default': props.size === 'default'
            },
            appearanceModifier(props.appearance, ['default'])
        ]"
        :style="[
            {
                'width': getSizeWithUnits(),
                'height': getSizeWithUnits()
            }
        ]"
    >
        <svg xmlns="http://www.w3.org/2000/svg"
             viewBox="0 0 48 48"
             :style="[
                 {
                    'transform': getRotation()
                 }
             ]"
        >
            <circle
                class="ev-progress-circular--track"
                fill="transparent" cx="50%" cy="50%"
                :r="getRadius()"
                :stroke-width="getThickness()"
                :stroke-dasharray="getCircumference()"
                stroke-dashoffset="0"></circle>
            <circle
                class="ev-progress-circular--bar"
                fill="transparent" cx="50%" cy="50%"
                :r="getRadius()"
                :stroke-width="getThickness()"
                :stroke-dasharray="getCircumference()"
                :stroke-dashoffset="getProgressOffset()"></circle>
        </svg>
        <span class="ev-progress-circular--content">
            <slot />
        </span>
    </span>
</template>