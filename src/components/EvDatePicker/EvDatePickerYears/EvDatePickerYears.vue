<script setup lang="ts">
/**
 * `<ev-date-picker-years>`
 */
import "./EvDatePickerYears.scss";
import { makeEvDatePickerYearsProps } from "./EvDatePickerYears";
import { EvList } from "@/components/EvList";
import { EvListItem } from "@/components/EvListItem";
import { computed, nextTick, onMounted, ref } from "vue";
import { useModelProxy } from "@/composables/modelProxy";
import { useDate } from "@/composables/date/date";
import { wrapInArray } from "@/util";

const dateAdapter = useDate();
const props = defineProps({
    ...makeEvDatePickerYearsProps(),
});
defineEmits(["update:modelValue"]);

const modelValue = useModelProxy(
    props,
    "modelValue",
    undefined,
    (value) => wrapInArray(value),
    (value) => value[0] ?? null,
);

const offsetMin = -120;
const offsetMax = 50;
const currentYear = dateAdapter.getYear(dateAdapter.date());

const items = computed(() => {
    const minYear = props.min
        ? dateAdapter.getYear(props.min)
        : currentYear + offsetMin;
    const maxYear = props.max
        ? dateAdapter.getYear(props.max)
        : currentYear + offsetMax;

    const years = [];
    for (let year = minYear; year <= maxYear; year++) {
        const date = dateAdapter.setYear(dateAdapter.date(), year);
        years.push({
            title: dateAdapter.format(date, "year"),
            value: year,
        });
    }
    return years.reverse();
});

const listRef = ref();
function scrollIntoView() {
    const selectedEl = listRef.value?.$el.querySelector(".is-active");
    if (selectedEl) {
        // Now I need to get the selected item from the list
        // this is a bit of a hack because I can't seem to get dynamic ref working.
        selectedEl.scrollIntoView({
            block: "center",
        });
    }
}

onMounted(async () => {
    await nextTick();
    scrollIntoView();
});
</script>

<template>
    <div class="ev-date-picker-years">
        <ev-list
            ref="listRef"
            v-model:selected="modelValue"
            required
            select-strategy="single-any">
            <ev-list-item
                v-for="(item, i) in items"
                :key="i"
                :title="item.title"
                :value="item.value" />
        </ev-list>
    </div>
</template>
