<script setup lang="ts">
import "./EvTimePicker.scss";
import { computed, shallowRef } from "vue";
import { useDate, useLocaleManager, useModelProxy } from "@/composables";
import { makeEvTimePickerProps } from "./EvTimePicker";
import { EvTimePickerHours } from "./EvTimePickerHours";
import { EvTimePickerMinutes } from "./EvTimePickerMinutes";
import { EvButton } from "@/components/EvButton";
import { EvButtonSelect } from "@/components/EvButtonSelect";
import { EvNumber } from "@/components/EvNumber";
import { EvDivider } from "@/components/EvDivider";
import { EvHeading } from "@/components/EvHeading";
import {
    inferTimeFormat,
    normalizeTimeToDate,
    serializeDateToTime,
} from "@/composables/time";

const props = defineProps({
    ...makeEvTimePickerProps(),
});
defineEmits(["update:modelValue"]);
const locale = useLocaleManager();
const dateAdapter = useDate();
const period = shallowRef("am");
let inferredFormat = null;
const modelValue = useModelProxy(
    props,
    "modelValue",
    undefined,
    (value) => {
        inferredFormat = inferTimeFormat(value);
        const date = normalizeTimeToDate(value);
        if (!date) {
            return null;
        }
        date.setSeconds(0, 0);
        period.value = date.getHours() >= 12 ? "pm" : "am";
        return date;
    },
    (value) => {
        return serializeDateToTime(value, inferredFormat ?? "time");
    },
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

function onClickPeriod() {
    if (!modelValue.value) {
        return;
    }
    const value = dateAdapter.date(modelValue.value) as Date;
    const modifier = period.value === "am" ? -12 : 12;
    value.setHours(value.getHours() + modifier);
    modelValue.value = new Date(value);
}

const hours = computed(() => {
    return modelValue.value?.getHours() ?? 0;
});

const minutes = computed(() => {
    return modelValue.value?.getMinutes() ?? 0;
});

const numberFormat = {
    minimumIntegerDigits: 2,
    useGrouping: false,
};

</script>

<template>
    <div class="ev-time-picker">

        <div class="ev-time-picker--controls">
            <ev-heading size="x-large" tag="div" class="mb-0">
                <ev-number :value="hours" :format="numberFormat" />:<ev-number
                    :value="minutes"
                    :format="numberFormat" />
            </ev-heading>

            <ev-button-select
                v-model="period"
                mandatory
                rounded
                size="small"
                variant="subtle"
                selected-variant="bold">
                <ev-button value="am" text="AM" @click="onClickPeriod" />
                <ev-button value="pm" text="PM" @click="onClickPeriod" />
            </ev-button-select>
        </div>

        <ev-divider />

        <div class="ev-time-picker--options">
            <ev-time-picker-hours
                v-model="modelValue"
                :period="period"
                :hour-format="hourFormat" />

            <ev-divider vertical>:</ev-divider>

            <ev-time-picker-minutes
                v-model="modelValue"
                :hour-format="hourFormat" />
        </div>
    </div>
</template>
