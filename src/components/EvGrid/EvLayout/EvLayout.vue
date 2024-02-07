<script setup lang="ts">
import './EvLayout.scss';
import {makeEvLayoutProps} from "./EvLayout.ts";
import {useBreakpointClasses} from "@/composables/display.ts";

const props = defineProps(makeEvLayoutProps());

const alignItemsClasses = useBreakpointClasses(props, 'align', 'align');
const alignContentClasses = useBreakpointClasses(props, 'alignContent', 'align-content');
const justifyContentClasses = useBreakpointClasses(props, 'justify', 'justify');

</script>
<template>
    <component
        :is="props.tag"
        :class="[
            'ev-layout',
            {
                'is-column': props.column
            },
            ...alignItemsClasses,
            ...alignContentClasses,
            ...justifyContentClasses,
            props.class
        ]"
        :style="[
            props.style
        ]"
    >
        <slot />
    </component>
</template>