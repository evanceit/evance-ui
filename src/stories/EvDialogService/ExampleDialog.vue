<script setup lang="ts">
import {useDialog} from "@/composables/dialog.ts";
import {EvButton} from "@/components";
import ExampleDialog from "@/stories/EvDialogService/ExampleDialog.vue";

const dialog = useDialog();

function open() {
    dialog.open({
        slots: {
            default: ExampleDialog
        }
    });
}
</script>
<template>
    <h3>
        Example Dialog
    </h3>
    <p>
        This is an example dialog component.
    </p>
    <ev-button @click="open">Open another</ev-button>
</template>