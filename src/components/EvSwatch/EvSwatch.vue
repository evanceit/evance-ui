<script setup lang="ts">
import "./EvSwatch.scss";
import { makeEvSwatchProps } from "./EvSwatch";

const props = defineProps({
    ...makeEvSwatchProps(),
});

</script>

<template>
    <div :class="['ev-swatch', props.class]" :style="props.style">
        <div class="ev-swatch--sample"></div>
    </div>
</template>
