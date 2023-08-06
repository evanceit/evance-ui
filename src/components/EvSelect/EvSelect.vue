<script setup lang="ts">
/**
 * # EvSelect
 *
 */
import './EvSelect.scss';
import EvTextfield from "../EvTextfield/EvTextfield.vue";
import {computed, ref, shallowRef} from "vue";
import {makeEvSelectProps} from "./EvSelect.ts";
import {filterComponentProps, wrapInArray} from "../../util";
import {EvMenu} from "../EvMenu";
import EvList from "../EvList/EvList.vue";
import {useItems} from "../../composables/lists";
import {useModelProxy} from "../../composables/modelProxy.ts";
import {FocusEvent} from "react";
import EvVirtualScroll from "../EvVirtualScroll/EvVirtualScroll.vue";
import EvListItem from "../EvListItem/EvListItem.vue";
import {ListItem} from "../EvList";

// Props
const props = defineProps(makeEvSelectProps());

// TextField
const evTextfieldRef = ref();
const evTextfieldProps = computed(() => {
   return filterComponentProps(EvTextfield, props);
});
const isFocused = shallowRef(false);

// Menu
const evMenuRef = ref<EvMenu>();
const menuOpenProxy = useModelProxy(props, 'menuOpen');
const isMenuOpen = computed({
    get: () => menuOpenProxy.value,
    set: (value) => {
        if (menuOpenProxy.value && !value && evMenuRef.value?.openChildren) {
            return;
        }
        menuOpenProxy.value = value;
    }
});






// List
const evListRef = ref<EvList>();
const displayItems = computed(() => {
    if (props.hideSelected) {
        return items.value.filter(item => !selections.value.some(s => s === item));
    }
    return items.value;
});
const { items, transformIn, transformOut } = useItems(props);
const model = useModelProxy(
    props,
    "modelValue",
    [],
    (value) => transformIn(value === null ? [null] : wrapInArray(value)),
    (value) => {
        const transformed = transformOut(value);
        return props.multiple ? transformed : (transformed[0] ?? null);
    }
);
const selections = computed(() => {
    return model.value.map((value) => {
        return items.value.find((item) => {
            return (props.valueComparator(item.value, value.value));
        }) || value;
    });
});
const selected = computed(() => {
    return selections.value.map(selection => selection.props.value);
});


/**
 * ## On Menu After Leave
 * Maintain focus on the EvSelect when leaving the menu - usually when tabbing out.
 */
function onMenuAfterLeave() {
    if (isFocused.value) {
        evTextfieldRef.value?.input?.focus();
    }
}

/**
 * ## On List Focus In
 * Maintain focus on the select when a menu item is selected.
 * @param e
 */
function onListFocusIn(e:FocusEvent) {
    isFocused.value = true;
}

function onListMouseDown(e: MouseEvent) {
    e.preventDefault();
}

function onMousedownControl () {
    isMenuOpen.value = !isMenuOpen.value;
}

/**
 * ## Select
 * @param item
 */
function select(item: ListItem) {
    if (props.multiple) {
        const index = selected.value.findIndex(selection => {
            return props.valueComparator(selection, item.value);
        });
        if (index === -1) {
            model.value = [...model.value, item];
        } else {
            const value = [...model.value];
            value.splice(index, 1);
            model.value = value;
        }
    } else {
        model.value = [item];
        isMenuOpen.value = false;
    }
}

</script>
<template>
    <ev-textfield
        ref="evTextfieldRef"
        class="ev-select"
        v-bind="evTextfieldProps"
        v-model:focused="isFocused"
        readonly
        @mousedown:control="onMousedownControl"
    >
        <template #default>
            <div class="ev-select--selected">
                <span
                    class="ev-select--selected-text"
                    v-for="(item, index) in selections"
                >
                    {{ item.title }}
                    <span v-if="props.multiple && (index < selections.length - 1)"
                          class="ev-select-seelected-comma">,</span>
                </span>
            </div>
        </template>
    </ev-textfield>
    <ev-menu
        ref="evMenuRef"
        v-model="isMenuOpen"
        max-height="310"
        :activator="evTextfieldRef"
        :closeOnContentClick="false"
        :openOnClick="false"
        @afterLeave="onMenuAfterLeave"
    >
        <ev-list
            ref="evListRef"
            :selected="selected"
            :selectStrategy="props.multiple ? 'multi-any' : 'single-any'"
            @click="onListMouseDown"
            @focusin="onListFocusIn"
            tabindex="-1"
        >
            <ev-virtual-scroll renderless
                               :items="displayItems"
            >
                <template #default="{ item, index }">
                    <ev-list-item
                        v-bind="item"
                        @click="select(item)"
                    />
                </template>
            </ev-virtual-scroll>
        </ev-list>
    </ev-menu>

    {{ selected }}
    {{ selections }}
</template>