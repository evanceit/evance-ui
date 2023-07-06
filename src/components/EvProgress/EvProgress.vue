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

interface ProgressProps {
    appearance?: ProgressAppearance,
    indeterminate?: boolean,
    percentage?: number
}
const props = withDefaults(defineProps<ProgressProps>(), {
    appearance: 'default',
    indeterminate: false,
    percentage: 0
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
            getAppearanceClass()
        ]"
    >
        <div class="ev-progress--track"></div>
        <div class="ev-progress--bar"></div>
    </div>
</template>