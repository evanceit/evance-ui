<script setup lang="ts">
import { injectDialog, useDialog } from "@/composables/dialog";
import { EvButton } from "@/components";
import { defineAsyncComponent, reactive } from "vue";
import EvDialogFooter from "@/components/EvDialog/EvDialogFooter.vue";

const dialog = useDialog();
const dialogRef = injectDialog();

const data = reactive({
    greeting: "Hello, I am waiting for a resposne.",
});

const dynamicComponent = defineAsyncComponent(
    () => import("@/components/EvDialog/EvDialogService/ExampleDialog.vue"),
);

function open() {

    const props = reactive({
        width: "small",
    });

    dialog
        .open({
            props,
            slots: {
                default: dynamicComponent,
            },
            data,
        })
        .then((response) => {
            console.log("Hey, I got a response", response);
            console.log("Data", data);
        });
}

function save() {
    if (dialogRef) {
        dialogRef.data.greeting = `Goodbye from dialog #${dialogRef.id}`;
        dialogRef.close({
            saved: true,
        });
    }
}

function makeBigger() {
    if (dialogRef.props) {
        dialogRef.props.width = "large";
    }
}
</script>

<template>
    <h3>Example Dialog #{{ dialogRef?.id }}</h3>
    <p>
        This is an example dialog component with an initial title waiting to be
        updated by a child dialog:
    </p>
    <p>
        {{ data.greeting }}
    </p>
    <ev-dialog-footer>
        <ev-button @click="makeBigger">bigger</ev-button>
        <ev-button @click="open">Open another</ev-button>
        <ev-button v-if="dialogRef?.data" @click="save">Say Goodbye</ev-button>
    </ev-dialog-footer>
</template>
