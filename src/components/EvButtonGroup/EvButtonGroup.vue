<script setup lang="ts">
/**
 * # EvButtonGroup
 */
import './EvButtonGroup.scss';
import {makeEvButtonGroupProps} from "./EvButtonGroup.ts";
import {provideDefaults} from "@/composables/defaults.ts";
import {toRef} from "vue";

const props = defineProps(makeEvButtonGroupProps());

provideDefaults({
    EvButton: {
        appearance: toRef(props, 'appearance'),
        variant: toRef(props, 'variant'),
        size: toRef(props, 'size')
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