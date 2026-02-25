<script setup lang="ts">
import "./EvDialogHeader.scss";
import { useModelProxy } from "@/composables/modelProxy";
import { EvToolbar } from "@/components/EvToolbar";
import { computed } from "vue";
import { filterComponentProps, omit } from "@/util";
import { makeEvDialogHeaderProps } from "./EvDialogHeader";

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
    const p = {
        ...omit(filterComponentProps(EvToolbar, props), ["tag"]),
    };
    return p;
});
</script>

<template>
    <header
        v-if="slots.default"
        :class="['ev-dialog-header', props.class]"
        :style="props.style">
        <slot name="default" />
    </header>
    <ev-toolbar
        v-else
        v-bind="toolbarProps"
        tag="header"
        :class="['ev-dialog-header', { 'is-untitled': !props.title }]"
        @click:close="closeable" />
</template>
