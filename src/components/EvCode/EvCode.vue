<script setup lang="ts">
import "./EvCode.scss";
import { makeEvCodeProps } from "./EvCode.ts";

const props = defineProps({ ...makeEvCodeProps() });

const slots = defineSlots<{
    default(): never;
}>();
</script>

<template>
    <code :class="['ev-code', props.class]" :style="props.style">
        <slot>{{ props.text }}</slot>
    </code>
</template>
