<script setup lang="ts">
import "./EvContainer.scss";
import { makeEvContainerProps } from "./EvContainer";
import { useDisplayRuleClasses } from "@/composables/display";
import { computed } from "vue";
import { isBoolean } from "@/util";
import { useDimensions } from "@/composables";

const props = defineProps({
    ...makeEvContainerProps(),
});
const dimensions = useDimensions(props);
const hiddenClasses = useDisplayRuleClasses(props, "hidden", "hidden");
const hiddenAttribute = computed(() => {
    return isBoolean(props.hidden) && props.hidden;
});

const sizeClass = computed(() => {
    return props.size ? `is-size-${props.size}` : undefined;
});

const centeredClass = computed(() => {
    return props.centered ? "is-centered" : undefined;
});
</script>

<template>
    <component
        :is="props.tag"
        :class="[
            'ev-container',
            centeredClass,
            sizeClass,
            ...hiddenClasses,
            props.class,
        ]"
        :style="[props.style, dimensions]"
        :hidden="hiddenAttribute">
        <slot />
    </component>
</template>
