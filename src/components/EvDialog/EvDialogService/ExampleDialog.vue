<script setup lang="ts">
import { injectDialog, useDialog } from "@/composables/dialog";
import { EvButton } from "@/components";
import { defineAsyncComponent, MaybeRef, reactive } from "vue";
import { EvDialogFooter } from "@/components/EvDialog/EvDialogFooter";
import type ExampleDialog from "@/components/EvDialog/EvDialogService/ExampleDialog.vue";
import { useModelProxy } from "@/composables";
import { PlusIcon } from "@/icons";

const dialog = useDialog();
const dialogRef = injectDialog();

const data = reactive({
    greeting: "Hello, I am waiting for a response.",
});

const dynamicComponent = defineAsyncComponent<typeof ExampleDialog>(
    () => import("@/components/EvDialog/EvDialogService/ExampleDialog.vue"),
);

const props = defineProps<{
    number?: MaybeRef<number>;
}>();
const myNumber = useModelProxy(props, "number");

function open() {
    const props = reactive({
        width: "small",
    });

    dialog
        .open({
            props,
            slots: {
                default: dialog.slot(dynamicComponent, { number: myNumber }),
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

function incrementNumber() {
    myNumber.value = (myNumber.value ?? 0) + 1;
}
</script>

<template>
    <ev-dialog-body>
        <h3>Example Dialog #{{ dialogRef?.id }}</h3>
        <p>
            This is an example dialog component with an initial title waiting to be
            updated by a child dialog:
        </p>
        <ev-list-item>
            <template #prefix>
                <ev-code>greeting</ev-code>
            </template>
            <template #default>
                {{ data.greeting }}
            </template>
        </ev-list-item>
        <ev-list-item>
            <template #prefix>
                <ev-code>props.number</ev-code>
            </template>
            <template #default>
                {{ myNumber }}
            </template>
            <template #suffix>
                <ev-button
                    size="x-small"
                    :icon="PlusIcon"
                    @click="incrementNumber" />
            </template>
        </ev-list-item>
    </ev-dialog-body>
    <ev-dialog-footer>
        <ev-button @click="makeBigger">bigger</ev-button>
        <ev-button @click="open">Open another</ev-button>
        <ev-button v-if="dialogRef?.data" @click="save">Say Goodbye</ev-button>
    </ev-dialog-footer>
</template>
