<script setup lang="ts">
/**
 * `<ev-avatar>`
 */
import './EvAvatar.scss';
import {makeEvAvatarProps} from "./EvAvatar.ts";
import {useAppearance} from "@/util";
import {EvIcon} from "@/components";

const props = defineProps(makeEvAvatarProps());
const { appearanceClasses } = useAppearance(props);

</script>
<template>
    <div
        :class="[
            'ev-avatar',
            appearanceClasses,
            props.class
        ]"
        :style="props.style"
    >
        <ev-icon :glyph="props.icon" />
        <slot>{{ props.text }}</slot>
    </div>
</template>