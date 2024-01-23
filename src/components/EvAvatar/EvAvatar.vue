<script setup lang="ts">
/**
 * `<ev-avatar>`
 */
import './EvAvatar.scss';
import {makeEvAvatarProps} from "./EvAvatar.ts";
import {useAppearance} from "@/util";
import {EvIcon} from "@/components/EvIcon";
import {EvImg} from "@/components/EvImg";
import {useSize} from "@/composables/size.ts";
import {useRounded} from "@/composables/rounded.ts";

const props = defineProps(makeEvAvatarProps());
const { appearanceClasses } = useAppearance(props);
const { sizeClasses, sizeStyles } = useSize(props);
const { roundedClasses } = useRounded(props);

// @todo: color styles

</script>
<template>
    <div
        :class="[
            'ev-avatar',
            {
                'is-bold': props.bold
            },
            appearanceClasses,
            sizeClasses,
            roundedClasses,
            props.class
        ]"
        :style="[
            sizeStyles,
            props.style
        ]"
    >
        <ev-img v-if="props.image" key="image" alt="" cover :src="props.image" />
        <ev-icon v-else-if="props.icon" :glyph="props.icon" />
        <slot v-else name="default">{{ props.text }}</slot>
    </div>
</template>