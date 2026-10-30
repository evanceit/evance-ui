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
const gapClasses = useBreakpointClasses(props, "gap", "ga");

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

const flowClass = computed(() => {
    if (props.column || props.flow === "vertical") {
        return "flex-column";
    }
    return props.flow === "grid" ? "grid" : "flex-row";
});

const gridColumns = computed(() => {
    const value = calculateDisplayRuleValue(props.gridColumns, false);
    if (isEmpty(value)) {
        return undefined;
    }
    return `--ev-layout-grid-cols: ${value}`;
});
</script>

<template>
    <component
        :is="props.tag"
        :class="[
            'ev-layout',
            flowClass,
            ...alignItemsClasses,
            ...alignContentClasses,
            ...justifyContentClasses,
            ...gapClasses,
            ...hiddenClasses,
            props.class,
        ]"
        :style="[props.style, widthStyles, heightStyles, gridColumns]"
        :hidden="hiddenAttribute">
        <slot />
    </component>
</template>
