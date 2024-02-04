<script setup lang="ts">
import './EvBlock.scss';
import {makeEvBlockProps, useBreakpointClasses} from "./EvBlock.ts";

const props = defineProps(makeEvBlockProps());

/**
 * # Size Classes
 */
const sizeClasses = useBreakpointClasses(props, 'size');
const orderClasses = useBreakpointClasses(props, 'order', 'order');
const offsetClasses = useBreakpointClasses(props, 'offset', 'offset');

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
            ...orderClasses,
            ...offsetClasses,
            props.class
        ]"
        :style="[
            props.style
        ]"
    >
        <slot />
    </component>
</template>