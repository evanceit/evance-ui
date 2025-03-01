<script setup lang="ts">
/**
 * `<ev-avatar>`
 */
import "./EvAvatar.scss";
import { makeEvAvatarProps } from "./EvAvatar";
import { useAppearance } from "@/util";
import { EvIcon } from "@/components/EvIcon";
import { EvImg } from "@/components/EvImg";
import { useSize } from "@/composables/size";
import { useRounded } from "@/composables/rounded";
import { useDefaults } from "@/composables";

const definedProps = defineProps({
    ...makeEvAvatarProps(),
});
const props = useDefaults(definedProps);
const { appearanceClass, variantClass } = useAppearance(props);
const { sizeClasses, sizeStyles } = useSize(props);
const { roundedClasses } = useRounded(props);

defineSlots<{
    default(): never;
}>();

// @todo: color styles
</script>

<template>
    <div
        :class="[
            'ev-avatar',
            appearanceClass,
            variantClass,
            sizeClasses,
            roundedClasses,
            props.class,
        ]"
        :style="[sizeStyles, props.style]">
        <ev-img
            v-if="props.image"
            key="image"
            alt=""
            cover
            :src="props.image" />
        <ev-icon v-else-if="props.icon" :glyph="props.icon" />
        <slot v-else name="default">{{ props.text }}</slot>
    </div>
</template>
