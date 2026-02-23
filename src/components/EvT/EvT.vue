<script setup lang="ts">
import { makeEvTProps, parseTranslationTemplate } from "./EvT";
import { computed } from "vue";
import { useLocaleFunctions } from "@/composables";

const props = defineProps({ ...makeEvTProps() });
const { t } = useLocaleFunctions();

/**
 * Split the translation string template into parts:
 *
 * "Press {hotkey} to submit"
 * =>
 * [
 *   { type: "text", value: "Press " },
 *   { type: "slot", name: "hotkey" },
 *   { type: "text", value: " to submit" }
 * ]
 */
const parts = computed(() =>
    parseTranslationTemplate(t(props.keypath, props.variables)),
);
</script>

<template>
    <template v-for="(part, index) in parts" :key="index">
        <template v-if="part.type === 'text'">
            {{ part.value }}
        </template>
        <template v-else>
            <slot :name="part.name">
                {{ `{ ${part.name} }` }}
            </slot>
        </template>
    </template>
</template>
