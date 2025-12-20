<script setup lang="ts">
import "./EvTimePickerMinutes.scss";
import { makeEvTimePickerMinutesProps, Minutes } from "./EvTimePickerMinutes";
import { useDate, useLocaleFunctions, useModelProxy } from "@/composables";
import { computed } from "vue";
import { EvButton } from "@/components/EvButton";
import { EvEyebrow } from "@/components/EvEyebrow";

const props = defineProps({
    ...makeEvTimePickerMinutesProps(),
});

const emit = defineEmits(["update:modelValue"]);
const dateAdapter = useDate();
const modelValue = useModelProxy(props, "modelValue", undefined);
const { t } = useLocaleFunctions();

const displayMinutes = computed(() => {
    const value = modelValue.value
        ? (dateAdapter.date(modelValue.value) as Date)
        : undefined;

    return [0, 15, 30, 45].map((minute) => {
        const isSelected = value?.getMinutes() === minute;
        const minutes = String(minute).padStart(2, "0");
        const text = minutes;

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
        <ev-eyebrow tag="div" class="ev-time-picker--heading">
            {{ t("time.minutes.title") }}
        </ev-eyebrow>
        <ev-button
            v-for="minutes in displayMinutes"
            :key="minutes.value"
            class="ev-time-picker--minute"
            icon
            rounded
            :text="minutes.text"
            :appearance="getAppearance(minutes)"
            :variant="getVariant(minutes)"
            @click="onClickMinutes(minutes)" />
    </div>
</template>