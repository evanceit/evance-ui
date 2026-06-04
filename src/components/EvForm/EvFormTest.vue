<script setup lang="ts">
import { reactive, ref } from "vue";
import {
    EvButton,
    EvButtonGroup,
    EvForm,
    EvHeading,
    EvRadio,
    EvRadioGroup,
    EvTextfield,
} from "@/components";
import { PlusIcon, ReloadIcon } from "@/icons";
import { Validators } from "@/validation";

const data = reactive({
    user: {
        name: null,
        gender: "male",
    },
    attributes: [],
});

function addAttribute() {
    console.log("addAttribute");
    data.attributes.push({
        title: "",
    });
}

function removeAttribute(index) {
    data.attributes.splice(index, 1);
}

async function onSubmit($event) {
    const validation = await $event;
    if (validation.valid) {
        validation.addErrors([
            {
                name: "user[name]",
                message: "Error from server",
            },
            {
                name: "user[gender]",
                message: "Error from server",
            },
            {
                name: "user[expires]",
                message: "Error from server",
            },
            {
                name: "user[expires_time]",
                message: "Error from server",
            },
            {
                name: "user[rating]",
                message: "Error from server",
            },
            {
                name: "user[type]",
                message: "Error from server",
            },
        ]);
    }
}

const required = Validators.required();

const isValid = ref(null);
</script>

<template>
    '{{ isValid }}'
    <div class="pa-300">
        <ev-form
            v-slot="{ form }"
            v-model="isValid"
            v-model:data="data"
            @submit.prevent="onSubmit">
            <ev-textfield
                label="Username"
                name="user[name]"
                :validators="[required]"  />

            <ev-textfield
                v-for="(_, attributeIndex) in data.attributes"
                :key="attributeIndex"
                autofocus
                clearable
                label="Attribute title"
                :validators="[required]"
                :name="`attributes[${attributeIndex}][title]`"
                @click:clear="removeAttribute(attributeIndex)" />

            <ev-radio-group name="user[gender]" label="Gender">
                <ev-radio value="male" label="Male" />
                <ev-radio value="female" label="Female" />
            </ev-radio-group>

            <ev-date-field
                label="Expiry date"
                name="user[expires]"
                :validators="[required]" />

            <ev-time-field
                label="Expiry time"
                name="user[expires_time]"
                :validators="[required]" />

            <ev-number-field
                show-buttons
                align="center"
                label="Rating 1 to 5"
                name="user[rating]"
                :validators="[required]" />

            <ev-select
                label="Type"
                name="user[type]"
                :validators="[required]"
                :items="['', 'option 1', 'option 2']" />

            <ev-button-group class="mb-300">
                <ev-button
                    type="button"
                    :icon="PlusIcon"
                    text="Add attribute"
                    @click="addAttribute" />

                <ev-button type="reset" text="Reset" :icon="ReloadIcon" />

                <ev-button
                    type="button"
                    text="Reset validation"
                    :icon="ReloadIcon"
                    @click="() => form.resetValidation()" />

                <ev-button type="submit" text="Submit" appearance="primary" />
            </ev-button-group>
        </ev-form>

        <ev-heading text="Form data" />
        <pre>{{ data }}</pre>
    </div>
</template>
