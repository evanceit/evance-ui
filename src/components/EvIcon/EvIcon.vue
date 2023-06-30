<script setup lang="ts">
/**
 * # EvIcon
 *
 *  Uses `glyph` to render an SVG-based icon.
 */
import './EvIcon.scss';

const props = defineProps({
    glyph: Object,
    size: String
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