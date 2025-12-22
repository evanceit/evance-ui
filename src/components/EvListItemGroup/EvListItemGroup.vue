<script setup lang="ts">
import "./EvListItemGroup.scss";
import { EvButton } from "@/components/EvButton";
import { EvIcon } from "@/components/EvIcon";
import {ChevronRightIcon, DotIcon, HomeIcon} from "@/icons";
import { EvListItem } from "@/components/EvListItem";
import { ref } from "vue";
import {EvButtonGroup, EvCheckbox, EvLozenge, EvProgressCircular} from "@/components";

/**
 * @todo: I need a compact version and a default version
 * In the compact mode the chevron shows on hover in place of the icon if present.
 * In the expanded mode the chevron and the icon are visible
 */

const hasIconStart = ref(true);
const isCompact = ref(true);
const isExpanded = ref(false);
const hasChildren = ref(true);
const isLoading = ref(false);

</script>

<template>
    <div
        role="list"
        :class="[
            'ev-list-item-group',
            {
                'is-leaf': !hasChildren,
            },
        ]">
        <ev-list-item @click="isExpanded = !isExpanded">
            <template #iconStart>

                <div class="ev-list-item-group__indicator">
                    <ev-progress-circular v-if="isLoading" indeterminate />
                    <ev-button
                        v-else-if="hasChildren"
                        icon
                        :class="[
                            'ev-list-item-group__expander',
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
                    <ev-icon v-else :glyph="DotIcon" />
                </div>

                <ev-icon :glyph="HomeIcon" />
            </template>

            List Item Group
        </ev-list-item>

    </div>

    <br />
    <br />
    <p>Options</p>
    <ev-checkbox v-model="isLoading" label="Is loading" />
    <ev-checkbox v-model="isExpanded" label="Is expanded" />
    <ev-checkbox v-model="hasChildren" label="Has children" />
</template>
