<script setup lang="ts">
import './EvLayout.scss';
import {makeEvLayoutProps} from "./EvLayout.ts";

const props = defineProps(makeEvLayoutProps());

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