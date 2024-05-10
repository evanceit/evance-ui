<script setup lang="ts">
import "./EvContainer.scss";
import { makeEvContainerProps } from "./EvContainer.ts";
import {
    calculateDisplayRuleValue,
    useDisplayRuleClasses,
} from "@/composables/display.ts";
import { computed } from "vue";
import { isBoolean, isEmpty } from "@/util";

const props = defineProps({
    ...makeEvContainerProps(),
});

/**
 * Hidden
 */
const hiddenClasses = useDisplayRuleClasses(props, "hidden", "hidden");
const hiddenAttribute = computed(() => {
    return isBoolean(props.hidden) && props.hidden;
});

/**
 * Height
 */
const heightStyles = computed(() => {
    const value = calculateDisplayRuleValue(props.height);
    if (isEmpty(value)) {
        return undefined;
    }
    return { height: value + " !important" };
});

/**
 * Width
 */
const widthStyles = computed(() => {
    const value = calculateDisplayRuleValue(props.width);
    if (isEmpty(value)) {
        return undefined;
    }
    return value === "grow" ? { width: "100%" } : { width: value };
});
</script>

<template>
    <component
        :is="props.tag"
        :class="[
            'ev-container',
            {
                'is-fluid': props.fluid,
                'fill-height': props.fill,
            },
            ...hiddenClasses,
            props.class,
        ]"
        :style="[props.style, widthStyles, heightStyles]"
        :hidden="hiddenAttribute">
        <slot />
    </component>
</template>
