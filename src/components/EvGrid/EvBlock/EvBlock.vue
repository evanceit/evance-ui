<script setup lang="ts">
import './EvBlock.scss';
import {makeEvBlockProps} from "./EvBlock.ts";
import {useSlots} from "vue";

const props = defineProps(makeEvBlockProps());
const slots = useSlots();

</script>
<template>
    <component
        :is="props.tag"
        :class="[
            'ev-block',
            {
                'is-scrollable': props.scrollable
            },
            props.class
        ]"
        :style="[
            props.style
        ]"
    >
        <slot />
    </component>
</template>