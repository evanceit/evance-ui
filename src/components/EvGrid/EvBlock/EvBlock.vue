<script setup lang="ts">
import './EvBlock.scss';
import {makeEvBlockProps} from "./EvBlock.ts";
import {useSlots} from "vue";

const props = defineProps(makeEvBlockProps());
const slots = useSlots();

</script>
<template>
    <div
        :class="[
            'ev-block',
            props.class
        ]"
        :style="[
            props.style
        ]"
    >
        <slot />
    </div>
</template>