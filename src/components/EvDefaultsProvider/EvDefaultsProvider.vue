<script setup lang="ts">
import { toRefs } from "vue";
import { provideDefaults } from "@/composables/defaults.ts";
import { makeEvDefaultsProviderProps } from "./EvDefaultsProvider.ts";

const props = defineProps({
    ...makeEvDefaultsProviderProps(),
});

const { defaults, disabled, reset, root, scoped } = toRefs(props);

provideDefaults(defaults, {
    reset,
    root,
    scoped,
    disabled,
});
</script>

<template>
    <slot />
</template>
