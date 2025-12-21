<script setup lang="ts">
/**
 * `<ev-date-field>`
 */
import "./EvDateField.scss";
import { makeEvDateFieldProps } from "./EvDateField";
import { EvTextfield } from "@/components/EvTextfield";
import { EvMenu } from "@/components/EvMenu";
import { EvDatePicker } from "@/components/EvDatePicker";
import { EvSurface } from "@/components/EvSurface";
import { computed, ref, shallowRef, watch } from "vue";
import { FocusEvent } from "react";
import { useModelProxy } from "@/composables/modelProxy";
import { filterComponentProps, omit, wrapInArray } from "@/util";
import { useDate } from "@/composables/date/date";

const dateAdapter = useDate();
const props = defineProps({
    ...makeEvDateFieldProps(),
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

// Date Picker
const datePickerRef = ref<typeof EvDatePicker>();
const datePickerProps = computed(() => {
    return omit(filterComponentProps(EvDatePicker, props), ["modelValue"]);
});

// Menu
const isMenuOpen = shallowRef(false);
const modelValue = useModelProxy(
    props,
    "modelValue",
    undefined,
    (value) => wrapInArray(value),
    (value: any) => {
        return value[0] ?? null;
    },
);
const displayValue = shallowRef<string | null>(null);

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

/**
 * ## On Field Blur
 * @param e
 */
function onFieldBlur(e: FocusEvent) {
    if (!datePickerRef.value?.$el.contains(e.relatedTarget as HTMLElement)) {
        isMenuOpen.value = false;
    }
}

/**
 * ## On Date Picker Focus In
 * Maintain focus on the field when actions within the date picker occur.
 * @param e
 */
function onDatePickerFocusIn(e: FocusEvent) {
    isFocused.value = true;
}

function onUpdateModelValue() {
    isMenuOpen.value = false;
}

function onClearInput() {
    setModelValue(null);
}

function setModelValue(value: any) {
    modelValue.value = wrapInArray(value);
}

function onInput(e: Event) {
    if (!displayValue.value?.length) {
        setModelValue(null);
        return;
    }
    const date = dateAdapter.date(displayValue.value);
    if (
        date &&
        dateAdapter.isValid(date) &&
        dateAdapter.getYear(date).toString().length === 4 &&
        dateAdapter.format(date, "displayDate") === displayValue.value
    ) {
        setModelValue(date);
    }
}

watch(modelValue, () => {
    const date = modelValue.value[0] ?? null;
    if (!date || !dateAdapter.isValid(date)) {
        displayValue.value = null;
    } else {
        displayValue.value = dateAdapter.format(
            modelValue.value[0],
            "displayDate",
        );
    }
});
</script>

<template>
    <ev-textfield
        ref="evTextfieldRef"
        v-bind="evTextfieldProps"
        v-model="displayValue"
        v-model:focused="isFocused"
        class="ev-date-field"
        :validation-value="modelValue"
        @click:control="onFieldFocus"
        @blur="onFieldBlur"
        @click:clear="onClearInput"
        @input="onInput">
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
                <ev-surface elevation="overlay" class="ev-date-field--surface">
                    <ev-date-picker
                        ref="datePickerRef"
                        v-bind="datePickerProps"
                        v-model="modelValue"
                        @focusin="onDatePickerFocusIn"
                        @update:model-value="onUpdateModelValue()" />
                </ev-surface>
            </ev-menu>
        </template>
    </ev-textfield>
</template>
