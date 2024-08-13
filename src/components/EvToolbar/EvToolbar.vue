<script setup lang="ts">
import "./EvToolbar.scss";
import { makeEvToolbarProps } from "./EvToolbar.ts";
import { EvButton } from "../EvButton";
import { EvIcon } from "../EvIcon";
import { EvTabs, EvTab } from "../EvTabs";
import { ArrowBackIcon, CancelIcon } from "@/icons";

const props = defineProps({
    ...makeEvToolbarProps(),
});


</script>

<template>
    <div class="ev-toolbar">
        <div class="ev-toolbar--section-start">
            <div class="ev-toolbar--prefix">
                <div class="ev-toolbar--back">
                    <ev-button
                        rounded
                        size="small"
                        variant="subtle"
                        :icon="ArrowBackIcon" />
                </div>

                <div v-if="props.icon" class="ev-toolbar--icon">
                    <ev-icon :glyph="props.icon" />
                </div>

                <div v-if="props.title" class="ev-toolbar--title">
                    {{ props.title }}
                </div>
            </div>
            <div class="ev-toolbar--start">
                <!-- todo: tabs -->
                <ev-tabs size="x-large">
                    <ev-tab>Tab 1</ev-tab>
                    <ev-tab>Tab 2</ev-tab>
                    <ev-tab>Tab 3</ev-tab>
                </ev-tabs>
            </div>
        </div>
        <div class="ev-toolbar--section-end">
            <div class="ev-toolbar--end">
                <div class="ev-toolbar--actions">
                    <ev-button>Button 1</ev-button>
                    <ev-button>Button 2</ev-button>
                </div>
            </div>
            <div class="ev-toolbar--close">
                <ev-button
                    rounded
                    size="small"
                    :icon="CancelIcon"
                    variant="subtle" />
            </div>
        </div>
    </div>
</template>
