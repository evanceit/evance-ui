<script setup lang="ts">
/**
 * # EvIcon
 *
 *  Uses `glyph` to render an SVG-based icon.
 */
import './EvIcon.scss';
import {IconSize} from "./EvIcon.ts";
import {computed, toRaw, useAttrs} from "vue";
import {Appearance, appearanceModifier, AppearanceProp, sizeModifier} from "@/util";
import {IconValue} from "@/composables/icons.ts";

/**
 * ## Icon Props
 */
interface IconProps {
    appearance?: AppearanceProp,
    glyph?: IconValue | boolean,
    size?: IconSize
}
const props = withDefaults(defineProps<IconProps>(), {
    appearance: 'default',
    size: 'medium'
});

const attrs = useAttrs();

const iconColor = computed(() => {
    if (!props.appearance || props.appearance === 'default') {
        return null;
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
                'is-clickable': !!attrs.onClick
            },
            appearanceModifier(props.appearance, [Appearance.default]),
            sizeModifier(props.size, ['medium'])
        ]"
    >
        <component :is="iconGlyph"></component>
    </i>
</template>
<style>
.ev-icon {
    --icon-color: v-bind(iconColor);
}
</style>