<template>
    <span class="ev-icon">
        <component :is="glyph"></component>
    </span>
</template>

<script setup lang="ts">
const props = defineProps({
    glyph: Object
});
</script>