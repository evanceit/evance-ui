<script setup lang="ts">
import "./EvListItemGroup.scss";
import { EvButton } from "@/components/EvButton";
import { EvIcon } from "@/components/EvIcon";
import { ChevronRightIcon, HomeIcon } from "@/icons";
import { EvListItem } from "@/components/EvListItem";

/**
 * @todo: I need a compact version and a default version
 * In the compact mode the chevron shows on hover in place of the icon if present.
 * In the expanded mode the chevron and the icon are visible
 */
</script>

<template>
    <div role="list" class="ev-list-item-group">


        <ev-list-item href="#">
            <template #iconStart>
                <ev-button icon size="x-small" variant="subtle">
                    <ev-icon :glyph="ChevronRightIcon" />
                    <ev-icon :glyph="HomeIcon" />
                </ev-button>
            </template>
            List Item Group
        </ev-list-item>


    </div>
</template>
