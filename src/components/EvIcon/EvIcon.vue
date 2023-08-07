<script setup lang="ts">
/**
 * # EvIcon
 *
 *  Uses `glyph` to render an SVG-based icon.
 */
import './EvIcon.scss';
import {computed, markRaw, shallowRef, useAttrs} from "vue";
import {Appearance, appearanceModifier, AppearanceProp, sizeModifier} from "../../util";

/**
 * ## Icon Size
 */
type IconSize = 'small'
    | 'medium'
    | 'large';

/**
 * ## Icon Props
 */
interface IconProps {
    appearance?: AppearanceProp,
    glyph: Object,
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
        :style="[
            {
                '--icon-color': iconColor
            }
        ]"
    >
        <component :is="glyph"></component>
    </i>
</template>