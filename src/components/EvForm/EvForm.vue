<script setup lang="ts">

import {ref} from "vue";

const formRef = ref<HTMLFormElement>();

</script>
<template>
    <form
        ref="formRef"
        class="ev-form"
        novalidate>
        <slot />
    </form>
</template>