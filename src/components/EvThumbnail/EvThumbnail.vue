<script setup lang="ts">
import "./EvThumbnail.scss";
import { makeEvThumbnailProps, thumbnailPresets } from "./EvThumbnail";
import { EvImg } from "@/components/EvImg";
import { computed } from "vue";
import { applyDefaults, filterComponentProps } from "@/util";
import { useRounded } from "@/composables/rounded";
import { DangerIcon, ImageIcon } from "@/icons";
import { EvIcon } from "@/components/EvIcon";
import { EvSkeleton } from "@/components/EvSkeleton";

const props = defineProps({ ...makeEvThumbnailProps() });
const slots = defineSlots<{
    default(): never;
}>();

const computedProps = computed(() => {
    if (!props.size) {
        return props;
    }
    const presetProps = thumbnailPresets[props.size] ?? {};
    const presetDefaults = thumbnailPresets.defaults;
    return applyDefaults(props, { ...presetDefaults, ...presetProps });
});

const imgProps = computed(() =>
    filterComponentProps(EvImg, computedProps.value),
);
const roundedClasses = computed(
    () => useRounded(computedProps.value).roundedClasses.value,
);
</script>

<template>
    <ev-img :class="['ev-thumbnail', roundedClasses]" v-bind="imgProps">
        <template v-if="slots.default" #default>
            <slot />
        </template>
        <template #placeholder>
            <ev-icon :glyph="ImageIcon" appearance="subtle" />
        </template>
        <template #loading>
            <ev-skeleton type="image" width="100%" height="100%" />
        </template>
        <template #error>
            <ev-icon :glyph="DangerIcon" appearance="danger" />
        </template>
    </ev-img>
</template>
