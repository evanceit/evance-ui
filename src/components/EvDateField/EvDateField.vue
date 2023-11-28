<script setup lang="ts">
/**
 * `<ev-date-field>`
 */
import './EvDateField.scss';
import EvTextfield from "@/components/EvTextfield/EvTextfield.vue";
import {Calendar} from "@/icons";
import EvMenu from "@/components/EvMenu/EvMenu.vue";
import EvDatePicker from "@/components/EvDatePicker/EvDatePicker.vue";
import {computed, ref, shallowRef} from "vue";
import EvSurface from "@/components/EvSurface/EvSurface.vue";
import {FocusEvent} from "react";
import {makeEvDateFieldProps} from "@/components/EvDateField/EvDateField.ts";
import {useModelProxy} from "@/composables/modelProxy.ts";
import {filterComponentProps, omit, wrapInArray} from "@/util";
import {useDate} from "@/composables/date/date.ts";

const dateAdapter = useDate();
const props = defineProps(makeEvDateFieldProps());

// Text Field
const evMenuRef = ref<EvMenu>();
const evTextfieldRef = ref<EvTextfield>();
const evTextfieldProps = computed(() => {
    return omit(filterComponentProps(EvTextfield, props), ['modelValue']);
});
const isFocused = shallowRef(false);

// Date Picker
const datePickerRef = ref<EvDatePicker>();
const datePickerProps = computed(() => {
    return omit(filterComponentProps(EvDatePicker, props), ['modelValue']);
});

// Menu
const isMenuOpen = shallowRef(false);
const modelValue = useModelProxy(
    props,
    'modelValue',
    undefined,
    (value) => wrapInArray(value),
    (value) => {
        return value[0] ?? null;
    }
);

/**
 * ## On Menu After Leave
 * Maintain focus on the EvSelect when leaving the menu - usually when tabbing out.
 */
function onMenuAfterLeave(e: Event) {
    if (isFocused.value) {
        evTextfieldRef.value?.focus();
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
function onDatePickerFocusIn(e:FocusEvent) {
    isFocused.value = true;
}

function onUpdateModelValue() {
    isMenuOpen.value = false;
}

const displayDate = computed(() => {
    const date = modelValue.value[0] ?? null;
    if (!date || !dateAdapter.isValid(date)) {
        return '';
    }
    return dateAdapter.format(modelValue.value[0], 'displayDate');
});

</script>
<template>

    {{ displayDate }}

    <ev-textfield
        ref="evTextfieldRef"
        class="ev-date-field"
        v-bind="evTextfieldProps"
        :icon-start="Calendar"
        v-model:focused="isFocused"
        @click:control="onFieldFocus"
        @blur="onFieldBlur"
    >
        <ev-menu
            ref="evMenuRef"
            activator="parent"
            position="bottom-start"
            :openOnClick="false"
            :closeOnContentClick="false"
            v-model="isMenuOpen"
            @after-leave="onMenuAfterLeave"
        >
            <ev-surface elevation="overlay">
                <ev-date-picker
                    ref="datePickerRef"
                    v-bind="datePickerProps"
                    v-model="modelValue"
                    @focusin="onDatePickerFocusIn"
                    @update:modelValue="onUpdateModelValue()"
                />
            </ev-surface>
        </ev-menu>
    </ev-textfield>


</template>