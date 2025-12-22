<script setup lang="ts">
import "./EvListGroup.scss";
import { makeEvListGroupProps } from "./EvListGroup";
import { EvButton } from "@/components/EvButton";
import { EvIcon } from "@/components/EvIcon";
import { EvProgressCircular } from "@/components/EvProgressCircular";
import { ChevronRightIcon } from "@/icons";
import { EvListItem } from "@/components/EvListItem";
import { computed, ref } from "vue";
import { EvTransition } from "@/components/EvTransition";
import ExpandTransitionGenerator from "@/components/EvTransition/transitions/expandTransition";
import { filterComponentProps, omit } from "@/util";

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

/**
 * @todo: I need a compact version and a default version
 * In the compact mode the chevron shows on hover in place of the icon if present.
 * In the expanded mode the chevron and the icon are visible
 *
 * @todo: Implement props
 */

const isExpanded = ref(false);
const isLoading = ref(false);
const transition = ExpandTransitionGenerator("", false);

const evListItemProps = computed(() => {
    return omit(filterComponentProps(EvListItem, props), ["modelValue"]);
});

</script>

<template>
    <div
        role="listitem"
        :class="[
            'ev-list-group',
        ]">
        <ev-list-item
            v-bind="evListItemProps"
            @click="isExpanded = !isExpanded">
            <template #iconStart>

                <div class="ev-list-group__indicator">
                    <ev-progress-circular v-if="isLoading" indeterminate />
                    <ev-button
                        v-else
                        icon
                        :class="[
                            'ev-list-group__expander',
                            {
                                'is-expanded': isExpanded,
                            },
                        ]"
                        size="x-small"
                        variant="subtle"
                        @click="isExpanded = !isExpanded">
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
            <div v-show="isExpanded" role="list" class="ev-list-group__items">
                <slot name="default" />
            </div>
        </ev-transition>
    </div>
</template>
