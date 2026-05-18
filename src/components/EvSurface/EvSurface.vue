<script setup lang="ts">
import "./EvSurface.scss";
import { makeElevationClass, makeEvSurfaceProps } from "./EvSurface";
import { useDimensions } from "@/composables/dimensions";
import { useRounded } from "@/composables/rounded";
import { useScrollable } from "@/composables/scrollable";

const props = defineProps({
    ...makeEvSurfaceProps(),
});
const dimensions = useDimensions(props);
const { roundedClasses } = useRounded(props);
const { scrollableClasses } = useScrollable(props);
</script>

<template>
    <component
        :is="props.tag"
        :class="[
            'ev-surface',
            {
                'is-grow': props.grow,
            },
            makeElevationClass(props.elevation),
            roundedClasses,
            scrollableClasses,
            props.class,
        ]"
        :style="[dimensions, props.style]">
        <slot />
    </component>
</template>
