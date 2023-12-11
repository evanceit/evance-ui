<script setup lang="ts">
import {injectDialog, useDialog} from "@/composables/dialog.ts";
import {EvButton} from "@/components";
import ExampleDialog from "@/stories/EvDialogService/ExampleDialog.vue";

const dialog = useDialog();
const dialogRef = injectDialog();

const data = {
    greeting: 'hello'
};

function open() {
    dialog.open({
        props: {
            width: 'small'
        },
        slots: {
            default: ExampleDialog
        },
        data
    }).then(response => {
        console.log('Hey, I got a response', response);
        console.log('Data', data);
    });
}

function save() {
    dialogRef.data.greeting = 'Goodbye';
    dialogRef?.close({
        saved: true
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
    <ev-button @click="save">Save</ev-button>
</template>