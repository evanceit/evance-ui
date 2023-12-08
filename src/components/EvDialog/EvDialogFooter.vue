<script setup lang="ts">

import {useSlots} from "vue";

const slots = useSlots();
</script>
<template>
    <div class="ev-dialog--footer">
        <slot />
    </div>
</template>