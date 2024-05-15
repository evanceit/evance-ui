<script setup lang="ts">
/**
 * # EvButtonGroup
 */
import "./EvButtonGroup.scss";
import { makeEvButtonGroupProps } from "./EvButtonGroup.ts";
import { provideDefaults } from "@/composables/defaults.ts";
import { computed, toRef } from "vue";
import { appearanceModifier, variantModifier } from "@/util";

const props = defineProps({
    ...makeEvButtonGroupProps(),
});

defineSlots<{
    default(): never;
}>();

provideDefaults({
    EvButton: {
        appearance: toRef(props, "appearance"),
        variant: toRef(props, "variant"),
        size: toRef(props, "size"),
    },
});

const appearanceClass = computed(() => appearanceModifier(props.appearance));
const variantClass = computed(() => variantModifier(props.variant));
</script>

<template>
    <component
        :is="props.tag"
        :class="[
            'ev-button-group',
            appearanceClass,
            variantClass,
            {
                'is-rounded': props.rounded,
            },
            props.class,
        ]"
        :style="props.style">
        <div class="ev-button-group--container">
            <slot />
        </div>
    </component>
</template>
