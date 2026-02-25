<script setup lang="ts">
import "./EvDialogFooter.scss";
import { makeEvDialogFooterProps } from "./EvDialogFooter";
import { computed } from "vue";
import { filterComponentProps } from "@/util";
import { EvCardActions } from "@/components/EvCard/EvCardActions";

const props = defineProps({ ...makeEvDialogFooterProps() });

const slots = defineSlots<{
    default(): never;
}>();

const cardActionsProps = computed(() => {
    return {
        ...filterComponentProps(EvCardActions, props),
        items: props.actions,
    };
});
</script>

<template>
    <footer v-if="slots.default" class="ev-dialog-footer">
        <slot name="default" />
    </footer>
    <ev-card-actions
        v-else
        v-bind="cardActionsProps"
        tag="footer"
        class="ev-dialog-footer" />
</template>
