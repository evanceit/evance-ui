<script setup lang="ts">
import './EvLayout.scss';
import {makeEvLayoutProps} from "./EvLayout.ts";
import {useSlots} from "vue";

const props = defineProps(makeEvLayoutProps());
const slots = useSlots();

</script>
<template>
    <div
        :class="[
            'ev-layout',
            {
                'is-column': props.column
            },
            props.class
        ]"
        :style="[
            props.style
        ]"
    >
        <slot />
    </div>
</template>