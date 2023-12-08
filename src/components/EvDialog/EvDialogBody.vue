<script setup lang="ts">

import {useSlots} from "vue";

const slots = useSlots();

</script>
<template>
    <div class="ev-dialog--body is-scrollable" style="padding: 2rem;">
        <slot />
    </div>
</template>