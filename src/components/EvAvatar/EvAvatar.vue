<script setup lang="ts">
/**
 * `<ev-avatar>`
 */
import './EvAvatar.scss';
import {makeEvAvatarProps} from "./EvAvatar.ts";
import {useAppearance} from "@/util";
import {EvIcon, EvImg} from "@/components";

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
        <ev-img v-if="props.image" key="image" alt="" cover />
        <ev-icon v-else-if="props.icon" :glyph="props.icon" />
        <slot v-else name="default">{{ props.text }}</slot>
    </div>
</template>