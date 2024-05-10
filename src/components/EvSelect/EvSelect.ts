import { omit, propsFactory } from "@/util";
import { makeListItemsProps } from "@/composables/lists";
import { makeEvTextfieldProps } from "@/components/EvTextfield";
import { ChevronDown } from "@/icons";
import { PropType } from "vue";
import { makeFilterProps } from "@/composables/filter.ts";

/**
 * # Selectable Behavior
 * - 'select' simple selection (HTML select replacement)
 * - 'autocomplete' only permits selection of items
 * - 'combobox' allows selection or new values as strings
 */
export type SelectableBehavior = "select" | "autocomplete" | "combobox";

/**
 * # Make EvSelect Props
 */
export const makeEvSelectProps = propsFactory(
    {
        autoSelectFirst: {
            type: [Boolean, String] as PropType<boolean | "exact">,
        },
        behavior: {
            type: String as PropType<SelectableBehavior>,
            default: "select",
        },
        delimiters: {
            type: Array as PropType<string[]>,
            default: [","],
        },
        hideItemsEmpty: Boolean,
        hideSelected: Boolean,
        itemsEmptyText: {
            type: String,
            default: "select.noItemsText",
        },
        menuOpen: Boolean,
        multiple: Boolean,
        openOnClear: Boolean,
        search: String,
        tags: Boolean,

        ...makeFilterProps({ filterKeys: ["title"] }),

        ...makeListItemsProps({
            itemChildren: false,
        }),

        ...omit(
            makeEvTextfieldProps({
                modelValue: null,
                iconEnd: ChevronDown,
                role: "select",
            }),
            ["align", "monospace", "type"],
        ),
    },
    "EvSelect",
);
