<script setup lang="ts">
import { toRefs } from "vue";
import { provideDefaults } from "@/composables/defaults";
import { makeEvDefaultsProviderProps } from "./EvDefaultsProvider";

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
