<script setup lang="ts">
/**
 * `<ev-date-picker-years>`
 */
import './EvDatePickerYears.scss';
import EvList from "@/components/EvList/EvList.vue";
import {computed, nextTick, onMounted, ref} from "vue";
import {makeEvDatePickerYearsProps} from "./EvDatePickerYears.ts";
import {useModelProxy} from "@/composables/modelProxy.ts";
import {useDate} from "@/composables/date/date.ts";
import {wrapInArray} from "@/util";
import EvListItem from "@/components/EvListItem/EvListItem.vue";

const dateAdapter = useDate();
const props = defineProps(makeEvDatePickerYearsProps());
const emit = defineEmits([
    'update:modelValue'
]);

const modelValue = useModelProxy(
    props,
    'modelValue',
    undefined,
    (value) => wrapInArray(value),
    (value) => value[0] ?? null
);

const internalValue = computed(() => {
    return modelValue.value[0];
});

const offsetMin = -120;
const offsetMax = 50;
const currentYear = dateAdapter.getYear(dateAdapter.date());

const items = computed(() => {
    const minYear = (props.min) ? dateAdapter.getYear(props.min) : currentYear + offsetMin;
    const maxYear = (props.max) ? dateAdapter.getYear(props.max) : currentYear + offsetMax;

    const years = [];
    for (let year = minYear; year <= maxYear; year++) {
        const date = dateAdapter.setYear(dateAdapter.date(), year);
        years.push({
            title: dateAdapter.format(date, 'year'),
            value: year
        });
    }
    return years.reverse();
});

const listRef = ref();
function scrollIntoView() {
    const selectedEl = listRef.value?.$el.querySelector('.is-active');
    if (selectedEl) {
        // Now I need to get the selected item from the list
        // this is a bit of a hack because I can't seem to get dynamic ref working.
        selectedEl.scrollIntoView({
            block: 'center'
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
            required
            ref="listRef"
            select-strategy="single-any"
            v-model:selected="modelValue"
        >
                <ev-list-item
                    v-for="(item, i) in items"
                    :key="i"
                    :title="item.title"
                    :value="item.value"
                />
        </ev-list>
    </div>
</template>