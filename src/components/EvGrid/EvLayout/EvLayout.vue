<script setup lang="ts">
import "./EvLayout.scss";
import { makeEvLayoutProps } from "./EvLayout";
import {
    useBreakpointClasses,
    useDisplayRuleClasses,
    useDisplayRuleValue,
} from "@/composables/display";
import { computed } from "vue";
import { isBoolean, isEmpty } from "@/util";
import { useContainer } from "@/composables";

const props = defineProps({
    ...makeEvLayoutProps(),
});
const containerState = useContainer();

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
const height = useDisplayRuleValue(props.height, containerState);
const heightStyles = computed(() =>
    isEmpty(height.value) ? undefined : { height: height.value },
);

/**
 * Width
 */
const width = useDisplayRuleValue(props.width, containerState);
const widthStyles = computed(() => {
    const value = width.value;
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

const gridColumns = useDisplayRuleValue(
    props.gridColumns,
    containerState,
    false,
);
const gridColumnsStyles = computed(() => {
    return isEmpty(gridColumns.value)
        ? undefined
        : `--ev-layout-grid-cols: ${gridColumns.value}`;
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
        :style="[props.style, widthStyles, heightStyles, gridColumnsStyles]"
        :hidden="hiddenAttribute">
        <slot />
    </component>
</template>
