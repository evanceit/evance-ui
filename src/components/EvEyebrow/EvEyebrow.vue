<script setup lang="ts">
import "./EvEyebrow.scss";
import { makeEvEyebrowProps } from "./EvEyebrow.ts";

const props = defineProps({ ...makeEvEyebrowProps() });
</script>

<template>
    <component
        :is="props.tag"
        :class="['ev-eyebrow', 'text-eyebrow', props.class]"
        :style="props.style">
        <slot>{{ props.text }}</slot>
    </component>
</template>
