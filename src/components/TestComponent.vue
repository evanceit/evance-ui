<template>
    <button class="ev-button">
        My Test Component
    </button>

    <evanceIcon></evanceIcon>
</template>

<script setup lang="ts">
    import evanceIcon from '../icons/evance.svg';
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