<script setup lang="ts">
import "./EvTimePickerHours.scss";
import { computed } from "vue";
import { useDate, useLocaleFunctions, useModelProxy } from "@/composables";
import { EvButton } from "@/components/EvButton";
import { Hour, makeEvTimePickerHoursProps } from "./EvTimePickerHours";
import { EvEyebrow } from "@/components/EvEyebrow";

const props = defineProps({
    ...makeEvTimePickerHoursProps(),
});
const emit = defineEmits(["update:modelValue", "click:hour"]);
const dateAdapter = useDate();
const modelValue = useModelProxy(props, "modelValue", undefined);
const { t } = useLocaleFunctions();

const hoursInDay = computed(() => {
    const is24Hour = props.hourFormat === 24;
    const value = modelValue.value
        ? (dateAdapter.date(modelValue.value) as Date)
        : undefined;

    // Display order
    const displayHours = Array.from(
        { length: 12 },
        (_, i) => i + (is24Hour ? 0 : 1),
    );

    return displayHours.map((displayHour) => {
        // Compute canonical 24h value
        const value24 = is24Hour
            ? ((props.period === "pm" ? 12 : 0) + displayHour) % 24
            : (displayHour % 12) + (props.period === "pm" ? 12 : 0);

        // Display text depends on 24-hour setting,
        // but the order remains sequential for 12h
        const text = is24Hour
            ? String(value24).padStart(2, "0")
            : String(displayHour);
        const isSelected = value?.getHours() === value24;

        return {
            value: String(value24).padStart(2, "0"),
            text: text,
            isDisabled: false, // @todo
            isSelected,
        } as Hour;
    });
});

function getAppearance(hour: Hour) {
    return hour.isSelected ? "primary" : "default";
}

function getVariant(hour: Hour) {
    return hour.isSelected ? "bold" : "subtle";
}

function onClickHour(hour: Hour) {
    const hasModelValue = !!modelValue.value;
    const value = dateAdapter.date(modelValue.value) as Date;
    if (!hasModelValue) {
        value.setHours(0, 0, 0, 0);
    }
    value.setHours(Number(hour.value));
    modelValue.value = new Date(value);
    emit("click:hour", hour);
}

</script>

<template>
    <div class="ev-time-picker--hours">
        <ev-eyebrow tag="div" class="ev-time-picker--heading">
            {{ t("time.hours.title") }}
        </ev-eyebrow>
        <ev-button
            v-for="hour in hoursInDay"
            :key="String(hour.value)"
            class="ev-time-picker--hour"
            icon
            rounded
            :text="hour.text"
            :appearance="getAppearance(hour)"
            :variant="getVariant(hour)"
            @click="onClickHour(hour)" />
    </div>
</template>
