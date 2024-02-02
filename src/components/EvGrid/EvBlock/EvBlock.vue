<script setup lang="ts">
import './EvBlock.scss';
import {makeEvBlockProps, useBreakpointClasses} from "./EvBlock.ts";
import {useSlots} from "vue";

const props = defineProps(makeEvBlockProps());
const slots = useSlots();

/**
 * # Size Classes
 */
const sizeClasses = useBreakpointClasses(props, 'size');


</script>
<template>
    <component
        :is="props.tag"
        :class="[
            'ev-block',
            {
                'is-scrollable': props.scrollable
            },
            ...sizeClasses,
            props.class
        ]"
        :style="[
            props.style
        ]"
    >
        <slot />
    </component>
</template>