<template>
    <button class="ev-button">
        My Test Component
    </button>

    <ev-icon :glyph="evanceIcon"></ev-icon>
</template>

<script setup lang="ts">
    import evanceIcon from '../icons/glyph/evance.svg';
    import EvIcon from "./EvIcon.vue";
</script>

<style lang="scss">

    .ev-theme-light {
        button.ev-button {
            background: #0f0;
        }
    }

    .ev-theme-dark {
        button.ev-button {
            background: #00f;
        }
    }
</style>