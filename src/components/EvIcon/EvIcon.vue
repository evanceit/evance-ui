<script setup lang="ts">
/**
 * # EvIcon
 */
import './EvIcon.scss';

const props = defineProps({
    glyph: Object
});

</script>
<template>
    <i class="ev-icon">
        <component :is="glyph"></component>
    </i>
</template>