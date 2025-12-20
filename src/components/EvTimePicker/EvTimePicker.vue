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
        inferredFormat = inferFormat(value);
        const date = normalizeToDate(value);
        if (!date) {
            return null;
        }
        date.setSeconds(0, 0);
        period.value = date.getHours() >= 12 ? "pm" : "am";
        return date;
    },
    (value) => {
        return serializeDate(value, inferredFormat ?? "time");
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

function inferFormat(value: unknown) {
    if (value instanceof Date) {
        return "date";
    }
    if (typeof value === "string") {
        if (/^\d{2}:\d{2}$/.test(value)) {
            return "time";
        }
        if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(value)) {
            return "datetime";
        }
    }
    return "time";
}

function normalizeToDate(value: unknown) {
    if (!value) {
        return null;
    }
    if (value instanceof Date && !isNaN(value.getTime())) {
        return new Date(value);
    }
    if (typeof value === "string") {
        // HH:mm
        if (/^\d{2}:\d{2}$/.test(value)) {
            const [h, m] = value.split(":").map(Number);
            const d = new Date();
            d.setHours(h, m, 0, 0);
            return d;
        }
        // Y-m-d H:i:s
        if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(value)) {
            const d = new Date(value.replace(" ", "T"));
            return isNaN(d.getTime()) ? null : d;
        }
        // fallback (ISO, etc.)
        const parsed = new Date(value);
        return isNaN(parsed.getTime()) ? null : parsed;
    }
    return null;
}

function serializeDate(
    date: Date,
    format: "time" | "date" | "datetime",
): Date | string | null {
    if (!date) {
        return null;
    }
    const d = new Date(date);
    d.setSeconds(0, 0);

    if (format === "date") {
        return d;
    }
    if (format === "time") {
        return d.toTimeString().slice(0, 5); // HH:mm
    }
    if (format === "datetime") {
        const pad = (n: number) => String(n).padStart(2, "0");
        const year = d.getFullYear();
        const month = pad(d.getMonth() + 1);
        const day = pad(d.getDate());
        const hour = pad(d.getHours());
        const minutes = pad(d.getMinutes());
        return `${year}-${month}-${day} ${hour}:${minutes}:00`;
    }
    return null;
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
