<script setup lang="ts">
import "./EvSwatch.scss";
import { makeBackground, makeEvSwatchProps } from "./EvSwatch";
import { useRounded } from "@/composables/rounded";
import { sizeModifier } from "@/util";
import { computed } from "vue";

const props = defineProps({
    ...makeEvSwatchProps(),
});

const { roundedClasses } = useRounded(props);
const sizeClass = computed(() => sizeModifier(props.size));

function makeSampleStyles() {
    return computed(() => {
        return {
            background: makeBackground(props.value),
        };
    });
}

const sampleStyles = makeSampleStyles();

</script>

<template>
    <div
        :class="['ev-swatch', sizeClass, roundedClasses, props.class]"
        :style="props.style">
        <div class="ev-swatch--sample" :style="sampleStyles"></div>
    </div>
</template>
