<template>
    <button class="ev-button">
        My Test Component
    </button>

    <ev-icon :glyph="evance"></ev-icon>
</template>

<script setup lang="ts">
import './EvButton.scss';
import {evance} from '../../icons';
import {EvIcon} from '../EvIcon';
</script>