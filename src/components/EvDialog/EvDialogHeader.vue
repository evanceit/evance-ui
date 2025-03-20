<script lang="ts">
import { propsFactory } from "@/util";
import { IconProp } from "@/composables/icons";
import { PropType } from "vue";
import { EvButtonProps } from "@/components/EvButton";

export const makeEvDialogHeaderProps = propsFactory(
    {
        modelValue: Boolean,
        actions: Array as PropType<readonly EvButtonProps[]>,
        closeable: {
            type: Boolean,
            default: true,
        },
        icon: IconProp,
        title: String,
    },
    "EvDialogHeader",
);
</script>

<script setup lang="ts">
import { useModelProxy } from "@/composables/modelProxy";
import { EvToolbar } from "@/components/EvToolbar";
import { computed } from "vue";

const props = defineProps({
    ...makeEvDialogHeaderProps(),
});
const slots = defineSlots<{
    default(): never;
}>();
const isActive = useModelProxy(props, "modelValue");

/**
 * ## Close
 */
function close() {
    isActive.value = false;
}

const closeable = computed(() => (props.closeable ? close : undefined));
</script>

<template>
    <div v-if="slots.default" class="ev-dialog--header">
        <slot />
    </div>
    <ev-toolbar
        v-else
        :class="['ev-dialog--header', { 'is-untitled': !props.title }]"
        :actions="props.actions"
        :icon="props.icon"
        :title="props.title"
        size="large"
        @click:close="closeable" />
</template>
