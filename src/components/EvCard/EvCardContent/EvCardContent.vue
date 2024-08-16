<script setup lang="ts">
import "./EvCardContent.scss";
import { makeEvCardContentProps } from "./EvCardContent.ts";
import { EvHeading } from "@/components/EvHeading";
import { EvText } from "@/components/EvText";


const props = defineProps({ ...makeEvCardContentProps() });
</script>

<template>
    <div class="ev-card-content">
        <ev-heading :text="props.title"></ev-heading>
        <ev-text>This is a description</ev-text>
    </div>
</template>
