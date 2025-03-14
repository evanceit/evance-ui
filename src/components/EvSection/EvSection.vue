<script setup lang="ts">
import "./EvSection.scss";
import { makeEvSectionProps } from "./EvSection";
import { EvEyebrow } from "@/components/EvEyebrow";

const props = defineProps({ ...makeEvSectionProps() });
const slots = defineSlots<{
    default(): never;
    heading(): never;
}>();
</script>

<template>
    <component
        :is="props.tag"
        role="group"
        :aria-label="props.title"
        :class="[
            'ev-section',
            props.class
        ]"
        :style="props.style">
        <ev-eyebrow
            v-if="props.title || slots.heading"
            tag="div"
            appearance="subtle"
            role="heading"
            class="ev-section--heading"
            aria-hidden="true">
            <slot name="heading">{{ props.title }}</slot>
        </ev-eyebrow>
        <slot name="default" />
    </component>
</template>
