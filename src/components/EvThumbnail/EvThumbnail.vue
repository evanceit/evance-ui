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
import { parseAspectRatio } from "@/composables/aspectRatio";

const props = defineProps({ ...makeEvThumbnailProps() });
const slots = defineSlots<{
    default(): never;
}>();

const computedProps = computed(() => {
    if (!props.size) {
        return props;
    }
    const presets = thumbnailPresets[props.size] ?? {};
    const defaults = thumbnailPresets.defaults;
    const combined = applyDefaults(props, { ...defaults, ...presets });

    if (!combined.width && combined.aspectRatio && combined.height) {
        const aspectRatio = parseAspectRatio(combined.aspectRatio);
        if (aspectRatio && isFinite(aspectRatio)) {
            const numericHeight =
                typeof combined.height === "string"
                    ? parseFloat(combined.height)
                    : combined.height;
            const width = Math.round(numericHeight * aspectRatio);
            return { ...combined, width };
        }
    }
    return combined;
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
