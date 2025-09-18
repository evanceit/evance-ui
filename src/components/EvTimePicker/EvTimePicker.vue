<script setup lang="ts">
import "./EvTimePicker.scss";
import { shallowRef, watch } from "vue";
import { useDate, useModelProxy } from "@/composables";
import { EvButton } from "@/components/EvButton";
import { makeEvTimePickerProps } from "./EvTimePicker";
import { EvButtonToggle } from "@/components/EvButtonToggle";
import { EvTimePickerHours } from "./EvTimePickerHours";
import { EvTimePickerMinutes } from "./EvTimePickerMinutes";
import { ArrowBackIcon } from "@/icons";
import { EvLayout, EvBlock } from "@/components/EvGrid";
import {EvText} from "@/components";

const props = defineProps({
    ...makeEvTimePickerProps(),
});
defineEmits(["update:modelValue"]);
const dateAdapter = useDate();
const period = shallowRef("am");
const is24Hour = shallowRef(true);
const viewMode = shallowRef("hours");

const modelValue = useModelProxy(props, "modelValue", undefined);

watch(modelValue, (newValue, oldValue) => {
    console.log("modelValue", newValue, oldValue);
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

    <p>Model value: {{ modelValue }}</p>

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

            <ev-button-toggle
                v-model="period"
                mandatory
                size="small"
                selected-variant="bold">
                <ev-button value="am" text="AM" @click="onClickPeriod" />
                <ev-button value="pm" text="PM" @click="onClickPeriod" />
            </ev-button-toggle>
        </ev-layout>

        <ev-time-picker-hours
            v-if="viewMode === 'hours'"
            v-model="modelValue"
            :period="period"
            @click:hour="onClickHour" />

        <ev-time-picker-minutes
            v-else
            v-model="modelValue"
            @click:back="viewMode = 'hours'" />
    </div>
</template>
