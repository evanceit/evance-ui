<script setup lang="ts">
/**
 * # EvOverlay
 */
import './EvOverlay.scss';
import {makeEvOverlayProps} from "./EvOverlay.ts";
import {useModelProxy} from "../../composables/modelProxy.ts";
import {computed, ref, shallowRef, watch} from "vue";
import {useTeleport} from "../../composables/teleport.ts";

defineOptions({
    inheritAttrs: false
});

// Emit
const emit = defineEmits([
    'click:outside',
    'update:modelValue'
]);

const props = defineProps(makeEvOverlayProps());
const model = useModelProxy(props, 'modelValue');
const container = ref<HTMLElement | null>(null);
const content = ref<HTMLElement | null>(null);
const isActive = computed({
    get: () => model.value,
    set: (value) => {
        if (!(value && props.disabled)) {
            model.value = value;
        }
    }
});
const teleportTarget = useTeleport(computed(() => {
    return (props.attach || props.contained);
}));

/**
 * When disabled update the model value via the isActive computed prop
 */
watch(() => props.disabled, (value) => {
    if (value) {
        isActive.value = false;
    }
});

function isShowVeil(): boolean {
    return (isActive.value && !!props.veil);
}

function onClickOutside(e: MouseEvent) {
    emit('click:outside', e);
    // @todo: persistent overlays
    isActive.value = false;
}

const isBooted = shallowRef(false);
const hasContent = computed(() => {
    return (isBooted.value || isActive.value);
});

watch(isActive, () => {
    isBooted.value = true;
});

function onAfterLeave(e) {
    isBooted.value = false;
}

</script>
<template>
    <teleport
        v-if="hasContent"
        :disabled="!teleportTarget"
        :to="teleportTarget">
        <div
            ref="container"
            class="ev-overlay"
        >
            <transition appear
                        name="transition-fade">
                <div v-if="isShowVeil()" class="ev-overlay--veil"></div>
            </transition>

            <transition appear
                        name="transition-fade"
                        @after-leave="onAfterLeave">
                <div
                    ref="content"
                    class="ev-overlay--content"
                    v-show="isActive"
                    v-click-outside="onClickOutside"
                >
                    <slot />
                </div>
            </transition>

        </div>
    </teleport>
</template>