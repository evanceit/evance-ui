<script setup lang="ts">
import "./EvFormHelp.scss";
import { makeEvFormHelpProps } from "./EvFormHelp.ts";

const props = defineProps({ ...makeEvFormHelpProps() });
</script>

<template>
    <div class="ev-form-help">
        <slot />
    </div>
</template>
