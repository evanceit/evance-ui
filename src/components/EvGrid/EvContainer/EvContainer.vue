<script setup lang="ts">
import './EvContainer.scss';
import {makeEvContainerProps} from "./EvContainer.ts";

const props = defineProps(makeEvContainerProps());

</script>
<template>
    <div
        :class="[
            'ev-container',
            {
                'is-fluid': props.fluid
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