<script setup lang="ts">
import "./EvPage.scss";
import { makeEvPageProps } from "./EvPage";

const props = defineProps({
    ...makeEvPageProps(),
});
</script>

<template>
    <div
        :class="['ev-page', props.class]"
        :style="props.style">
        Page
    </div>
</template>
