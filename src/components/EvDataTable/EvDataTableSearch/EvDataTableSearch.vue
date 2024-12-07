<script setup lang="ts">
import "./EvDataTableSearch.scss";
import { makeEvDataTableSearchProps } from "./EvDataTableSearch.ts";
import { EvButton } from "@/components/EvButton";
import { EvCheckbox } from "@/components/EvCheckbox";
import { EvDivider } from "@/components/EvDivider";
import { EvList } from "@/components/EvList";
import { EvMenu } from "@/components/EvMenu";
import { EvSection } from "@/components/EvSection";
import { EvSurface } from "@/components/EvSurface";
import { EvTextfield } from "@/components/EvTextfield";
import { EvTooltip } from "@/components/EvTooltip";
import { FilterIcon, SearchIcon } from "@/icons";
import { computed, ref, shallowRef } from "vue";
import { useLocaleFunctions } from "@/composables";
import {
    SortProps,
    useSortOptions,
} from "@/components/EvDataTable/composables/sort.ts";
import { useModelProxy } from "@/composables/modelProxy.ts";
import { useSelection } from "@/components/EvDataTable/composables/select.ts";
import { debounce } from "@/util";

const props = defineProps({ ...makeEvDataTableSearchProps() });
const emit = defineEmits(["update:sort", "click:filter", "update:search"]);
const sortButtonRef = ref<HTMLElement>();
const filterButtonRef = ref<HTMLElement>();
const { t } = useLocaleFunctions();
const search = useModelProxy(props, "search");
const searchInternal = shallowRef("");
const {
    hasSort,
    sortSelected,
    sortTitle,
    sortTitleOptions,
    sortTitleSelected,
    sortDirectionOptions,
    onSortTitleSelected,
    sortIcon,
} = useSortOptions(props as SortProps);

const { allSelected, someSelected, selectAll, showSelectAll } = useSelection();

function onClickFilter(e: MouseEvent) {
    emit("click:filter", e);
}

const placeholder = computed(() =>
    props.searchPlaceholder?.length
        ? props.searchPlaceholder
        : t("search.placeholder"),
);

const updateSearch = debounce((value) => {
    search.value = value;
}, props.searchDelay);

function onSearchInternal(value: string) {
    updateSearch(value);
}
</script>

<template>
    <div class="ev-data-table-search">
        <div v-if="showSelectAll" class="ev-data-table-search--checkbox">
            <ev-checkbox
                :model-value="allSelected"
                :indeterminate="someSelected && !allSelected"
                @update:model-value="selectAll" />
        </div>
        <div class="ev-data-table-search--field">
            <ev-textfield
                v-model="searchInternal"
                rounded
                clearable
                appearance="subtle"
                size="small"
                :loading="props.loading"
                :placeholder="placeholder"
                :icon-start="SearchIcon"
                @update:model-value="onSearchInternal" />
        </div>
        <div class="ev-data-table-search--filter">
            <ev-button
                ref="filterButtonRef"
                rounded
                size="small"
                variant="subtle"
                :icon="FilterIcon"
                @click="onClickFilter" />
            <ev-tooltip
                :activator="filterButtonRef"
                :text="t('search.filter')" />
        </div>
        <div v-if="hasSort" class="ev-data-table-search--sort">
            <ev-button
                ref="sortButtonRef"
                rounded
                size="small"
                variant="subtle"
                :text="sortTitle"
                :icon-end="sortIcon" />
            <ev-tooltip :activator="sortButtonRef" :text="t('sort.label')" />
            <ev-menu
                :activator="sortButtonRef"
                :close-on-content-click="false"
                :width="200"
                position="bottom-end">
                <ev-surface elevation="overlay" class="w-100 h-100">
                    <ev-section :title="t('sort.heading')">
                        <ev-list
                            required
                            select-strategy="single-any"
                            :items="sortTitleOptions"
                            :selected="sortTitleSelected"
                            @update:selected="onSortTitleSelected" />
                    </ev-section>
                    <ev-divider />
                    <ev-section :title="t('sort.direction')">
                        <ev-list
                            v-model:selected="sortSelected"
                            required
                            select-strategy="single-any"
                            item-title="direction"
                            :items="sortDirectionOptions" />
                    </ev-section>
                </ev-surface>
            </ev-menu>
        </div>
    </div>
</template>
