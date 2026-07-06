<script setup lang="ts">
import "./EvPage.scss";
import { makeEvPageProps } from "./EvPage";
import { EvSurface } from "@/components/EvSurface";
import { EvContainer } from "@/components/EvGrid";

const props = defineProps({
    ...makeEvPageProps(),
});

const slots = defineSlots<{
    default(): never;
}>();
</script>

<template>
    <ev-surface
        grow
        :elevation="props.elevation"
        :scrollable="true"
        :class="['ev-page', props.class]"
        :style="props.style">
        <ev-container :size="props.inlineSize">
            <slot name="default" />
        </ev-container>
    </ev-surface>
</template>
