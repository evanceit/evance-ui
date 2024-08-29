import { propsFactory } from "@/util";
import { computed, ComputedRef, PropType } from "vue";
import { useModelProxy } from "@/composables/modelProxy.ts";
import { useLocaleFunctions } from "@/composables";
import { ArrowDownIcon, ArrowUpIcon } from "@/icons";

export interface SortOption {
    title: string;
    value: string;
    direction?: string;
    disabled?: boolean;
}

export interface SortProps {
    sort: string[];
    sortOptions: SortOption[];
}

export const makeDataTableSortProps = propsFactory(
    {
        sort: {
            type: Array as PropType<string[]>,
            default: () => [],
        },
        sortOptions: Array as PropType<SortOption[]>,
    },
    "data-table-sort",
);

export function useSortOptions(props: SortProps) {
    const sortSelected = useModelProxy(props, "sort");
    const { t } = useLocaleFunctions();
    const hasSort = computed(() => props.sortOptions?.length);

    function isTitleDisabled(title: string) {
        return getItemsByTitle(title).every((option) => option.disabled);
    }

    function getItemsByTitle(title: string) {
        return sortOptions.value.filter((item) => item.title === title);
    }

    function getTitleFromValue(value: string) {
        const titles = sortOptions.value
            .filter((item) => item.value === value)
            .map((item) => item.title);
        return titles[0] ?? undefined;
    }

    function isAscending(value: string) {
        return value?.endsWith("asc");
    }

    /**
     * Fixes some optional properties in `SortOption` objects.
     */
    const sortOptions: ComputedRef<SortOption[]> = computed(() => {
        return props.sortOptions.map((item) => {
            return Object.assign(
                {
                    disabled: item.disabled ?? false,
                    direction: item.value.endsWith("asc")
                        ? t("sort.ascending")
                        : t("sort.descending"),
                },
                item,
            );
        });
    });

    /**
     * Reduces the supplied sort options down to unique titles
     * and determines whether the title is disabled if all of its
     * values are disabled.
     */
    const sortTitleOptions = computed(() => {
        const titles = Array.from(
            new Set(sortOptions.value.map((item) => item.title)),
        );
        const options = [];
        for (const title of titles) {
            options.push({
                title,
                value: title,
                props: {
                    disabled: isTitleDisabled(title),
                },
            });
        }
        return options;
    });

    const sortTitleSelected = computed(() => {
        const titles = [];
        for (const value of sortSelected.value) {
            titles.push(getTitleFromValue(value));
        }
        return titles;
    });

    const sortTitle = computed(() => sortTitleSelected.value[0]);

    const sortDirectionOptions = computed(() => {
        const options = getItemsByTitle(sortTitle.value);
        return options.map((option) => {
            return Object.assign(
                {
                    props: {
                        disabled: option.disabled,
                        iconStart: isAscending(option.value)
                            ? ArrowUpIcon
                            : ArrowDownIcon,
                    },
                },
                option,
            );
        });
    });

    const onSortTitleSelected = (selection: string[]) => {
        const options = getItemsByTitle(selection[0]);
        const availableValues = options.filter((option) => {
            return (
                isAscending(option.value) === isAscending(sortSelected.value[0]) &&
                !option.disabled
            );
        });
        const newOption = availableValues[0] ?? options[0];
        sortSelected.value = [newOption.value];
    };

    const sortIcon = computed(() => {
        return isAscending(sortSelected.value[0]) ? ArrowUpIcon : ArrowDownIcon;
    });

    return {
        hasSort,
        sortOptions,
        sortSelected,
        sortTitle,
        sortTitleOptions,
        sortTitleSelected,
        sortDirectionOptions,
        onSortTitleSelected,
        sortIcon,
    };
}
