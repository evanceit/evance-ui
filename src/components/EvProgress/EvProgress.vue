<script setup lang="ts">
/**
 * # EvProgress
 */
import './EvProgress.scss';
import {
    appearanceModifier,
    sizeModifier,
    IntegerishPattern,
    isIntegerish,
    AppearanceProp,
    InputSizeProp
} from "@/util";

interface ProgressProps {
    appearance?: AppearanceProp,
    indeterminate?: boolean,
    percentage?: number,
    size?: InputSizeProp | number
}
const props = withDefaults(defineProps<ProgressProps>(), {
    appearance: 'default',
    indeterminate: false,
    percentage: 0,
    size: 'medium'
});

function getPercentageTranslation() {
    const percent = 0 - (100 - props.percentage);
    return `translateX(${percent}%)`;
}

/**
 * ## Get Size Class
 */
function getSizeHeight() {
    return (!isSizeNumeric()) ? undefined : props.size + 'px';
}

function isSizeNumeric(): boolean {
    return isIntegerish(props.size);
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
            appearanceModifier(props.appearance, ['default']),
            sizeModifier(props.size, [IntegerishPattern])
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