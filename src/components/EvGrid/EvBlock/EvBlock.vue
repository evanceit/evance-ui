<script setup lang="ts">
import "./EvBlock.scss";
import { makeEvBlockProps } from "./EvBlock.ts";
import { computed } from "vue";
import {
    calculateDisplayRuleValue,
    useBreakpointClasses,
    useDisplayRuleClasses,
} from "@/composables/display.ts";
import { isBoolean, isEmpty } from "@/util";

const props = defineProps(makeEvBlockProps());

/**
 * # Size Classes
 */
const sizeClasses = useBreakpointClasses(props, "size", undefined, true);
const orderClasses = useBreakpointClasses(props, "order", "order");
const offsetClasses = useBreakpointClasses(props, "offset", "offset");
const alignSelfClasses = useBreakpointClasses(props, "alignSelf", "align-self");

/**
 * Width
 */
const widthStyles = computed(() => {
    const value = calculateDisplayRuleValue(props.width);
    if (isEmpty(value)) {
        return undefined;
    }
    return value === "grow"
        ? { flex: "1 0 auto", maxWidth: "100%" }
        : { flex: `0 0 ${value}`, maxWidth: value };
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
    return { height: value };
});
</script>

<template>
    <component
        :is="props.tag"
        :class="[
            'ev-block',
            {
                'is-scrollable': props.scrollable,
            },
            ...sizeClasses,
            ...orderClasses,
            ...offsetClasses,
            ...alignSelfClasses,
            ...hiddenClasses,
            props.class,
        ]"
        :style="[props.style, widthStyles, heightStyles]"
        :hidden="hiddenAttribute">
        <slot />
    </component>
</template>
