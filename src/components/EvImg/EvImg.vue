<script setup lang="ts">
/**
 * `<ev-img>`
 */
import {EvResponsive, makeEvImgProps} from "@/components";
import {computed} from "vue";

const props = defineProps(makeEvImgProps());


const objectFitClasses = computed(() => {
    return {
        'is-object-cover': props.cover,
        'is-object-contain': !props.cover
    };
});

</script>
<template>
    <ev-responsive
        :class="[
            'ev-img',
            objectFitClasses
        ]"
        :style="{
            objectPosition: props.position
        }"
    >
        <img
            :class="[
                'ev-img--native'
            ]"
            :alt="props.alt"
        />
    </ev-responsive>
</template>