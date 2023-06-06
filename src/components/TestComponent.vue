<template>
    <button>My Test Component</button>
</template>

<script setup lang="ts">

</script>

<style lang="scss">
    button {
        background: #f00;
    }

    .ev-theme-light {
        button {
            background: #0f0;
        }
    }

    .ev-theme-dark {
        button {
            background: #00f;
        }
    }
</style>