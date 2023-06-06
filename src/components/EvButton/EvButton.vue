<template>
    <button class="ev-button">
        My Test Component
    </button>

    <ev-icon :glyph="evanceIcon"></ev-icon>
</template>

<script setup lang="ts">
    import './EvButton.scss';
    import evanceIcon from '../../icons/glyph/evance.svg';
    import EvIcon from "../EvIcon.vue";
</script>