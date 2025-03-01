<script setup lang="ts">
import "./EvEditOnClick.scss";
import { makeEvEditOnClickProps } from "./EvEditOnClick";
import { useModelProxy } from "@/composables/modelProxy";
import { ref, watch } from "vue";
import { EvButton } from "@/components/EvButton";
import { EvButtonGroup } from "@/components/EvButtonGroup";
import { EvTextfield } from "@/components/EvTextfield";
import { CancelIcon, CheckIcon } from "@/icons";

const props = defineProps({ ...makeEvEditOnClickProps() });
const slots = defineSlots<{
    editable(): never;
    clickable(): never;
}>();
const emit = defineEmits<{
    (e: "update:editing", value: boolean): void;
    (e: "update:modelValue", value: any): void;
}>();

const isEditing = useModelProxy(props, "editing");
const modelValue = useModelProxy(props, "modelValue");
const editValue = ref(props.modelValue);
const clickable = ref<HTMLElement | null>(null);
const editable = ref<HTMLElement | null>(null);

watch(modelValue, () => {
    editValue.value = modelValue.value;
});

function clickOutsideCondition(): boolean {
    return !props.persistent;
}

function onClickOutside() {
    cancel();
}

function cancel() {
    editValue.value = modelValue.value;
    isEditing.value = false;
}

function onClick() {
    isEditing.value = true;
    requestAnimationFrame(() => {
        const input = editable.value.querySelector(
            "input, select, textarea",
        ) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null;
        input?.focus();
    });
}

function confirm() {
    modelValue.value = editValue.value;
    isEditing.value = false;
}

const clickOutsideDirectiveArgs = {
    handler: onClickOutside,
    condition: clickOutsideCondition,
    include: () => [],
};
</script>

<template>
    <div
        :class="['ev-edit-on-click', { 'is-editing': isEditing }, props.class]"
        :style="props.style"
        v-click-outside="clickOutsideDirectiveArgs">
        <div v-if="isEditing" ref="editable" class="ev-edit-on-click--editable">
            <slot name="editable">
                <ev-textfield
                    v-model="editValue"
                    @keyup.enter="confirm"
                    @keyup.esc="cancel" />
            </slot>
            <ev-button-group size="small">
                <ev-button :icon="CancelIcon" @click="cancel" />
                <ev-button :icon="CheckIcon" @click="confirm" />
            </ev-button-group>
        </div>
        <div
            v-else
            ref="clickable"
            role="button"
            class="ev-edit-on-click--clickable"
            @click="onClick">
            <slot name="clickable">{{ modelValue }}</slot>
        </div>
    </div>
</template>
