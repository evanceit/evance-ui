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
        appearance: props.appearance,
        variant: props.variant,
        size: props.size
    }
});

</script>
<template>
    <component
        :is="props.tag"
        :class="[
            'ev-button-group',
            {
                'is-rounded': props.rounded
            },
            props.class
        ]"
        :style="props.style"
    >
        <slot />
    </component>
</template>