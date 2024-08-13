<script setup lang="ts">
import "./EvToolbar.scss";
import { makeEvToolbarProps } from "./EvToolbar.ts";
import { EvButton } from "../EvButton";
import { EvIcon } from "../EvIcon";
import { EvTabs, EvTab } from "../EvTabs";
import { ArrowBackIcon, CancelIcon, DotIcon } from "@/icons";

const props = defineProps({
    ...makeEvToolbarProps(),
});

</script>

<template>
    <div class="ev-toolbar">
        <div class="ev-toolbar--section">
            <!-- back icon -->
            <ev-button
                rounded
                size="small"
                variant="subtle"
                :icon="ArrowBackIcon" />

            <ev-icon :glyph="DotIcon" />

            <div class="ev-toolbar--title">{{ title }}</div>

            <div class="ev-toolbar--start">
                <ev-tabs size="x-large">
                    <ev-tab>Tab 1</ev-tab>
                    <ev-tab>Tab 2</ev-tab>
                    <ev-tab>Tab 3</ev-tab>
                </ev-tabs>
            </div>
        </div>
        <div class="ev-toolbar--section">
            <div class="ev-toolbar--end">
                [end or actions]
            </div>

            <!-- close icon -->
            <ev-button
                rounded
                size="small"
                :icon="CancelIcon"
                variant="subtle" />
        </div>
    </div>
</template>
