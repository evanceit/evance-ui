<script setup lang="ts">
import './EvLayout.scss';
import {makeEvLayoutProps} from "./EvLayout.ts";
import {useBreakpointClasses} from "@/composables/display.ts";

const props = defineProps(makeEvLayoutProps());

const alignItemsClasses = useBreakpointClasses(props, 'align', 'align');
const alignContentClasses = useBreakpointClasses(props, 'alignContent', 'align-content');
const justifyContentClasses = useBreakpointClasses(props, 'justify', 'justify');
const gutterClasses = useBreakpointClasses(props, 'gutter', 'gutter');

</script>
<template>
    <component
        :is="props.tag"
        :class="[
            'ev-layout',
            {
                'is-column': props.column,
                'is-nowrap': props.nowrap
            },
            ...alignItemsClasses,
            ...alignContentClasses,
            ...justifyContentClasses,
            ...gutterClasses,
            props.class
        ]"
        :style="[
            props.style
        ]"
    >
        <slot />
    </component>
</template>