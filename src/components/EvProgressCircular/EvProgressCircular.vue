<script setup lang="ts">
/**
 * # EvProgressCircular
 */
import './EvProgressCircular.scss';

</script>
<template>
    <div class="ev-progress-circular">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
            <circle class="ev-progress-circular--underlay" fill="transparent" cx="50%" cy="50%" r="20" stroke-width="7.058823529411765" stroke-dasharray="125.66370614359172" stroke-dashoffset="0"></circle>
            <circle class="ev-progress-circular--overlay" fill="transparent" cx="50%" cy="50%" r="20" stroke-width="7.058823529411765" stroke-dasharray="125.66370614359172" stroke-dashoffset="0px"></circle>
        </svg>
        <div class="ev-progress-circular--content">
            <slot />
        </div>
    </div>
</template>