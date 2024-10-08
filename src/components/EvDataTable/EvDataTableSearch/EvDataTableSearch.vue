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
import { computed, ref } from "vue";
import { useLocaleFunctions } from "@/composables";
import {
    SortProps,
    useSortOptions,
} from "@/components/EvDataTable/composables/sort.ts";
import { useModelProxy } from "@/composables/modelProxy.ts";

const props = defineProps({ ...makeEvDataTableSearchProps() });
const emit = defineEmits(["update:sort", "click:filter", "update:search"]);
const sortButtonRef = ref<HTMLElement>();
const filterButtonRef = ref<HTMLElement>();
const { t } = useLocaleFunctions();
const searchModel = useModelProxy(props, "search");

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

function onClickFilter(e: MouseEvent) {
    emit("click:filter", e);
}

const placeholder = computed(() =>
    props.placeholder?.length ? props.placeholder : t("search.placeholder"),
);
</script>

<template>
    <div class="ev-data-table-search">
        <div v-if="props.selectable" class="ev-data-table-search--checkbox">
            <ev-checkbox />
        </div>
        <div class="ev-data-table-search--field">
            <ev-textfield
                v-model="searchModel"
                rounded
                clearable
                appearance="subtle"
                size="small"
                :placeholder="placeholder"
                :icon-start="SearchIcon" />
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
