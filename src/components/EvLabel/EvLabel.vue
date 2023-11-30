<script setup lang="ts">
/**
 * # `<ev-label>`
 */
import './EvLabel.scss';
import {makeEvLabelProps} from "./EvLabel.ts";
import {useSlots} from "vue";

const props = defineProps(makeEvLabelProps());
const slots = useSlots();

</script>
<template>
    <label
        :class="[
            'ev-label',
            {
                'is-clickable': props.clickable
            },
            props.class
        ]"
        :style="props.style"
    >
        <slot>{{ props.text }}</slot>
    </label>
</template>