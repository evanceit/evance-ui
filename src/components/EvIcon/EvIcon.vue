<template>
    <i class="ev-icon">
        <component :is="glyph"></component>
    </i>
</template>

<script setup lang="ts">

// Styling
import './EvIcon.scss';

const props = defineProps({
    glyph: Object
});

</script>