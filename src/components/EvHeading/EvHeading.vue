<script setup lang="ts">
import "./EvHeading.scss";
import {
    EvHeadingClass,
    EvHeadingSize,
    EvHeadingTag,
    makeEvHeadingProps,
} from "./EvHeading.ts";
import { useDefaults } from "@/composables";
import { computed } from "vue";
import { isBoolean, isNumber } from "@/util";

const definedProps = defineProps({
    ...makeEvHeadingProps(),
});
const props = useDefaults(definedProps);

const tag = computed(() => {
    if (props.tag) {
        return props.tag;
    }
    return EvHeadingTag[props.size] ?? EvHeadingTag[EvHeadingSize.default];
});

const sizeClass = computed(() => {
    if (!props.tag) {
        return undefined;
    }
    return EvHeadingClass[props.size] ?? EvHeadingClass[EvHeadingSize.default];
});

const truncateClass = computed(() => {
    if (!props.truncate) {
        return undefined;
    }
    return isBoolean(props.truncate) ? "is-truncate" : "is-truncate-lines";
});

const maxLines = computed(() => {
    if (isNumber(props.truncate)) {
        return props.truncate;
    }
    return 1;
});
</script>

<template>
    <component
        :is="tag"
        :class="['ev-heading', sizeClass, truncateClass, props.class]"
        :style="props.style">
        <slot>{{ props.text }}</slot>
    </component>
</template>

<style>
.ev-heading {
    --max-lines: v-bind(maxLines);
}
</style>
