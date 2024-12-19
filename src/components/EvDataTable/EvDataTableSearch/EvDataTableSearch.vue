<script setup lang="ts">
import "./EvDataTableSearch.scss";
import { makeEvDataTableSearchProps } from "./EvDataTableSearch.ts";
import { EvBadge } from "@/components/EvBadge";
import { EvButton } from "@/components/EvButton";
import { EvButtonGroup } from "@/components/EvButtonGroup";
import { EvCheckbox } from "@/components/EvCheckbox";
import { EvDefaultsProvider } from "@/components/EvDefaultsProvider";
import { EvDivider } from "@/components/EvDivider";
import { EvList } from "@/components/EvList";
import { EvMenu } from "@/components/EvMenu";
import { EvSection } from "@/components/EvSection";
import { EvSlideGroup } from "@/components/EvSlideGroup";
import { EvSurface } from "@/components/EvSurface";
import { EvTextfield } from "@/components/EvTextfield";
import { EvTooltip } from "@/components/EvTooltip";
import { FilterIcon, SearchIcon } from "@/icons";
import { computed, onMounted, onUnmounted, ref, shallowRef } from "vue";
import { useLocaleFunctions } from "@/composables";
import {
    SortProps,
    useSortOptions,
} from "@/components/EvDataTable/composables/sort.ts";
import { useModelProxy } from "@/composables/modelProxy.ts";
import { useSelection } from "@/components/EvDataTable/composables/select.ts";
import { debounce, isArray, isBoolean, isEmpty } from "@/util";
import { EvTransitionExpand } from "@/components/EvTransition/transitions";

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

const slots = defineSlots<{
    filters(): never;
    "select-actions"(): never;
}>();

const { allSelected, someSelected, selectAll, showSelectAll } = useSelection();
const isTransitioning = shallowRef(false);
const containerRef = ref<HTMLElement | null>(null);
const containerWidth = shallowRef<number | null>(null);
const showFilters = shallowRef(false);
const filtersBreakpoint = 900;
const sortBreakpoint = 480;

function onClickFilter(e: MouseEvent) {
    showFilters.value = !showFilters.value;
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

const showActions = computed(() => {
    const hasSelectActions = slots["select-actions"] || props.selectActions;
    return someSelected.value && hasSelectActions;
});

const isFiltersMobile = computed(() => {
    return containerWidth.value < filtersBreakpoint;
});

const filterDefaults = {
    EvFilterButton: { size: "small", rounded: true },
    EvButton: { size: "small" },
};

const sortButtonTitle = computed(() => {
    return containerWidth.value > sortBreakpoint
        ? sortTitle.value
        : undefined;
});

const isFiltered = computed(() => {
    for (const key in props.filters) {
        const value = props.filters[key];
        if (isBoolean(value) && value) {
            return true;
        } else if (Array.isArray(value) && value.length > 0) {
            return true;
        } else if (!isBoolean(value) && !isArray(value) && !isEmpty(value)) {
            return true;
        }
    }
    return false;
});

function onSearchInternal(value: string) {
    updateSearch(value);
}

function onBeforeLeave() {
    isTransitioning.value = true;
}

function onAfterEnter() {
    isTransitioning.value = false;
}

function onResize() {
    containerWidth.value = containerRef.value.getBoundingClientRect().width;
}

onMounted(() => {
    window.addEventListener("resize", onResize, { passive: true });
    onResize();
});

onUnmounted(() => {
    window.removeEventListener("resize", onResize);
});
</script>

<template>
    <div ref="containerRef" class="ev-data-table-search">
        <div
            v-if="showSelectAll && !props.hideSelectAll"
            class="ev-data-table-search--checkbox">
            <ev-checkbox
                :model-value="allSelected"
                :indeterminate="someSelected && !allSelected"
                @update:model-value="selectAll" />
        </div>
        <div
            :class="[
                'ev-data-table-search--modifiers',
                {
                    'is-transitioning': isTransitioning,
                },
            ]">
            <transition
                name="transition-slide-up"
                mode="out-in"
                @before-leave="onBeforeLeave"
                @after-enter="onAfterEnter">
                <div v-if="!showActions" class="ev-data-table-search--options">
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
                    <div
                        v-if="isFiltersMobile && slots.filters"
                        class="ev-data-table-search--filter">
                        <ev-badge
                            dot
                            bold
                            pulsate
                            appearance="primary"
                            :model-value="isFiltered && !showFilters">
                            <ev-button
                                ref="filterButtonRef"
                                rounded
                                size="small"
                                :appearance="isFiltered ? 'primary' : 'default'"
                                :variant="isFiltered ? 'tonal' : 'subtle'"
                                :icon="FilterIcon"
                                @click="onClickFilter" />
                        </ev-badge>
                        <ev-tooltip
                            :activator="filterButtonRef"
                            :text="t('search.filter')" />
                    </div>
                    <div
                        v-if="!isFiltersMobile && slots.filters"
                        class="ev-data-table-search--filters">
                        <ev-defaults-provider :defaults="filterDefaults">
                            <ev-slide-group>
                                <slot name="filters" />
                            </ev-slide-group>
                        </ev-defaults-provider>
                    </div>
                    <div v-if="hasSort" class="ev-data-table-search--sort">
                        <ev-button
                            ref="sortButtonRef"
                            rounded
                            size="small"
                            variant="subtle"
                            :text="sortButtonTitle"
                            :icon-end="sortIcon" />
                        <ev-tooltip
                            :activator="sortButtonRef"
                            :text="t('sort.label')" />
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
                                        @update:selected="
                                            onSortTitleSelected
                                        " />
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
                <div v-else class="ev-data-table-search--actions">
                    <slot name="select-actions">
                        <ev-button-group
                            size="small"
                            variant="subtle"
                            :items="props.selectActions" />
                    </slot>
                </div>
            </transition>
        </div>
    </div>
    <ev-transition-expand>
        <div
            v-if="isFiltersMobile && showFilters && slots.filters && !showActions"
            key="filter"
            class="ev-data-table-filters">
            <ev-defaults-provider :defaults="filterDefaults">
                <ev-slide-group>
                    <slot name="filters" />
                </ev-slide-group>
            </ev-defaults-provider>
        </div>
    </ev-transition-expand>
</template>
