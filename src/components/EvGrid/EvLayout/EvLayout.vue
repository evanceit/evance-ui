<script setup lang="ts">
import "./EvLayout.scss";
import { makeEvLayoutProps } from "./EvLayout";
import {
    calculateDisplayRuleValue,
    useBreakpointClasses,
    useDisplayRuleClasses,
} from "@/composables/display";
import { computed } from "vue";
import { isBoolean, isEmpty } from "@/util";

const props = defineProps({
    ...makeEvLayoutProps(),
});

const alignItemsClasses = useBreakpointClasses(props, "align", "align");
const alignContentClasses = useBreakpointClasses(
    props,
    "alignContent",
    "align-content",
);
const justifyContentClasses = useBreakpointClasses(props, "justify", "justify");
const gutterClasses = useBreakpointClasses(props, "gutter", "gutter");

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

/**
 * Width
 */
const widthStyles = computed(() => {
    const value = calculateDisplayRuleValue(props.width);
    if (isEmpty(value)) {
        return undefined;
    }
    return value === "grow"
        ? { flex: "1 0 auto", maxWidth: "100%", width: "100%" }
        : { flex: `0 0 ${value}`, maxWidth: value, width: value };
});
</script>

<template>
    <component
        :is="props.tag"
        :class="[
            'ev-layout',
            {
                'is-column': props.column,
                'is-nowrap': props.nowrap,
            },
            ...alignItemsClasses,
            ...alignContentClasses,
            ...justifyContentClasses,
            ...gutterClasses,
            ...hiddenClasses,
            props.class,
        ]"
        :style="[props.style, widthStyles, heightStyles]"
        :hidden="hiddenAttribute">
        <slot />
    </component>
</template>
