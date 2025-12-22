<script setup lang="ts">
import "./EvTimeField.scss";
import { makeEvTimeFieldProps } from "./EvTimeField";
import { EvMenu } from "@/components/EvMenu";
import { EvTextfield } from "@/components/EvTextfield";
import { EvSurface } from "@/components/EvSurface";
import { EvTimePicker } from "@/components/EvTimePicker";
import { computed, ref, shallowRef, watch } from "vue";
import { filterComponentProps, omit } from "@/util";
import { FocusEvent, KeyboardEvent } from "react";
import { useModelProxy } from "@/composables";
import {
    displayTimeFromDate,
    inferTimeFormat,
    normalizeTimeToDate,
    serializeDateToTime,
} from "@/composables/time";

const props = defineProps({
    ...makeEvTimeFieldProps(),
});
const slots = defineSlots<{
    label(): never;
}>();

let inferredFormat = null;
const modelValue = useModelProxy(
    props,
    "modelValue",
    undefined,
    (value) => {
        inferredFormat = inferTimeFormat(value);
        const date = normalizeTimeToDate(value);
        if (!date) {
            return null;
        }
        date.setSeconds(0, 0);
        return date;
    },
    (value) => {
        return serializeDateToTime(value, inferredFormat ?? "time");
    },
);

const displayValue = ref("");
const pickerValue = ref(null);

watch(
    modelValue,
    (value) => {
        displayValue.value = displayTimeFromDate(value);
        pickerValue.value = modelValue.value;
    },
    { immediate: true },
);

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
        if (displayValue.value.length === 0) {
            if (inferredFormat === "time") {
                modelValue.value = null;
            } else {
                const date = modelValue.value;
                date.setHours(0, 0, 0, 0);
                modelValue.value = date;
                displayValue.value = "00:00";
            }
            return;
        }
        const parts = displayValue.value.split(":");
        const date = pickerValue.value ?? new Date();
        let minutes = Number(parts[1] ?? 0);
        if (minutes < 10) {
            minutes *= 10;
        }
        date.setHours(Number(parts[0]), minutes, 0, 0);
        modelValue.value = normalizeTimeToDate(date);
        displayValue.value = displayTimeFromDate(date);
    }
}

function onDatePickerFocusIn(e: FocusEvent) {
    isFocused.value = true;
}

function normalizeTimeInput(raw: string): string {
    let value = raw.replace(/[^\d:]/g, "");
    // Prevent more than one colon
    const parts = value.split(":");
    if (parts.length > 2) {
        value = parts[0] + ":" + parts.slice(1).join("");
    }
    const [hoursRaw, minutesRaw = ""] = value.split(":");
    // Auto insert colon after 2 digits IF user hasn't typed one
    if (!value.includes(":") && hoursRaw.length >= 2) {
        value = hoursRaw.slice(0, 2) + ":" + hoursRaw.slice(2);
    }
    const [h, m = ""] = value.split(":");
    // Pad single-digit hour when colon appears
    let hours = h;
    if (value.includes(":") && h.length === 1) {
        hours = "0" + h;
    }

    // Limit ranges (soft clamp while typing)
    if (hours.length === 2 && Number(hours) > 23) {
        hours = "23";
    }

    let minutes = m.slice(0, 2);
    if (minutes.length === 2 && Number(minutes) > 59) {
        minutes = "59";
    }

    return value.includes(":") ? `${hours}:${minutes}` : hours;
}

function onUpdatePickerValue(value) {
    modelValue.value = normalizeTimeToDate(value);
}

function onFieldKeydown(e: KeyboardEvent) {
    const passThrough = [
        "Backspace",
        "Delete",
        "Home",
        "End",
        "ArrowLeft",
        "ArrowRight",
        "Tab",
    ];
    if (passThrough.includes(e.key)) {
        return;
    }
    const isPaste = e.key === "v" && e.ctrlKey;
    const isSelectAll = e.key === "a" && e.ctrlKey;
    // Block anything not in the whitelist
    const whitelist = new RegExp("[0-9:]");
    if (!whitelist.test(e.key) && !isPaste && !isSelectAll) {
        e.preventDefault();
        return;
    }
    const raw = (e.target as HTMLInputElement).value;
    if (e.key === ":" && raw.includes(":")) {
        e.preventDefault();
        return;
    }
    if (raw.length - getSelectedLength(e.target as HTMLInputElement) >= 5) {
        e.preventDefault();
        return;
    }
}

/**
 * ## Get Selected Length
 * @param input
 */
function getSelectedLength(input: HTMLInputElement): number
{
    if (input.selectionStart == null || input.selectionEnd == null) {
        return 0;
    }
    return input.selectionEnd - input.selectionStart;
}

function onFieldInput(e: Event) {
    const raw = (e.target as HTMLInputElement).value;
    displayValue.value = normalizeTimeInput(raw);

    if (displayValue.value.length === 0) {
        if (inferredFormat === "time") {
            modelValue.value = null;
        } else {
            const date = modelValue.value;
            date.setHours(0, 0, 0, 0);
            modelValue.value = date;
        }
        return;
    }

    // Attempt to update picker if we have a value that is reasonable
    const parts = displayValue.value.split(":");
    const date = pickerValue.value ?? new Date();
    let minutes = Number(parts[1] ?? 0);
    if (minutes < 10) {
        minutes *= 10;
    }
    date.setHours(Number(parts[0]), minutes, 0, 0);
    pickerValue.value = normalizeTimeToDate(date);
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
        :model-value="displayValue"
        @click:control="onFieldFocus"
        @blur="onFieldBlur"
        @keydown="onFieldKeydown"
        @input="onFieldInput">
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
                        v-model="pickerValue"
                        @focusin="onDatePickerFocusIn"
                        @update:model-value="onUpdatePickerValue" />
                </ev-surface>
            </ev-menu>
        </template>
    </ev-textfield>
</template>
