<script setup lang="ts">
/**
 * # EvButton
 */
import './EvButton.scss';
import {EvanceIcon} from '../../icons';
import {EvIcon} from '../EvIcon';
</script>
<template>
    <button class="ev-button">
        My Test Component
    </button>

    <ev-icon :glyph="EvanceIcon"></ev-icon>
</template>