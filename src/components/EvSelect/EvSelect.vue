<script setup lang="ts">
/**
 * # EvSelect
 *
 */
import "./EvSelect.scss";
import { makeEvSelectProps } from "./EvSelect";
import { useScrolling } from "./useScrolling";
import { EvTextfield } from "@/components/EvTextfield";
import { EvMenu } from "@/components/EvMenu";
import { EvList, ListItem } from "@/components/EvList";
import { EvListItem } from "@/components/EvListItem";
import { EvVirtualScroll } from "@/components/EvVirtualScroll";
import { EvSurface } from "@/components/EvSurface";
import { EvTag } from "@/components/EvTag";
import { transformItem, useItems } from "@/composables/lists";
import { useModelProxy } from "@/composables/modelProxy";
import { useLocaleFunctions } from "@/composables/locale";
import { useForm } from "@/composables/form";
import {
    computed,
    mergeProps,
    nextTick,
    Ref,
    ref,
    shallowRef,
    useSlots,
    watch,
} from "vue";
import {
    Browser,
    filterComponentProps,
    isComposingIgnoreKey,
    KeyLogger,
    matchesSelector,
    wrapInArray,
} from "@/util";
import { FocusEvent, MouseEvent } from "react";
import { useFilter } from "@/composables/filter";

// Props
const props = defineProps({
    ...makeEvSelectProps(),
});

defineSlots<{
    label(): any;
    "list-prefix"(): any;
    "list-suffix"(): any;
    item(props: { item: any; index: number; props: any }): any;
    "items-empty"(): any;
    "items-prefix"(): any;
    "items-suffix"(): any;
    placeholder(): any;
    prefix(): any;
    selection(item: any, index: number): any;
    suffix(): any;
}>();

const emit = defineEmits([
    "update:focused",
    "update:menuOpen",
    "update:modelValue",
    "update:search",
]);

const slots = useSlots();

// TextField
const evTextfieldRef = ref();
const evTextfieldProps = computed(() => {
    return filterComponentProps(EvTextfield, props);
});
const isFocused = shallowRef(false);
const isPristine = shallowRef(true);
const isSearchable = computed(() => props.behavior !== "select");
const listHasFocus = shallowRef(false);
const isSelecting = shallowRef(false);

// Menu
const evMenuRef = ref<typeof EvMenu>();
const menuOpenProxy = useModelProxy(props, "menuOpen");
const isMenuOpen = computed({
    get: () => menuOpenProxy.value,
    set: (value) => {
        if (menuOpenProxy.value && !value && evMenuRef.value?.openChildren) {
            return;
        }
        menuOpenProxy.value = value;
    },
});
const isMenuDisabled = computed(() => {
    return (props.hideItemsEmpty && !items.value.length) || !!props.readonly;
});

// List
const evListRef = ref<typeof EvList>();
const evVirtualScrollRef = ref<typeof EvVirtualScroll>();
const { items, transformIn, transformOut } = useItems(props);
const search = useModelProxy(props, "search", "");
// @todo: implement getMatches
const { filteredItems } = useFilter(props, items, () =>
    isPristine.value || !isSearchable.value ? "" : search.value,
);
const displayItems = computed(() => {
    if (props.hideSelected) {
        return filteredItems.value.filter(
            (filteredItem) =>
                !model.value.some(
                    (s: ListItem) => s.value === filteredItem.value,
                ),
        );
    }
    return filteredItems.value;
});

const model = useModelProxy(
    props,
    "modelValue",
    [],
    (value) => transformIn(value === null ? [null] : wrapInArray(value)),
    (value) => {
        const transformed = transformOut(value);
        return props.multiple ? transformed : transformed[0] ?? null;
    },
);
const selections = computed(() => {
    return model.value.map((value: any) => {
        return (
            items.value.find((item) => {
                return props.valueComparator(item.value, value.value);
            }) || value
        );
    });
});
const selectionIndex = shallowRef(-1);
const selected = computed(() => {
    return selections.value.map((selection: any) => selection.props.value);
});
const keyLogger = new KeyLogger();

const highlightFirst = computed(() => {
    const selectFirst =
        props.autoSelectFirst === true ||
        (props.autoSelectFirst === "exact" &&
            search.value === displayItems.value[0]?.title);
    return (
        selectFirst &&
        displayItems.value.length > 0 &&
        !isPristine.value &&
        !listHasFocus.value
    );
});

const form = useForm();
const { t } = useLocaleFunctions();

/**
 * ## On Menu After Leave
 * Maintain focus on the EvSelect when leaving the menu - usually when tabbing out.
 */
function onMenuAfterLeave() {
    if (isFocused.value) {
        isPristine.value = true;
        evTextfieldRef.value?.focus();
    }
}

/**
 * ## On List Focus In
 * Maintain focus on the select when a menu item is selected.
 * @param e
 */
function onListFocusIn(e: FocusEvent) {
    setTimeout(() => {
        isFocused.value = true;
        listHasFocus.value = true;
    });
}

/**
 * ## onListFocusOut
 *
 * @param e
 */
function onListFocusOut(e: FocusEvent) {
    listHasFocus.value = false;
}

/**
 * ## One List Mousedown
 * @param e
 */
function onListMouseDown(e: MouseEvent) {
    e.preventDefault();
}

const { onListScroll, onListKeydown } = useScrolling(evListRef, evTextfieldRef);

/**
 * ## On Field Blur
 * @param e
 */
function onFieldBlur(e: FocusEvent) {
    if (!evListRef.value?.$el.contains(e.relatedTarget as HTMLElement)) {
        isMenuOpen.value = false;
    }
    selectionIndex.value = -1;
}

/**
 * ## onFieldChange
 * If the field changed due to an autofill utility attempt to select an item.
 * @param e
 */
function onFieldChange(e: Event) {
    if (
        matchesSelector(evTextfieldRef.value, ":autofill") ||
        matchesSelector(evTextfieldRef.value, ":-webkit-autofill")
    ) {
        const item = items.value.find(
            (item) => item.title === (e.target as HTMLInputElement).value,
        );
        if (item) {
            select(item);
        }
    }
}

/**
 * ## On Field Clear
 * When the user clicks on the `clearable` icon.
 * @param e
 */
function onFieldClear(e: MouseEvent) {
    if (props.openOnClear) {
        isMenuOpen.value = true;
    }
    search.value = "";
}

/**
 * ## On Field Input
 * @param e
 */
function onFieldInput(e: InputEvent) {
    search.value = (e.target as HTMLInputElement).value;
}

/**
 * ## On Field Keydown
 * @param e
 */
function onFieldKeydown(e: KeyboardEvent) {
    if (
        !e.key ||
        isComposingIgnoreKey(e) ||
        props.readonly ||
        form?.isReadonly.value
    ) {
        return;
    }

    const preventKeys = ["Enter", "ArrowDown", "ArrowUp"];
    const openerKeys = ["Enter", "ArrowDown"];
    const escapeKeys = ["Escape"];
    if (!isSearchable.value) {
        preventKeys.push(" ", "Home", "End");
        openerKeys.push(" ");
        escapeKeys.push("Tab");
    }

    if (selectionIndex.value > -1 || preventKeys.includes(e.key)) {
        e.preventDefault();
    }

    if (openerKeys.includes(e.key)) {
        isMenuOpen.value = true;
    }

    if (escapeKeys.includes(e.key)) {
        isMenuOpen.value = false;
    }

    if (!isSearchable.value) {
        // Use `keyLogger`
        keydownBehaviorSelect(e);
        return;
    }

    if (["Enter", "Tab"].includes(e.key)) {
        if (highlightFirst.value) {
            select(displayItems.value[0]);
        } else if (!props.multiple && props.behavior === "combobox") {
            select(transformItem(props as any, search.value));
        }
    }

    if (e.key === "ArrowDown" && highlightFirst.value) {
        evListRef.value?.focus("next");
    }

    if (!props.multiple) {
        return;
    }

    const selectionStart = evTextfieldRef.value.selectionStart;
    const length = model.value.length;

    // Backspacing
    if (["Backspace", "Delete"].includes(e.key)) {
        if (selectionIndex.value < 0) {
            if (e.key === "Backspace" && !search.value) {
                selectionIndex.value = length - 1;
            }
            return;
        }
        const originalSelectionIndex = selectionIndex.value;
        const selectedItem = model.value[selectionIndex.value];
        if (selectedItem && !selectedItem.props.disabled) {
            select(selectedItem, false);
        }
        selectionIndex.value =
            originalSelectionIndex >= length - 1
                ? length - 2
                : originalSelectionIndex;
    }

    // Left
    if (e.key === "ArrowLeft") {
        if (selectionIndex.value < 0 && selectionStart > 0) {
            return;
        }
        const previous =
            selectionIndex.value > -1 ? selectionIndex.value - 1 : length - 1;
        if (model.value[previous]) {
            selectionIndex.value = previous;
        } else {
            selectionIndex.value = -1;
            evTextfieldRef.value?.input.setSelectionRange(
                search.value?.length,
                search.value?.length,
            );
        }
    }

    // Right
    if (e.key === "ArrowRight") {
        if (selectionIndex.value < 0) {
            return;
        }
        const next = selectionIndex.value + 1;
        if (model.value[next]) {
            selectionIndex.value = next;
        } else {
            selectionIndex.value = -1;
            evTextfieldRef.value?.input.setSelectionRange(0, 0);
        }
    }

    if (props.behavior !== "combobox") {
        return;
    }

    // Enter or delimiters
    if (
        (props.delimiters.includes(e.key) || e.key === "Enter") &&
        search.value
    ) {
        e.preventDefault();
        select(transformItem(props as any, search.value));
        search.value = "";
    }
}

/**
 * ## keydownBehaviorSelect
 * Handles keydown events for the select control when the input field
 * cannot be entered. Instead, we use `keyLogger` to track key events
 * and then select the first available item in the list.
 * @param e
 */
function keydownBehaviorSelect(e: KeyboardEvent) {
    if (e.key === "Home") {
        evListRef.value?.focus("first");
    } else if (e.key === "End") {
        evListRef.value?.focus("last");
    }

    if (props.multiple || !keyLogger.log(e)) {
        return;
    }

    const itemIndex = items.value.findIndex((item) =>
        item.title.toLowerCase().startsWith(keyLogger.value),
    );
    if (itemIndex >= 0) {
        model.value = [items.value[itemIndex]];
        if (isMenuOpen.value) {
            const scrollIndex = itemIndex > 0 ? itemIndex - 1 : 0;
            evVirtualScrollRef.value?.scrollToIndex(scrollIndex);
        }
    }
}

/**
 * On Field Mousedown
 */
function onFieldMousedown() {
    if (isMenuDisabled.value) {
        return;
    }
    isMenuOpen.value = !isMenuOpen.value;
}

/**
 * ## Select
 * @param item
 * @param set `null` means toggle
 */
function select(item: ListItem, set: boolean | null = true) {
    if (item.props.disabled) {
        return;
    }

    if (props.multiple) {
        const index = model.value.findIndex((selection: any) => {
            return props.valueComparator(selection.value, item.value);
        });
        const add = set == null ? !~index : set;

        if (~index) {
            const value = add ? [...model.value, item] : [...model.value];
            value.splice(index, 1);
            model.value = value;
        } else if (add) {
            model.value = [...model.value, item];
        }
        search.value = "";
    } else {
        const add = set !== false;
        model.value = add ? [item] : [];
        search.value = item.title;

        nextTick(() => {
            isMenuOpen.value = false;
            isPristine.value = true;
            isSelecting.value = false;
            evTextfieldRef.value.input.blur();
            isFocused.value = false;
        });
    }

    selectionIndex.value = -1;
}

/**
 *
 */
const fieldValue = computed(() => {
    if (isSearchable.value) {
        return search.value;
    }
    return model.value.map((value: any) => value.props.value).join(", ");
});

/**
 * ## onModelValueUpdate
 * When the model value is updated from the textfield.
 * @param value
 */
function onModelValueUpdate(value: any) {
    if (value === null || (value === "" && !props.multiple)) {
        model.value = [];
    }
}

/**
 * @param item
 * @param index
 * @param itemRef
 */
function itemProps(
    item: ListItem,
    index: number,
    itemRef: Ref<HTMLElement | undefined>,
) {
    return mergeProps(item.props, {
        ref: itemRef,
        key: index,
        onClick: () => select(item),
    });
}

/**
 * ## createTagProps
 * @param item
 */
function createTagProps(item: ListItem) {
    return {
        "onClick:close"(e: Event) {
            e.stopPropagation();
            e.preventDefault();
            select(item, false);
        },
        onKeydown(e: KeyboardEvent) {
            if (e.key !== "Enter" && e.key !== " ") {
                return;
            }
            e.preventDefault();
            e.stopPropagation();
            select(item, false);
        },
        onMousedown(e: MouseEvent) {
            e.preventDefault();
            e.stopPropagation();
        },
    };
}

/**
 * Watch Search
 */
watch(search, (value, oldValue) => {
    if (!isFocused.value || isSelecting.value) {
        return;
    }
    if (value) {
        isMenuOpen.value = true;
    }
    isPristine.value = !value;
});

/**
 * Watch Focused
 */
watch(isFocused, (value, oldValue) => {
    if (value === oldValue) {
        return;
    }
    emit("update:focused", value);
});

/**
 * Scroll to the last selected item when the menu opens.
 */
watch(isMenuOpen, () => {
    if (
        props.hideSelected ||
        !isMenuOpen.value ||
        !model.value.length ||
        !Browser.hasWindow
    ) {
        return;
    }
    const lastSelectedItem = model.value[model.value.length - 1];
    const index = displayItems.value.findIndex(
        (item) => item.value === lastSelectedItem.value,
    );
    window.requestAnimationFrame(() => {
        index >= 0 && evVirtualScrollRef.value?.scrollToIndex(index);
    });
});

const validationValue = computed(() => model.externalValue);
const isPlaceholder = computed(
    () => !selections.value.length && !!slots.placeholder,
);
</script>

<template>
    <ev-textfield
        ref="evTextfieldRef"
        v-bind="evTextfieldProps"
        v-model:focused="isFocused"
        :class="[
            'ev-select',
            {
                'is-single': !props.multiple,
                'is-multiple': props.multiple,
                'is-searchable': isSearchable,
                'is-selecting': selectionIndex > -1,
                'is-placeholder': isPlaceholder,
            },
        ]"
        :model-value="fieldValue"
        :readonly="!isSearchable || props.readonly"
        :placeholder="model.length ? undefined : props.placeholder"
        :validation-value="validationValue"
        @blur="onFieldBlur"
        @change="onFieldChange"
        @click:clear="onFieldClear"
        @input="onFieldInput"
        @keydown="onFieldKeydown"
        @mousedown:control="onFieldMousedown"
        @update:model-value="onModelValueUpdate">
        <template v-if="props.label || slots.label" #label>
            <slot name="label">{{ props.label }}</slot>
        </template>
        <template v-if="slots.prefix" #prefix>
            <slot name="prefix" />
        </template>
        <template #default>
            <div
                v-for="(item, index) in selections"
                :key="item.key"
                :class="[
                    'ev-select--selected',
                    {
                        'is-selected': index === selectionIndex,
                    },
                ]">
                <slot name="selection" v-bind="{ item, index }">
                    <ev-tag
                        v-if="props.tags"
                        :closable="props.multiple"
                        v-bind="createTagProps(item)"
                        :text="item.title" />
                    <span v-else class="ev-select--selected-text">
                        {{ item.title }}
                        <span
                            v-if="props.multiple && index < selections.length - 1"
                            class="ev-select--selected-comma">,</span>
                    </span>
                </slot>
            </div>

            <div v-if="isPlaceholder" class="ev-select--placeholder">
                <slot name="placeholder" />
            </div>

            <ev-menu
                ref="evMenuRef"
                v-model="isMenuOpen"
                class="ev-select--menu"
                max-height="310"
                :disabled="isMenuDisabled"
                activator="parent"
                :close-on-content-click="false"
                :open-on-click="false"
                @after-leave="onMenuAfterLeave">
                <ev-surface elevation="overlay" scrollable>
                    <div
                        v-if="slots['list-prefix']"
                        class="ev-select--list-prefix">
                        <slot name="list-prefix" />
                    </div>

                    <ev-list
                        ref="evListRef"
                        class="ev-select--list"
                        :selected="selected"
                        :select-strategy="
                            props.multiple ? 'multi-any' : 'single-any'
                        "
                        tabindex="-1"
                        @focusin="onListFocusIn"
                        @focusout="onListFocusOut"
                        @keydown="onListKeydown"
                        @mousedown="onListMouseDown"
                        @scroll.passive="onListScroll">
                        <slot name="items-prefix" />

                        <slot
                            v-if="!displayItems.length && !props.hideItemsEmpty"
                            name="items-empty">
                            <ev-list-item
                                :title="t(props.itemsEmptyText)"></ev-list-item>
                        </slot>

                        <ev-virtual-scroll
                            ref="evVirtualScrollRef"
                            renderless
                            :items="displayItems">
                            <template #default="{ item, index, itemRef }">
                                <slot
                                    name="item"
                                    v-bind="{
                                        item,
                                        index,
                                        props: itemProps(item, index, itemRef),
                                    }">
                                    <ev-list-item
                                        :ref="itemRef"
                                        v-bind="item.props"
                                        :key="index"
                                        @click="
                                            select(item as ListItem, null)
                                        " />
                                </slot>
                            </template>
                        </ev-virtual-scroll>

                        <slot name="items-suffix" />
                    </ev-list>

                    <div
                        v-if="slots['list-suffix']"
                        class="ev-select--list-suffix">
                        <slot name="list-suffix" />
                    </div>
                </ev-surface>
            </ev-menu>
        </template>

        <template v-if="slots.suffix" #suffix>
            <slot name="suffix" />
        </template>
    </ev-textfield>
</template>
