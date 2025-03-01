<script setup lang="ts">
/**
 * # EvIcon
 *
 *  Uses `glyph` to render an SVG-based icon.
 */
import "./EvIcon.scss";
import { makeEvIconProps } from "./EvIcon";
import { computed, toRaw, useAttrs } from "vue";
import { Appearance, appearanceModifier, sizeModifier } from "@/util";
import { useDefaults } from "@/composables";

const definedProps = defineProps({
    ...makeEvIconProps(),
});
const props = useDefaults(definedProps);
const attrs = useAttrs();

const iconColor = computed(() => {
    if (!props.appearance || props.appearance === "default") {
        return null;
    }
    if (props.appearance === "primary") {
        return `var(--text-brand)`;
    }
    return `var(--text-${props.appearance})`;
});

const iconGlyph = computed(() => {
    return toRaw(props.glyph) as string;
});
</script>

<template>
    <i
        class="ev-icon"
        :class="[
            {
                'is-clickable': !!attrs.onClick,
            },
            appearanceModifier(props.appearance, [Appearance.default]),
            sizeModifier(props.size, ['medium']),
        ]">
        <component :is="iconGlyph"></component>
    </i>
</template>

<style>
.ev-icon {
    --icon-color: v-bind(iconColor);
}
</style>
