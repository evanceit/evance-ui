<script setup lang="ts">
/**
 * # Ev Date Picker
 * `<ev-date-picker>`
 */
import "./EvDatePicker.scss";
import { makeEvDatePickerProps } from "./EvDatePicker.ts";
import { useDate } from "@/composables/date/date.ts";
import { computed, ref, shallowRef, watch } from "vue";
import { useModelProxy } from "@/composables/modelProxy.ts";
import { filterComponentProps, omit, wrapInArray } from "@/util";
import { EvDatePickerMonth } from "./EvDatePickerMonth";
import { EvDatePickerMonths } from "./EvDatePickerMonths";
import { EvDatePickerYears } from "./EvDatePickerYears";
import { EvButton } from "@/components/EvButton";
import { EvSpacer } from "@/components/EvGrid";
import { ChevronLeftIcon, ChevronRightIcon } from "@/icons";

const props = defineProps({
    ...makeEvDatePickerProps(),
});
const dateAdapter = useDate();
const isReversing = shallowRef(false);

// Emit
const emit = defineEmits([
    "update:modelValue",
    "update:month",
    "update:year",
    "update:viewMode",
]);

const modelValue = useModelProxy(props, "modelValue", undefined, (value) =>
    wrapInArray(value),
);

const internalValue = computed(() => {
    const value = dateAdapter.date(modelValue.value?.[0]);
    return value && dateAdapter.isValid(value) ? value : dateAdapter.date();
});

watch(modelValue, (newValue, oldValue) => {
    const before = dateAdapter.date(wrapInArray(newValue)[0]);
    const after = dateAdapter.date(wrapInArray(oldValue)[0]);
    isReversing.value = dateAdapter.isBefore(before, after);
});

const viewMode = useModelProxy(props, "viewMode");

/**
 * Month related definitions
 */
const month = ref(
    Number(
        props.month ??
            dateAdapter.getMonth(dateAdapter.startOfMonth(internalValue.value)),
    ),
);

const monthProps = computed(() =>
    filterComponentProps(EvDatePickerMonth, props),
);

const monthText = computed(() => {
    const date = dateAdapter.startOfMonth(dateAdapter.date());
    return dateAdapter.format(dateAdapter.setMonth(date, month.value), "month");
});

watch(month, () => {
    if (viewMode.value === "months") {
        toggleViewMonth();
    }
});

/**
 * Year related definitions
 */
const year = ref(
    Number(
        props.year ??
            dateAdapter.getYear(
                dateAdapter.startOfYear(
                    dateAdapter.setMonth(internalValue.value, month.value),
                ),
            ),
    ),
);

const yearProps = computed(() =>
    omit(filterComponentProps(EvDatePickerYears, props), ["modelValue"]),
);

const yearText = computed(() => {
    return dateAdapter.format(
        dateAdapter.setYear(dateAdapter.date(), year.value),
        "year",
    );
});

watch(year, () => {
    if (viewMode.value === "years") {
        toggleViewYear();
    }
});

/**
 * Min & Max date definitions
 */
const minDate = computed(() => {
    const date = dateAdapter.date(props.min);
    return props.min && dateAdapter.isValid(date) ? date : null;
});

const maxDate = computed(() => {
    const date = dateAdapter.date(props.max);
    return props.max && dateAdapter.isValid(date) ? date : null;
});

/**
 * ## Next Month
 */
function onClickNext() {
    if (month.value < 11) {
        month.value++;
    } else {
        year.value++;
        month.value = 0;
        emit("update:year", year.value);
    }
    emit("update:month", month.value);
}

/**
 * ## Previous Month
 */
function onClickPrevious() {
    if (month.value > 0) {
        month.value--;
    } else {
        year.value--;
        month.value = 11;
        emit("update:year", year.value);
    }
    emit("update:month", month.value);
}

/**
 * Toggle View Mode between Months and Month
 */
function toggleViewMonth() {
    viewMode.value = viewMode.value === "months" ? "month" : "months";
}

/**
 * Toggle View Mode between Years and Month
 */
function toggleViewYear() {
    viewMode.value = viewMode.value === "years" ? "month" : "years";
}
</script>

<template>
    <div class="ev-date-picker">
        <div class="ev-date-picker-controls">
            <ev-button
                variant="subtle"
                :text="monthText"
                @click="toggleViewMonth()" />

            <ev-button
                variant="subtle"
                :text="yearText"
                @click="toggleViewYear()" />

            <ev-spacer />

            <div class="ev-date-picker-controls--previous">
                <ev-button
                    rounded
                    variant="subtle"
                    :disabled="viewMode !== 'month'"
                    :icon="ChevronLeftIcon"
                    @click="onClickPrevious()" />
            </div>

            <div class="ev-date-picker-controls--next">
                <ev-button
                    rounded
                    variant="subtle"
                    :disabled="viewMode !== 'month'"
                    :icon="ChevronRightIcon"
                    @click="onClickNext()" />
            </div>
        </div>

        <ev-date-picker-years
            v-if="viewMode === 'years'"
            v-bind="yearProps"
            v-model="year"
            :min="minDate"
            :max="maxDate" />

        <ev-date-picker-months
            v-else-if="viewMode === 'months'"
            v-model="month" />

        <ev-date-picker-month
            v-else
            v-bind="monthProps"
            v-model="modelValue"
            v-model:month="month"
            v-model:year="year"
            :min="minDate"
            :max="maxDate" />
    </div>
</template>
