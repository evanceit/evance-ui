<script setup lang="ts">
/**
 * `<ev-date-picker-months>`
 */
import './EvDatePickerMonths.scss';
import {makeEvDatePickerMonthsProps} from "./EvDatePickerMonths.ts";
import {useModelProxy} from "@/composables/modelProxy.ts";
import {computed, watchEffect} from "vue";
import {useDate} from "@/composables/date/date.ts";
import {createRange} from "@/util";
import EvButton from "@/components/EvButton/EvButton.vue";

const dateAdapter = useDate();
const props = defineProps(makeEvDatePickerMonthsProps());
const modelValue = useModelProxy(props, 'modelValue');
const emit = defineEmits([
  'update:modelValue'
]);

const months = computed(() => {
  let date = dateAdapter.startOfYear(dateAdapter.date());
  return createRange(12).map(i => {
    const text = dateAdapter.format(date, 'monthShort');
    date = dateAdapter.getNextMonth(date);
    return {
      text,
      value: i
    };
  });
});

const internalValue = computed(() => {
  return modelValue.value ?? dateAdapter.getMonth(dateAdapter.date());
});

function onClick(i: number) {
  modelValue.value = i;
}

function getAppearance(value) {
  return (value === internalValue.value) ? 'primary' : 'subtle';
}

</script>
<template>
  <div class="ev-date-picker-months">
    <ev-button
        v-for="(month, i) in months"
        :key="i"
        :text="month.text"
        :appearance="getAppearance(month.value)"
        @click="onClick(month.value)"
    />
  </div>
</template>