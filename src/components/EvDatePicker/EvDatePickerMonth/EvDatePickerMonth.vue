<script setup lang="ts">
/**
 * # `<ev-date-picker-month>`
 */
import './EvDatePickerMonth.scss';
import {makeEvDatePickerMonthProps} from './EvDatePickerMonth';
import {useDate} from "@/composables/date/date";
import {useModelProxy} from "@/composables/modelProxy.ts";
import {wrapInArray} from "@/util";
import {computed, toRaw} from "vue";
import EvButton from "@/components/EvButton/EvButton.vue";

const props = defineProps(makeEvDatePickerMonthProps());
const dateAdapter = useDate();

/**
 * The `modelValue` is always provided from the parent component as an array
 * and leaves as an array if `multiple` is `true`.
 */
const modelValue = useModelProxy(
    props,
    'modelValue',
    [],
    (value) => wrapInArray(value)
);

/**
 * A shorthand to get the first value from the `modelValue` as a Date.
 */
const modelDate = computed(() => {
    const value = modelValue.value?.[0];
    return (value && dateAdapter.isValid(value)) ? value : dateAdapter.date();
});

// YEAR
const year = useModelProxy(
    props,
    'year',
    undefined,
    (value) => {
        let date = dateAdapter.date(modelDate.value);
        if (value != null) {
            date = dateAdapter.setYear(date, Number(value));
        }
        return dateAdapter.startOfYear(date);
    },
    (value) => dateAdapter.getYear(value)
);

// MONTH
const month = useModelProxy(
    props,
    'month',
    undefined,
    (value) => {
        let date = dateAdapter.date(modelDate.value);
        if (value != null) {
            date = dateAdapter.setMonth(date, Number(value));
        }
        return dateAdapter.setYear(date, dateAdapter.getYear(year.value));
    },
    (value) => dateAdapter.getMonth(value)
);

/**
 * ## Weeks in Month
 *
 * Ensures there's always 6 weeks in month (6 * 7 days)
 * when we're not hiding adjacent months (`showAdjacentMonths`)
 */
const weeksInMonth = computed(() => {
    const weeks = dateAdapter.getWeekArray(month.value);
    const days = weeks.flat();
    const daysInMonth = 6 * 7;
    if (days.length < daysInMonth && props.showAdjacentMonths) {
        const lastDay = days[days.length - 1];
        let week = [];
        for (let day = 1; day <= (daysInMonth - days.length); day++) {
            week.push(dateAdapter.addDays(lastDay, day));
            if (day % 7 === 0) {
                weeks.push(week);
                week = [];
            }
        }
    }
    return weeks;
});

/**
 * ## Days in Month
 */
const daysInMonth = computed(() => {
    const days = weeksInMonth.value.flat();
    const today = dateAdapter.date();
    return days.map((date, index) => {
        const isoDate = dateAdapter.toISO(date);
        const isAdjacent = !dateAdapter.isSameMonth(date, month.value);
        return {
            date,
            isoDate,
            formatted: dateAdapter.format(date, 'keyboardDate'),
            year: dateAdapter.getYear(date),
            month: dateAdapter.getMonth(date),
            isDisabled: isDisabled(date),
            isWeekStart: index % 7 === 0,
            isWeekEnd: index % 7 === 6,
            isSelected: modelValue.value.some(value => dateAdapter.isSameDay(date, value)),
            isToday: dateAdapter.isSameDay(date, today),
            isAdjacent,
            isHidden: isAdjacent && !props.showAdjacentMonths,
            isHovered: false,
            localized: dateAdapter.format(date, 'dayOfMonth'),
        };
    });
});


/**
 * ## isDisabled
 */
function isDisabled(value: unknown) {
    // @todo: this needs completing
    return false;
}

function getDayAppearance(day) {
    if (day.isToday) {
        return 'default';
    }
    return 'subtle';
}

</script>
<template>
    <div class="ev-date-picker-month">
        <div class="ev-date-picker-month--days">
            <div
                v-for="weekDay in dateAdapter.getWeekdays()"
                class="ev-date-picker-month--weekday"
            >
                {{ weekDay }}
            </div>

            <div
                v-for="day in daysInMonth"
                :class="[
                    'ev-date-picker-month--day',
                    {
                        'is-adjacent': day.isAdjacent,
                        'is-adjacent-hidden': day.isHidden,
                        'is-selected': day.isSelected,
                        'is-week-end': day.isWeekEnd,
                        'is-week-start': day.isWeekStart
                    }
                ]"
            >
                <ev-button
                    v-if="!day.isHidden"
                    rounded
                    :icon="true"
                    :appearance="getDayAppearance(day)"
                >{{ day.localized }}</ev-button>
            </div>
        </div>
    </div>
</template>