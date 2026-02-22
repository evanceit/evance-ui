<script setup lang="ts">
import "./EvPage.scss";
import { makeEvPageProps } from "./EvPage";
import { EvSurface } from "@/components/EvSurface";
import { EvContainer } from "@/components/EvGrid";

const props = defineProps({
    ...makeEvPageProps(),
});
</script>

<template>
    <ev-surface
        grow
        elevation="sunken"
        :scrollable="true"
        :class="['ev-page', props.class]"
        :style="props.style">
        <ev-container size="small">
            <h1>Example Page</h1>
            <p class="text-subtitle">Some content</p>
        </ev-container>
    </ev-surface>
</template>
