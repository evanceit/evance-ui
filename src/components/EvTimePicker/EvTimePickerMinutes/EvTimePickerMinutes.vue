<script setup lang="ts">
import "./EvTimePickerMinutes.scss";
import { makeEvTimePickerMinutesProps, Minutes } from "./EvTimePickerMinutes";
import { useDate, useModelProxy } from "@/composables";
import { computed } from "vue";
import { EvButton } from "@/components/EvButton";

const props = defineProps({
    ...makeEvTimePickerMinutesProps(),
});

const emit = defineEmits(["update:modelValue"]);
const dateAdapter = useDate();
const modelValue = useModelProxy(props, "modelValue", undefined);

const displayMinutes = computed(() => {
    const is24Hour = props.hourFormat === 24;
    const value = modelValue.value
        ? (dateAdapter.date(modelValue.value) as Date)
        : undefined;
    const hours = value
        ? String(
              is24Hour ? value.getHours() : value.getHours() % 12 || 12,
          ).padStart(2, "0")
        : undefined;

    return [0, 15, 30, 45].map((minute) => {
        const isSelected = value?.getMinutes() === minute;
        const minutes = String(minute).padStart(2, "0");
        const text = hours ? `${hours}:${minutes}` : minutes;

        return {
            value: String(minute).padStart(2, "0"),
            text,
            isDisabled: false, // @todo
            isSelected,
        } as Minutes;
    });
});

function getAppearance(minutes: Minutes) {
    return minutes.isSelected ? "primary" : "default";
}

function getVariant(minutes: Minutes) {
    return minutes.isSelected ? "bold" : "subtle";
}

function onClickMinutes(minutes: Minutes) {
    const hasModelValue = !!modelValue.value;
    const value = dateAdapter.date(modelValue.value) as Date;
    if (!hasModelValue) {
        value.setHours(0, 0, 0, 0);
    }
    value.setMinutes(Number(minutes.value));
    modelValue.value = new Date(value);
}

</script>

<template>
    <div class="ev-time-picker--minutes">
        <ev-button
            v-for="minutes in displayMinutes"
            :key="minutes.value"
            class="ev-time-picker--minute"
            :text="minutes.text"
            :appearance="getAppearance(minutes)"
            :variant="getVariant(minutes)"
            @click="onClickMinutes(minutes)" />
    </div>
</template>