<script setup lang="ts">
import './EvContainer.scss';
import {makeEvContainerProps} from "./EvContainer.ts";
import {useSlots} from "vue";

const props = defineProps(makeEvContainerProps());
const slots = useSlots();

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