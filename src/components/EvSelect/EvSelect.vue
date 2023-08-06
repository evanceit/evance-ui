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

// Props
const props = defineProps(makeEvSelectProps());

// TextField Stuff
const evTextfieldRef = ref();
const evTextfieldProps = computed(() => {
   return filterComponentProps(EvTextfield, props);
});

// Menu Stuff
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
            return (props.valueComparator(item.value, value.value)) || value;
        });
    });
});
const selected = computed(() => {
    return selections.value.map(selection => selection.props.value);
});
const isFocused = shallowRef(false);

const displayItems = computed(() => {
    if (props.hideSelected) {
        return items.value.filter(item => !selections.value.some(s => s === item));
    }
    return items.value;
});

// List
const evListRef = ref<EvList>();


// Events


function onMenuAfterLeave() {
    if (isFocused.value) {
        evTextfieldRef.value?.input?.focus();
    }
}

/**
 * ## On List Focus In
 * Maintain focus on the select when an menu item is selected.
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
            <div class="ev-select--selected">My Selected value</div>
        </template>
    </ev-textfield>
    <ev-menu
        ref="evMenuRef"
        v-model="isMenuOpen"
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
                    <ev-list-item v-bind="item" />
                </template>
            </ev-virtual-scroll>
        </ev-list>
    </ev-menu>

    {{ selected }}
    {{ selections }}
</template>