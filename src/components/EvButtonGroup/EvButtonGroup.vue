<script setup lang="ts">
/**
 * # EvButtonGroup
 */
import './EvButtonGroup.scss';
import {makeEvButtonGroupProps} from "./EvButtonGroup.ts";
import {provideDefaults} from "@/composables/defaults.ts";

const props = defineProps(makeEvButtonGroupProps());

provideDefaults({
    EvButton: {
        appearance: 'default',
        variant: 'subtle'
    }
});

</script>
<template>
    <component
        :is="props.tag"
        :class="[
            'ev-button-group',
            props.class
        ]"
        :style="props.style"
    >
        <slot />
    </component>
</template>