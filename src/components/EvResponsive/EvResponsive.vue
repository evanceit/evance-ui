<script setup lang="ts">
/**
 * '<ev-responsive>`
 */
import "./EvResponsive.scss";
import { makeEvResponsiveProps, useAspectStyles } from "./EvResponsive.ts";
import { useDimensions } from "@/composables/dimensions.ts";
import { useSlots } from "vue";

const props = defineProps(makeEvResponsiveProps());
const slots = useSlots();

const { aspectStyles } = useAspectStyles(props);
const dimensionStyles = useDimensions(props);
</script>

<template>
    <div
        :class="[
            'ev-responsive',
            {
                'is-inline': props.inline,
            },
            props.class,
        ]"
        :style="[dimensionStyles, props.style]">
        <div class="ev-responsive--sizer" :style="aspectStyles"></div>
        <slot name="additional" />
        <div
            v-if="slots.default"
            :class="['ev-responsive--content', props.contentClass]">
            <slot name="default" />
        </div>
    </div>
</template>
