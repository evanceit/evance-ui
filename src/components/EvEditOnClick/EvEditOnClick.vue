<script setup lang="ts">
import "./EvEditOnClick.scss";
import { makeEvEditOnClickProps } from "./EvEditOnClick";
import { useModelProxy } from "@/composables/modelProxy";
import { computed, ref, watch } from "vue";
import { EvButton } from "@/components/EvButton";
import { EvButtonGroup } from "@/components/EvButtonGroup";
import { EvTextfield } from "@/components/EvTextfield";
import { EvSkeleton } from "@/components/EvSkeleton";
import { CancelIcon, CheckIcon, DangerIcon } from "@/icons";
import { filterComponentProps, omit } from "@/util";
import { useLocaleFunctions } from "@/composables";
import { FormField } from "@/modules/Form/FormField";

const props = defineProps({ ...makeEvEditOnClickProps() });
const slots = defineSlots<{
    field(props: {
        confirm: () => void;
        cancel: () => void;
        value: any;
        updateValue: (value: any) => void;
        error: boolean;
    }): never;
    default(): never;
    loading(): never;
    placeholder(): never;
}>();
const emit = defineEmits<{
    (e: "update:editing", value: boolean): void;
    (e: "update:loading", value: boolean): void;
    (e: "update:modelValue", value: any): void;
    (e: "confirmed", value: any): void;
    (e: "cancel"): void;
    (e: "error", error: unknown): void;
}>();
const { t } = useLocaleFunctions();
const isEditing = useModelProxy(props, "editing");
const isLoading = useModelProxy(props, "loading");
const modelValue = useModelProxy(props, "modelValue");
const editableValue = ref(props.modelValue);
const overlayRef = ref();
const clickableRef = ref<HTMLElement | null>(null);
const editableRef = ref<HTMLElement | null>(null);
const containerRef = ref<HTMLElement | null>(null);
const clickOutsideDirectiveArgs = computed(() => {
    return {
        handler: onClickOutside,
        condition: clickOutsideCondition,
        include: () => [overlayRef.value?.contentEl],
    };
});
const showButtons = computed(() => {
    return (
        isEditing.value &&
        (!props.hideActions || errors.value) &&
        !isLoading.value
    );
});
const errors = ref<string[] | undefined>(undefined);
const error = computed(() => !!errors.value);
const isEmptyValue = computed(() => {
    return (
        modelValue.value === null ||
        modelValue.value === undefined ||
        modelValue.value === ""
    );
});

const textfieldProps = computed(() => {
    return omit(filterComponentProps(EvTextfield, props), [
        "modelValue",
        "appearance",
        "rounded",
        "shapers",
        "validators",
    ]);
});

const formFieldProps = {
    ...props,
    modelValue: editableValue,
};
const formField = new FormField(null, formFieldProps);

watch(modelValue, () => {
    editableValue.value = modelValue.value;
});

function clickOutsideCondition(): boolean {
    return !props.persistent;
}

function onClickOutside() {
    cancel();
}

function cancel() {
    editableValue.value = modelValue.value;
    isEditing.value = false;
    emit("cancel");
}

function onOverlayLeave() {
    errors.value = undefined;
}

function onClick() {
    if (props.disabled) {
        return;
    }
    isEditing.value = true;
    requestAnimationFrame(() => {
        const input = editableRef.value.querySelector(
            "input, select, textarea",
        ) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null;
        input?.focus();
    });
}

async function confirm() {
    if (isLoading.value) {
        return;
    }

    const fieldErrors = await formField.validate();
    if (fieldErrors.length > 0) {
        errors.value = fieldErrors;
        return;
    }

    const nextValue = editableValue.value;
    const previousValue = modelValue.value;

    if (!props.onConfirm) {
        modelValue.value = nextValue;
        isEditing.value = false;
        emit("confirmed", modelValue.value);
        return;
    }

    try {
        isLoading.value = true;

        const result = await props.onConfirm({
            value: nextValue,
            previousValue,
            confirm: () => {
                modelValue.value = editableValue.value;
                isEditing.value = false;
                emit("confirmed", modelValue.value);
            },
            cancel,
        });

        if (result === false) {
            return;
        }

        if (result && typeof result === "object") {
            if (!result.valid) {
                errors.value = result.errors ?? undefined;
                return;
            }
            if ("value" in result) {
                modelValue.value = result.value;
            } else {
                modelValue.value = nextValue;
            }
            isEditing.value = false;
            emit("confirmed", modelValue.value);
            return;
        }

        modelValue.value = nextValue;
        isEditing.value = false;
        emit("confirmed", modelValue.value);
    } catch (error) {
        errors.value = normalizeConfirmError(error);
        emit("error", error);
    } finally {
        isLoading.value = false;
    }
}

function normalizeConfirmError(error: unknown): string[] {
    if (Array.isArray(error)) {
        return error.map(String);
    }
    if (error instanceof Error) {
        return [error.message];
    }
    if (typeof error === "string") {
        return [error];
    }
    return ["An unknown error occurred."];
}
</script>

<template>
    <div
        ref="containerRef"
        :class="[
            'ev-edit-on-click',
            {
                'is-editing': isEditing,
                'is-loading': isLoading,
                'is-disabled': props.disabled,
            },
            props.class,
        ]"
        :style="props.style"
        v-click-outside="clickOutsideDirectiveArgs">
        <div
            v-if="isEditing"
            ref="editableRef"
            class="ev-edit-on-click--editable">
            <slot
                name="field"
                v-bind="{
                    confirm,
                    cancel,
                    value: editableValue,
                    updateValue: (value) => (editableValue = value),
                    error,
                }">
                <ev-textfield
                    v-model="editableValue"
                    v-bind="textfieldProps"
                    :error="error"
                    @keyup.enter="confirm"
                    @keyup.esc="cancel" />
            </slot>
        </div>
        <div
            v-else
            ref="clickableRef"
            role="button"
            class="ev-edit-on-click--clickable"
            :tabindex="props.disabled ? -1 : 0"
            @click="onClick"
            @keyup.enter="onClick">
            <slot v-if="!isEmptyValue" name="default">{{ modelValue }}</slot>
            <slot v-else name="placeholder">
                <ev-text appearance="subtle" :text="props.placeholder" />
            </slot>
        </div>
        <div v-if="isLoading" class="ev-edit-on-click--loading">
            <slot name="loading">
                <ev-skeleton type="text" width="100%" />
            </slot>
        </div>
    </div>

    <ev-overlay
        ref="overlayRef"
        :target="containerRef"
        :model-value="showButtons"
        :veil="false"
        :persistent="true"
        :min-width="0"
        :max-width="400"
        :open-delay="200"
        position="bottom end"
        position-strategy="connected"
        scroll-strategy="reposition"
        offset="8"
        :close-on-back="true"
        :disable-global-stack="true"
        :close-on-content-click="false"
        @after-leave="onOverlayLeave">
        <ev-surface
            class="ev-edit-on-click--buttons pa-50"
            elevation="overlay"
            rounded="small">
            <template v-if="error">
                <div class="ev-edit-on-click--errors">
                    <ev-icon :glyph="DangerIcon" appearance="danger" />
                    <ev-errors :messages="errors" />
                </div>
                <ev-divider vertical />
            </template>
            <ev-button-group size="small" variant="subtle">
                <ev-button
                    :aria-label="t('action.cancel')"
                    :icon="CancelIcon"
                    @click="cancel" />
                <ev-button
                    :aria-label="t('action.confirm')"
                    :icon="CheckIcon"
                    @click="confirm" />
            </ev-button-group>
        </ev-surface>
    </ev-overlay>
</template>
