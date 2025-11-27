<script setup lang="ts">
import "./EvTimePicker.scss";
import { computed, shallowRef } from "vue";
import { useDate, useLocaleManager, useModelProxy } from "@/composables";
import { EvButton } from "@/components/EvButton";
import { makeEvTimePickerProps } from "./EvTimePicker";
import { EvSelectButton } from "@/components/EvSelectButton";
import { EvTimePickerHours } from "./EvTimePickerHours";
import { EvTimePickerMinutes } from "./EvTimePickerMinutes";
import { ArrowBackIcon } from "@/icons";
import { EvLayout, EvBlock } from "@/components/EvGrid";
import { EvText } from "@/components/EvText";

const props = defineProps({
    ...makeEvTimePickerProps(),
});
defineEmits(["update:modelValue"]);
const locale = useLocaleManager();
const dateAdapter = useDate();
const period = shallowRef("am");
const viewMode = shallowRef("hours");
const modelValue = useModelProxy(props, "modelValue", undefined, (value) => {
    console.log(dateAdapter.date(value));
    return dateAdapter.date(value);
}

);
const hourFormat = computed<12 | 24>(() => {
    if (props.hourFormat) {
        return props.hourFormat;
    }
    const formatter = new Intl.DateTimeFormat(locale.currentLocale.value, {
        hour: "numeric",
    });
    const options = formatter.resolvedOptions();
    return ["h11", "h12"].includes(options.hourCycle) ? 12 : 24;
});

function onClickHour() {
    viewMode.value = "minutes";
}

function onClickPeriod() {
    if (!modelValue.value) {
        return;
    }
    const value = dateAdapter.date(modelValue.value) as Date;
    const modifier = period.value === "am" ? -12 : 12;
    value.setHours(value.getHours() + modifier);
    modelValue.value = new Date(value);
}

</script>

<template>
    <div class="ev-time-picker">

        <ev-layout align="center" class="mb-200" gap="100">
            <ev-button
                v-if="viewMode === 'minutes'"
                :icon="ArrowBackIcon"
                variant="subtle"
                size="small"
                @click="viewMode = 'hours'" />

            <ev-block>
                <ev-text v-if="viewMode === 'hours'" weight="semibold">Select hour</ev-text>
                <ev-text v-else weight="semibold">Select time</ev-text>
            </ev-block>

            <ev-select-button
                v-model="period"
                mandatory
                size="small"
                selected-variant="bold">
                <ev-button value="am" text="AM" @click="onClickPeriod" />
                <ev-button value="pm" text="PM" @click="onClickPeriod" />
            </ev-select-button>
        </ev-layout>

        <ev-time-picker-hours
            v-if="viewMode === 'hours'"
            v-model="modelValue"
            :period="period"
            :hour-format="hourFormat"
            @click:hour="onClickHour" />

        <ev-time-picker-minutes
            v-else
            v-model="modelValue"
            :hour-format="hourFormat"
            @click:back="viewMode = 'hours'" />
    </div>
</template>
