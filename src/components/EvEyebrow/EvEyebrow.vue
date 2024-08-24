<script setup lang="ts">
import "./EvEyebrow.scss";
import { makeEvEyebrowProps } from "./EvEyebrow.ts";
import { useTextAppearance } from "@/util";

const props = defineProps({ ...makeEvEyebrowProps() });

const slots = defineSlots<{
    default(): never;
}>();

const { appearanceClass } = useTextAppearance(props);
</script>

<template>
    <component
        :is="props.tag"
        :class="['ev-eyebrow', 'text-eyebrow', appearanceClass, props.class]"
        :style="props.style">
        <slot>{{ props.text }}</slot>
    </component>
</template>
