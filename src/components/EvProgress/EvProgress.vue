<script setup lang="ts">
/**
 * # EvProgress
 */
import './EvProgress.scss';

type ProgressAppearance = 'default'
    | 'critical'
    | 'information'
    | 'primary'
    | 'success'
    | 'warning';

type ProgressSize = 'small'
    | 'medium'
    | 'large';

interface ProgressProps {
    appearance?: ProgressAppearance,
    indeterminate?: boolean,
    percentage?: number,
    size?: ProgressSize | number
}
const props = withDefaults(defineProps<ProgressProps>(), {
    appearance: 'default',
    indeterminate: false,
    percentage: 0,
    size: 'medium'
});

/**
 * ## Get Appearance Class
 */
function getAppearanceClass() {
    if (props.appearance === 'default') {
        return null;
    }
    return `appearance-${props.appearance}`;
}

/**
 * ## Get Percentage Width
 */
function getPercentageWithUnit() {
    return props.percentage + '%';
}

function getPercentageTranslation() {
    const percent = 0 - (100 - props.percentage);
    return `translateX(${percent}%)`;
}

/**
 * ## Get Size Class
 */
function getSizeClass() {
    return (isSizeNumeric()) ? null : `size-${props.size}`;
}

function getSizeHeight() {
    return (!isSizeNumeric()) ? null : props.size + 'px';
}

function isSizeNumeric(): boolean {
    return /^\d+$/.test(props.size);
}

</script>
<template>
    <div
        role="progressbar"
        aria-valuemin="0"
        aria-valuemax="100"
        :aria-valuenow="percentage"
        class="ev-progress"
        :class="[
            {
                'is-indeterminate': props.indeterminate
            },
            getAppearanceClass(),
            getSizeClass()
        ]"
        :style="{
            height: getSizeHeight()
        }"
    >
        <div class="ev-progress--track"></div>
        <div class="ev-progress--bar" v-if="!props.indeterminate"
             :style="{
                transform: getPercentageTranslation()
             }"
        ></div>
        <div class="ev-progress--indeterminate" v-if="props.indeterminate">
            <div class="ev-progress--bar ev-progress--indeterminate--primary"></div>
            <div class="ev-progress--bar ev-progress--indeterminate--secondary"></div>
        </div>
    </div>
</template>