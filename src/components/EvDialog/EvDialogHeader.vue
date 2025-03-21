<script lang="ts">
import { propsFactory } from "@/util";
import { makeEvToolbarProps } from "@/components/EvToolbar";

export const makeEvDialogHeaderProps = propsFactory(
    {
        modelValue: Boolean,
        closeable: {
            type: Boolean,
            default: true,
        },
        ...makeEvToolbarProps({
            size: "large",
        }),
    },
    "EvDialogHeader",
);
</script>

<script setup lang="ts">
import { useModelProxy } from "@/composables/modelProxy";
import { EvToolbar } from "@/components/EvToolbar";
import { computed } from "vue";
import { filterComponentProps } from "@/util";

const props = defineProps({
    ...makeEvDialogHeaderProps(),
});
const slots = defineSlots<{
    default(): never;
}>();
const emit = defineEmits<{
    (e: "update:modelValue", value: boolean): void;
    (e: "close"): void;
}>();
const isActive = useModelProxy(props, "modelValue");

/**
 * ## Close
 */
function close() {
    isActive.value = false;
    emit("close");
}

const closeable = computed(() => (props.closeable ? close : undefined));

const toolbarProps = computed(() => {
    return filterComponentProps(EvToolbar, props);
});
</script>

<template>
    <div
        v-if="slots.default"
        :class="['ev-dialog--header', props.class]"
        :style="props.style">
        <slot />
    </div>
    <ev-toolbar
        v-else
        :class="['ev-dialog--header', { 'is-untitled': !props.title }]"
        v-bind="toolbarProps"
        @click:close="closeable" />
</template>
