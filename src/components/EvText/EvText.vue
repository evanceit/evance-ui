<script setup lang="ts">
import "./EvText.scss";
import { EvTextSizeClass, makeEvTextProps } from "./EvText";
import { computed } from "vue";
import { AppearanceProps, isBoolean, isNumber, makeClassName, useAppearance } from "@/util";
import { useDefaults } from "@/composables";

const definedProps = defineProps({ ...makeEvTextProps() });
const props = useDefaults(definedProps);

const sizeClass = computed(() => {
    return EvTextSizeClass[props.size];
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

const weightClass = computed(() => {
    return props.weight
        ? makeClassName(props.weight, "text-weight")
        : undefined;
});

const { appearanceClass } = useAppearance(props as AppearanceProps);

</script>

<template>
    <component
        :is="props.tag"
        :class="[
            'ev-text',
            {
                'typeface-monospace': props.monospace,
            },
            sizeClass,
            weightClass,
            truncateClass,
            appearanceClass,
            props.class,
        ]"
        :style="props.style">
        <slot>{{ props.text }}</slot>
    </component>
</template>

<style>
.ev-text {
    --max-lines: v-bind(maxLines);
}
</style>
