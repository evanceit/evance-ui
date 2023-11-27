<script setup lang="ts">
/**
 * # Ev Date Picker
 * `<ev-date-picker>`
 */
import './EvDatePicker.scss';
import {useDate} from "@/composables/date/date.ts";
import {computed, ref, shallowRef, watch, watchEffect} from "vue";
import {makeEvDatePickerProps} from "./EvDatePicker.ts";
import {useModelProxy} from "@/composables/modelProxy.ts";
import {filterComponentProps, omit, wrapInArray} from "@/util";
import EvDatePickerMonth from "./EvDatePickerMonth/EvDatePickerMonth.vue";
import EvDatePickerYears from "./EvDatePickerYears/EvDatePickerYears.vue";
import EvButton from "@/components/EvButton/EvButton.vue";
import EvSpacer from "@/components/EvGrid/EvSpacer.vue";
import {ChevronLeft, ChevronRight} from "@/icons";

const props = defineProps(makeEvDatePickerProps());
const dateAdapter = useDate();
const isReversing = shallowRef(false);

// Emit
const emit = defineEmits([
    'update:modelValue',
    'update:month',
    'update:year'
]);

const modelValue = useModelProxy(
    props,
    'modelValue',
    undefined,
    (value) => wrapInArray(value),
    (value) => props.multiple ? value : value[0]
);

const internalValue = ref(modelValue.value);
watchEffect(() => {
    internalValue.value = modelValue.value;
});

watch(internalValue, (newValue, oldValue) => {
    const before = dateAdapter.date(wrapInArray(newValue)[0]);
    const after = dateAdapter.date(wrapInArray(oldValue)[0]);
    isReversing.value = dateAdapter.isBefore(before, after);
    modelValue.value = newValue;
});

const modelDate = computed(() => {
    const value = dateAdapter.date(internalValue.value?.[0]);
    return (value && dateAdapter.isValid(value)) ? value : dateAdapter.date();
});

const viewMode = useModelProxy(props, 'viewMode');

/**
 * Month related definitions
 */
const month = ref(Number(props.month ?? dateAdapter.getMonth(dateAdapter.startOfMonth(modelDate.value))));

const monthProps = computed(() => filterComponentProps(EvDatePickerMonth, props));

const monthText = computed(() => {
    return dateAdapter.format(
        dateAdapter.setMonth(dateAdapter.date(), month.value),
        'month'
    );
});

watch(month, () => {
    if (viewMode.value === 'months') {
        toggleViewMonth();
    }
});


/**
 * Year related definitions
 */
const year = ref(Number(props.year ?? dateAdapter.getYear(dateAdapter.startOfYear(dateAdapter.setMonth(modelDate.value, month.value)))));

const yearProps = computed(() => omit(filterComponentProps(EvDatePickerYears, props), ['modelValue']));

const yearText = computed(() => {
    return dateAdapter.format(
        dateAdapter.setYear(dateAdapter.date(), year.value),
        'year'
    );
});

watch(year, () => {
    if (viewMode.value === 'years') {
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
        emit('update:month', month.value);
    } else {
        year.value++;
        month.value = 0;
        emit('update:year', year.value);
    }
}

/**
 * ## Previous Month
 */
function onClickPrevious() {
    if (month.value > 0) {
        month.value--;
        emit('update:month', month.value);
    } else {
        year.value--;
        month.value = 11;
        emit('update:year', month.value);
    }
}

/**
 * Toggle View Mode between Months and Month
 */
function toggleViewMonth() {
    viewMode.value = viewMode.value === 'months' ? 'month' : 'months';
}

/**
 * Toggle View Mode between Years and Month
 */
function toggleViewYear() {
    viewMode.value = (viewMode.value === 'years') ? 'month' : 'years';
}

</script>
<template>

    {{ viewMode }}<br />

    <div class="ev-date-picker">

        <div class="ev-date-picker-controls">
            <ev-button
                appearance="subtle"
                :text="monthText"
                @click="toggleViewMonth()"
            />

            <ev-button
                appearance="subtle"
                :text="yearText"
                @click="toggleViewYear()"
            />

            <ev-spacer />

            <ev-button
                rounded
                appearance="subtle"
                :icon="ChevronLeft"
                @click="onClickPrevious()"
            />

            <ev-button
                rounded
                appearance="subtle"
                :icon="ChevronRight"
                @click="onClickNext()"
            />
        </div>

        <ev-date-picker-years
            v-if="viewMode === 'years'"
            v-bind="yearProps"
            v-model="year"
            :min="minDate"
            :max="maxDate"
        />

        <ev-date-picker-month
            v-else
            v-bind="monthProps"
            v-model="internalValue"
            v-model:month="month"
            v-model:year="year"
            :min="minDate"
            :max="maxDate"
        />


    </div>
</template>