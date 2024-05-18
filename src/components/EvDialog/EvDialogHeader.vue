<script lang="ts">
import { propsFactory } from "@/util";

export const makeEvDialogHeaderProps = propsFactory(
    {
        modelValue: Boolean,
    },
    "EvDialogHeader",
);
</script>

<script setup lang="ts">
import { useModelProxy } from "@/composables/modelProxy.ts";
import { CancelIcon } from "@/icons";
import EvButton from "../EvButton/EvButton.vue";

const props = defineProps({
    ...makeEvDialogHeaderProps(),
});
const isActive = useModelProxy(props, "modelValue");

/**
 * ## Close
 */
function close() {
    isActive.value = false;
}
</script>

<template>
    <div class="ev-dialog---header">
        <slot />

        <ev-button rounded variant="subtle" :icon="CancelIcon" @click="close()" />
    </div>
</template>
