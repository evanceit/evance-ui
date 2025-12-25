<script setup lang="ts">
import "./EvListGroup.scss";
import { makeEvListGroupProps } from "./EvListGroup";
import { EvButton } from "@/components/EvButton";
import { EvIcon } from "@/components/EvIcon";
import { EvProgressCircular } from "@/components/EvProgressCircular";
import { ChevronRightIcon } from "@/icons";
import { EvListItem } from "@/components/EvListItem";
import { computed, ref, toRef } from "vue";
import { EvTransition } from "@/components/EvTransition";
import ExpandTransitionGenerator from "@/components/EvTransition/transitions/expandTransition";
import { filterComponentProps, omit } from "@/util";
import { useNestedListItem } from "@/composables/lists";

const props = defineProps({
    ...makeEvListGroupProps(),
});
const slots = defineSlots<{
    default(): never;
    iconStart(): never;
    iconEnd(): never;
    prefix(): never;
    suffix(): never;
}>();

const {
    isOpen,
    open,
    id: _id,
} = useNestedListItem(toRef(props, "value"), true);

const isLoading = ref(false);
const transition = ExpandTransitionGenerator("", false);

const evListItemProps = computed(() => {
    return omit(filterComponentProps(EvListItem, props), ["modelValue"]);
});

function onClick(e: Event) {
    open(!isOpen.value, e);
}

</script>

<template>
    <div
        role="listitem"
        :class="[
            'ev-list-group',
        ]">
        <ev-list-item
            v-bind="evListItemProps"
            @click="onClick">
            <template #iconStart>

                <div class="ev-list-group__indicator">
                    <ev-progress-circular v-if="isLoading" indeterminate />
                    <ev-button
                        v-else
                        icon
                        :class="[
                            'ev-list-group__expander',
                            {
                                'is-expanded': isOpen,
                            },
                        ]"
                        size="x-small"
                        variant="subtle"
                        @click="onClick">
                        <ev-icon
                            :glyph="ChevronRightIcon"
                            class="is-expander-chevron" />
                    </ev-button>
                </div>
                <template v-if="slots.iconStart || props.iconStart">
                    <slot name="iconStart">
                        <ev-icon :glyph="props.iconStart" />
                    </slot>
                </template>
            </template>
        </ev-list-item>

        <ev-transition name="ev-list-group-transition" v-bind="transition">
            <div v-show="isOpen" role="list" class="ev-list-group__items">
                <slot name="default" />
            </div>
        </ev-transition>
    </div>
</template>
