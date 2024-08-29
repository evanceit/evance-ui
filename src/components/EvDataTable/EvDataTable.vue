<script setup lang="ts">
import "./EvDataTable.scss";
import { makeEvDataTableProps } from "./EvDataTable.ts";

const props = defineProps({ ...makeEvDataTableProps() });
const slots = defineSlots<{
    default(): never;
}>();

</script>

<template>
    <!-- @todo: <--- YOU ARE HERE! -->
    Before I do anything further I need to:
    <ul>
        <li>Check virtual scroll works for table rows</li>
        <li>Check infinite scroll works for the table</li>
        <li>See if I can get stick headers to work</li>
        <li>What happens with sticky headers on overflow</li>
    </ul>
    <div :class="['ev-data-table', props.class]" :style="props.style">
        <table :class="['ev-data-table--table']">
            <tbody role="rowgroup">
                <tr>
                    <td>Above</td>
                </tr>
                <tr v-for="item of props.items">
                    <td>{{ item.name }}</td>
                </tr>
                <tr>
                    <td>Below</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
