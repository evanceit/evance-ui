<script setup lang="ts">
import "./EvThumbnail.scss";
import { makeEvThumbnailProps } from "./EvThumbnail";
import { EvImg } from "@/components/EvImg";
import { computed } from "vue";
import { filterComponentProps } from "@/util";
import { useRounded } from "@/composables/rounded";
import { DangerIcon, ImageIcon } from "@/icons";
import { EvIcon } from "@/components/EvIcon";
import { EvSkeleton } from "@/components/EvSkeleton";

const props = defineProps({ ...makeEvThumbnailProps() });
const slots = defineSlots<{
    default(): never;
}>();
const imgProps = computed(() => filterComponentProps(EvImg, props));
const { roundedClasses } = useRounded(props);

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
            <ev-skeleton width="100%" height="100%" />
        </template>
        <template #error>
            <ev-icon :glyph="DangerIcon" appearance="danger" />
        </template>
    </ev-img>
</template>
