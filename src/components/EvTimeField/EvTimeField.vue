<script setup lang="ts">
import "./EvTimeField.scss";
import { makeEvTimeFieldProps } from "./EvTimeField";
import { EvMenu } from "@/components/EvMenu";
import { EvTextfield } from "@/components/EvTextfield";
import { EvSurface } from "@/components/EvSurface";
import { EvTimePicker } from "@/components/EvTimePicker";
import { computed, ref, shallowRef } from "vue";
import { filterComponentProps, omit } from "@/util";
import { FocusEvent } from "react";

const props = defineProps({
    ...makeEvTimeFieldProps(),
});
const slots = defineSlots<{
    label(): never;
}>();

// Text Field
const evMenuRef = ref<typeof EvMenu>();
const evTextfieldRef = ref<typeof EvTextfield>();
const evTextfieldProps = computed(() => {
    return omit(filterComponentProps(EvTextfield, props), ["modelValue"]);
});
const isFocused = shallowRef(false);

// Time Picker
const timePickerRef = ref<typeof EvTimePicker>();

// Menu
const isMenuOpen = shallowRef(false);

/**
 * ## On Menu After Leave
 * Maintain focus on the EvSelect when leaving the menu - usually when tabbing out.
 */
function onMenuAfterLeave() {
    if (isFocused.value && evTextfieldRef.value) {
        evTextfieldRef.value.focus();
    }
}

function onFieldFocus() {
    isFocused.value = true;
    isMenuOpen.value = true;
}

function onFieldBlur(e: FocusEvent) {
    if (!timePickerRef.value?.$el.contains(e.relatedTarget as HTMLElement)) {
        isMenuOpen.value = false;
    }
}

function onDatePickerFocusIn(e: FocusEvent) {
    isFocused.value = true;
}
</script>

<template>
    <ev-textfield
        ref="evTextfieldRef"
        v-bind="evTextfieldProps"
        v-model:focused="isFocused"
        class="ev-time-field"
        inputmode="numeric"
        pattern="[0-9:]*"
        @click:control="onFieldFocus"
        @blur="onFieldBlur">
        <template v-if="slots.label" #label>
            <slot name="label" />
        </template>
        <template #default>
            <ev-menu
                ref="evMenuRef"
                v-model="isMenuOpen"
                activator="parent"
                position="bottom-start"
                :open-on-click="false"
                :close-on-content-click="false"
                @after-leave="onMenuAfterLeave">
                <ev-surface elevation="overlay" class="ev-time-field--surface">
                    <ev-time-picker
                        ref="timePickerRef"
                        @focusin="onDatePickerFocusIn" />
                </ev-surface>
            </ev-menu>
        </template>
    </ev-textfield>
</template>
