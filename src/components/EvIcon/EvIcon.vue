<script setup lang="ts">
/**
 * # EvIcon
 *
 *  Uses `glyph` to render an SVG-based icon.
 */
import './EvIcon.scss';

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
    glyph: Object,
    size?: IconSize
}
const props = withDefaults(defineProps<IconProps>(), {
    size: 'medium'
});

</script>
<template>
    <i class="ev-icon" :class="{
        'size-small': size === 'small',
        'size-large': size === 'large'
    }">
        <component :is="glyph"></component>
    </i>
</template>