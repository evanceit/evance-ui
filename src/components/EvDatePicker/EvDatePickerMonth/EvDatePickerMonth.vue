<script setup lang="ts">
/**
 * # `<ev-date-picker-month>`
 */
import './EvDatePickerMonth.scss';
import {makeEvDatePickerMonthProps} from './EvDatePickerMonth';
import {useDate} from "@/composables/date/date";
import {useModelProxy} from "@/composables/modelProxy.ts";
import {wrapInArray} from "@/util";
import {computed, watch} from "vue";
import EvButton from "@/components/EvButton/EvButton.vue";

const props = defineProps(makeEvDatePickerMonthProps());
const dateAdapter = useDate();
const emit = defineEmits([
  'update:modelValue',
  'update:month',
  'update:year'
]);

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

const displayValue = computed(() => {
  if (modelValue.value.length > 0) {
    return dateAdapter.date(modelValue.value[0]);
  }
  if (props.min) {
    return dateAdapter.date(props.min);
  }
  if (Array.isArray(props.allowedDates)) {
    return dateAdapter.date(props.allowedDates[0]);
  }
  return dateAdapter.date();
});

// YEAR
const year = useModelProxy(
    props,
    'year',
    undefined,
    (v) => {
      const value = v != null ? Number(v) : dateAdapter.getYear(displayValue.value);
      return dateAdapter.startOfYear(dateAdapter.setYear(dateAdapter.date(), value));
    },
    (v) => dateAdapter.getYear(v)
);

// MONTH
const month = useModelProxy(
    props,
    'month',
    undefined,
    (v) => {
      const value = v != null ? Number(v) : dateAdapter.getMonth(displayValue.value);
      const date = dateAdapter.setYear(dateAdapter.date(), dateAdapter.getYear(year.value));
      return dateAdapter.setMonth(date, value);
    },
    (v) => dateAdapter.getMonth(v)
);

/**
 * ## Weeks in Month
 */
const weeksInMonth = computed(() => {
    const weeks = dateAdapter.getWeekArray(month.value);
    const days = weeks.flat();
    const daysInMonth = 6 * 7;
    if (days.length < daysInMonth) {
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
        const isInRange = (
            props.selectionMode === 'range'
            && (modelValue.value[0] && dateAdapter.isAfter(date, modelValue.value[0]))
            && (modelValue.value[1] && dateAdapter.isBefore(date, modelValue.value[1]))
        );
        const isRangeStart = (
            props.selectionMode === 'range'
            && modelValue.value[0]
            && dateAdapter.isSameDay(date, modelValue.value[0])
        );
        const isRangeEnd = (
            props.selectionMode === 'range'
            && modelValue.value[1]
            && dateAdapter.isSameDay(date, modelValue.value[1])
        );
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
            isInRange,
            isRangeStart,
            isRangeEnd,
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
  const date = dateAdapter.date(value);
  if (props.min && dateAdapter.isBefore(date, props.min)) {
    return true;
  }
  if (props.max && dateAdapter.isAfter(date, props.max)) {
    return true;
  }
  if (Array.isArray(props.allowedDates)) {
    return !props.allowedDates.some((allowedDate) => {
      return dateAdapter.isSameDay(dateAdapter.date(allowedDate), date);
    });
  }
  if (typeof props.allowedDates === 'function') {
    return !props.allowedDates(date);
  }
  return false;
}

/**
 * ## Get Appearance
 * @param day
 */
function getDayAppearance(day) {
    if (day.isSelected || day.isInRange) {
        return 'primary';
    }
    if (day.isToday) {
        return 'default';
    }
    return 'subtle';
}

/**
 * ## On Click Event
 * @param date
 */
function onClick(date: Date) {
    if (props.selectionMode === 'range') {
        let startDate = modelValue.value[0];
        let endDate = modelValue.value[1];
        if (startDate && !endDate && date.getTime() >= startDate.getTime()) {
            modelValue.value = [startDate, date];
        } else if (endDate && date.getTime() >= endDate.getTime()) {
            modelValue.value = [startDate, date];
        } else {
            modelValue.value = [date];
        }
    } else if (props.selectionMode === 'multiple') {
        const index = modelValue.value.findIndex((selection) => dateAdapter.isSameDay(selection, date));
        if (index === -1) {
            modelValue.value = [...modelValue.value, date];
        } else {
            const value = [...modelValue.value];
            value.splice(index, 1);
            modelValue.value = value;
        }
    } else {
        modelValue.value = [date];
    }
}

watch(displayValue, value => {
  month.value = value;
  year.value = value;
});

</script>
<template>
    <div :class="[
        'ev-date-picker-month',
        {
            'is-select-single': props.selectionMode === 'single',
            'is-select-multiple': props.selectionMode === 'multiple',
            'is-select-range': props.selectionMode === 'range'
        }
    ]">
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
                        'is-week-start': day.isWeekStart,
                        'is-range-start': day.isRangeStart,
                        'is-range-within': day.isInRange,
                        'is-range-end': day.isRangeEnd
                    }
                ]"
            >
                <ev-button
                    v-if="!day.isHidden"
                    rounded
                    :icon="true"
                    :disabled="day.isDisabled"
                    :appearance="getDayAppearance(day)"
                    :text="day.localized"
                    @click="onClick(day.date)"
                />
            </div>
        </div>
    </div>
</template>