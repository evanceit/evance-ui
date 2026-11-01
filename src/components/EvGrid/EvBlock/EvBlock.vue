<script setup lang="ts">
import "./EvBlock.scss";
import { makeEvBlockProps } from "./EvBlock";
import { computed } from "vue";
import {
    useBreakpointClasses,
    useDisplayRuleClasses,
    useDisplayRuleValue,
} from "@/composables/display.ts";
import { isBoolean, isEmpty } from "@/util";
import { useContainer } from "@/composables";

const props = defineProps({
    ...makeEvBlockProps(),
});
const containerState = useContainer();

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
const sizeModes = { hug: "hug", auto: "hug", fill: "fill", grow: "fill" };
const widthValue = useDisplayRuleValue(props.width, containerState);
const widthClass = computed(
    () => sizeModes[widthValue.value] && `w-${sizeModes[widthValue.value]}`,
);
const widthStyles = computed(() => {
    return isEmpty(widthValue.value) || !!widthClass.value
        ? undefined
        : { flex: `0 0 ${widthValue.value}`, maxWidth: widthValue.value };
});

/**
 * Height
 */
const heightValue = useDisplayRuleValue(props.height, containerState);
const heightClass = computed(
    () => sizeModes[heightValue.value] && `h-${sizeModes[heightValue.value]}`,
);
const heightStyles = computed(() => {
    return isEmpty(heightValue.value) || !!heightClass.value
        ? undefined
        : { height: heightValue.value };
});

/**
 * Hidden
 */
const hiddenClasses = useDisplayRuleClasses(props, "hidden", "hidden");
const hiddenAttribute = computed(() => {
    return isBoolean(props.hidden) && props.hidden;
});

/**
 * Grid spans
 */
const gridColSpanValue = useDisplayRuleValue(
    props.gridColSpan,
    containerState,
    false,
);
const gridColSpanClass = computed(() =>
    isEmpty(gridColSpanValue.value) ? undefined : "grid-col-span",
);
const gridColSpanStyle = computed(() =>
    isEmpty(gridColSpanValue.value)
        ? undefined
        : { "--grid-col-span": gridColSpanValue.value },
);
const gridRowSpanValue = useDisplayRuleValue(
    props.gridRowSpan,
    containerState,
    false,
);
const gridRowSpanClass = computed(() =>
    isEmpty(gridRowSpanValue.value) ? undefined : "grid-row-span",
);
const gridRowSpanStyle = computed(() =>
    isEmpty(gridColSpanValue.value)
        ? undefined
        : { "--grid-row-span": gridRowSpanValue.value },
);
</script>

<template>
    <component
        :is="props.tag"
        :class="[
            'ev-block',
            {
                'is-scrollable': props.scrollable,
            },
            widthClass,
            heightClass,
            gridColSpanClass,
            gridRowSpanClass,
            ...sizeClasses,
            ...orderClasses,
            ...offsetClasses,
            ...alignSelfClasses,
            ...hiddenClasses,
            props.class,
        ]"
        :style="[
            props.style,
            widthStyles,
            heightStyles,
            gridColSpanStyle,
            gridRowSpanStyle,
        ]"
        :hidden="hiddenAttribute">
        <slot />
    </component>
</template>
