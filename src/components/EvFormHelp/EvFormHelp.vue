<script setup lang="ts">
import "./EvFormHelp.scss";
import { makeEvFormHelpProps } from "./EvFormHelp.ts";
import { provideDefaults } from "@/composables/defaults.ts";
import { computed, toRef } from "vue";
import { useDisplay } from "@/composables";

const props = defineProps({ ...makeEvFormHelpProps() });
const display = useDisplay();

provideDefaults({
    EvFieldHelp: {
        breakpoint: toRef(props, "breakpoint"),
    },
});

const isShow = computed(() => {
    const displayRule = `${props.breakpoint}Up`;
    return display[displayRule]?.value ?? false;
});
</script>

<template>
    <div
        :class="['ev-form-help', { 'is-visible': isShow }, props.class]"
        :style="props.style">
        <slot />
    </div>
</template>
