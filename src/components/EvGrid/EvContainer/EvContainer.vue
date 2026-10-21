<script setup lang="ts">
import "./EvContainer.scss";
import { makeEvContainerProps } from "./EvContainer";
import { useDisplayRuleClasses } from "@/composables/display";
import { computed, shallowRef } from "vue";
import { isBoolean } from "@/util";
import { provideContainer, useDimensions } from "@/composables";

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

const containerName = computed(() => {
    return props.contain && props.name
        ? { containerName: props.name }
        : undefined;
});
const el = shallowRef<HTMLElement | null>(null);

if (props.contain) {
    provideContainer(el, { thresholds: props.thresholds });
}
</script>

<template>
    <component
        :is="props.tag"
        ref="el"
        :class="[
            'ev-container',
            {
                'is-contain': props.contain,
                'is-centered': props.centered,
            },
            sizeClass,
            ...hiddenClasses,
            props.class,
        ]"
        :style="[props.style, dimensions, containerName]"
        :hidden="hiddenAttribute">
        <slot />
    </component>
</template>
