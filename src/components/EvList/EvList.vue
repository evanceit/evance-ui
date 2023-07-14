<script setup lang="ts">

import './EvList.scss';
import {makeEvListProps} from "./EvList.props.ts";
import EvListItem from "../EvListItem/EvListItem.vue";
import {getPropertyValue} from "../../util";

const props = defineProps(makeEvListProps());


const data = [
    {
        title: 'Example 1',
        value: 1
    },
    {
        title: 'Example 2',
        value: 2
    },
    {
        title: 'Example 3',
        value: 3
    }
];

console.log(getPropertyValue(data, '0.title', 1));


</script>
<template>
    <div class="ev-list"
         :class="[
             {
                 'is-disabled': props.disabled
             }
         ]"
    >
        <ev-list-item
            v-for="item in data"
            v-bind="item"
        ></ev-list-item>
    </div>
</template>