<script setup lang="ts">
import "./EvCard.scss";
import { makeEvCardProps } from "./EvCard.ts";
import { EvCardContent } from "@/components/EvCard/EvCardContent";
import { EvCardActions } from "@/components/EvCard/EvCardActions";
import { computed } from "vue";
import { EvSurface } from "@/components/EvSurface";

const props = defineProps({ ...makeEvCardProps() });
const slots = defineSlots<{
    actions(): never;
    default(): never;
}>();

const contentProps = computed(() => {
    return {
        eyebrow: props.eyebrow,
        title: props.title,
        text: props.text,
        size: props.size,
    };
});
</script>

<template>
    <ev-surface
        :tag="props.tag"
        :class="['ev-card', props.class]"
        :elevation="props.elevation"
        :rounded="props.rounded"
        :style="props.style">
        <ev-card-content v-bind="contentProps">
            <slot name="default" />
        </ev-card-content>
        <ev-card-actions
            v-if="props.actions || slots.actions"
            :size="props.size"
            :items="props.actions">
            <slot name="actions" />
        </ev-card-actions>
    </ev-surface>
</template>
