<script setup lang="ts">
import "./EvSpacer.scss";
import { makeEvSpacerProps } from "./EvSpacer";

const props = defineProps({
    ...makeEvSpacerProps(),
});
</script>

<template>
    <div :class="['ev-spacer', props.class]" :style="[props.style]">
        <slot />
    </div>
</template>
