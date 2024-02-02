<script setup lang="ts">
import './EvSpacer.scss';
import {makeEvSpacerProps} from "./EvSpacer.ts";
import {useSlots} from "vue";

const props = defineProps(makeEvSpacerProps());
const slots = useSlots();

</script>
<template>
    <div
        :class="[
            'ev-spacer',
            props.class
        ]"
        :style="[
            props.style
        ]"
    >
        <slot />
    </div>
</template>