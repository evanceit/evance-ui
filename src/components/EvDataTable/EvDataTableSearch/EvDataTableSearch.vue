<script setup lang="ts">
import "./EvDataTableSearch.scss";
import { EvButton } from "@/components/EvButton";
import { EvCheckbox } from "@/components/EvCheckbox";
import { EvTextfield } from "@/components/EvTextfield";
import { ArrowUpIcon, FilterIcon, SearchIcon } from "@/icons";
import { makeEvDataTableSearchProps } from "./EvDataTableSearch.ts";

const props = defineProps({ ...makeEvDataTableSearchProps() });
</script>

<template>
    <div class="ev-data-table-search">
        <div v-if="props.selectable" class="ev-data-table-search--checkbox">
            <ev-checkbox />
        </div>
        <div class="ev-data-table-search--field">
            <ev-textfield
                rounded
                clearable
                appearance="subtle"
                size="small"
                placeholder="Search by reference or title"
                :icon-start="SearchIcon" />
        </div>
        <div class="ev-data-table-search--filter">
            <ev-button
                rounded
                size="small"
                variant="subtle"
                :icon="FilterIcon" />
        </div>
        <div class="ev-data-table-search--sort">
            <ev-button
                rounded
                size="small"
                variant="subtle"
                text="Recent"
                :icon-end="ArrowUpIcon" />
        </div>
    </div>
</template>
