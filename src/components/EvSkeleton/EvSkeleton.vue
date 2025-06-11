<script setup lang="ts">
import "./EvSkeleton.scss";
import {
    makeEvSkeletonProps,
    mergeWithPreset,
    skeletonPresets,
} from "./EvSkeleton";
import { useRounded } from "@/composables/rounded";
import { useDimensions } from "@/composables";
import { computed } from "vue";
import { makeClassName, sizeModifier } from "@/util";
import { useAspectStyles } from "@/composables/aspectRatio";

const props = defineProps({ ...makeEvSkeletonProps() });

const size = computed(() => {
    return props.type ? props.size ?? "medium" : undefined;
});

const computedProps = computed(() => {
    if (!props.type) {
        return props;
    }
    const preset = skeletonPresets[props.type] ?? {};
    const presetDefaults = preset.defaults ?? {};
    const presetProps = preset[size.value] ?? {};
    return mergeWithPreset(props, { ...presetDefaults, ...presetProps });
});

const roundedClasses = computed(
    () => useRounded(computedProps.value).roundedClasses.value,
);
const dimensionStyles = computed(
    () => useDimensions(computedProps.value).value,
);
const sizeClass = computed(() => sizeModifier(size.value));
const typeClass = computed(() => makeClassName(props.type, "is-type"));
const aspectStyles = computed(() => {
    return useAspectStyles(computedProps.value).aspectStyles.value;
});

</script>

<template>
    <div
        :class="[
            'ev-skeleton',
            {
                'is-inline': computedProps.inline,
            },
            typeClass,
            sizeClass,
            roundedClasses,
            props.class,
        ]"
        :style="[dimensionStyles, aspectStyles, props.style]"
        aria-hidden="true"></div>
</template>
