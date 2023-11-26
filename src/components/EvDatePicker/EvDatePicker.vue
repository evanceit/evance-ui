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
import {filterComponentProps, wrapInArray} from "@/util";
import EvDatePickerMonth from "./EvDatePickerMonth/EvDatePickerMonth.vue";
import EvButton from "@/components/EvButton/EvButton.vue";
import {ChevronLeft, ChevronRight} from "@/icons";

const props = defineProps(makeEvDatePickerProps());
const dateAdapter = useDate();

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

const modelDate = computed(() => {
    const value = dateAdapter.date(internalValue.value?.[0]);
    return (value && dateAdapter.isValid(value)) ? value : dateAdapter.date();
});

const month = ref(Number(props.month ?? dateAdapter.getMonth(dateAdapter.startOfMonth(modelDate.value))));
const year = ref(Number(props.year ?? dateAdapter.getYear(dateAdapter.startOfYear(dateAdapter.setMonth(modelDate.value, month.value)))));

const isReversing = shallowRef(false);

watch(internalValue, (newValue, oldValue) => {
    const before = dateAdapter.date(wrapInArray(newValue)[0]);
    const after = dateAdapter.date(wrapInArray(oldValue)[0]);
    isReversing.value = dateAdapter.isBefore(before, after);
    modelValue.value = newValue;
});


// Sort out the props for each subcomponent
const monthProps = computed(() => filterComponentProps(EvDatePickerMonth, props));

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

const monthText = computed(() => {
    return dateAdapter.format(
        dateAdapter.setMonth(dateAdapter.date(), month.value),
        'month'
    );
});

const yearText = computed(() => {
    return dateAdapter.format(
        dateAdapter.setYear(dateAdapter.date(), year.value),
        'year'
    );
});

</script>
<template>
    <div class="ev-date-picker">

        <div class="ev-date-picker-controls">
            <ev-button
                appearance="subtle"
            >{{ monthText }}</ev-button>

            <ev-button
                appearance="subtle"
            >{{ yearText }}</ev-button>

            <ev-button
                rounded
                appearance="subtle"
                :icon-start="ChevronLeft"
                @click="onClickPrevious()"
            />

            <ev-button
                rounded
                appearance="subtle"
                :icon-start="ChevronRight"
                @click="onClickNext()"
            />
        </div>

        <ev-date-picker-month
            v-bind="monthProps"
            v-model="internalValue"
            v-model:month="month"
            v-model:year="year"
        />
    </div>
</template>