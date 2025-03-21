<script lang="ts">
import { propsFactory } from "@/util";

export interface EvDialogBodyProps {
    padding?: boolean;
}

export const makeEvDialogBodyProps = propsFactory(
    {
        padding: {
            type: Boolean,
            default: true,
        },
    },
    "EvDialogBody",
);
</script>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
    ...makeEvDialogBodyProps(),
});

const paddingClass = computed(() => {
    return !props.padding ? "pa-0" : undefined;
});
</script>

<template>
    <div
        :class="[
            'ev-dialog--body',
            'is-scrollable',
            paddingClass,
        ]">
        <slot />
    </div>
</template>
