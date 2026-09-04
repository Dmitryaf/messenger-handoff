<script setup lang="ts">
defineProps<{
  kind: 'error' | 'success';
  text: string;
}>();
</script>

<template>
  <p
    v-if="text"
    class="message"
    :class="kind"
    :role="kind === 'error' ? 'alert' : 'status'"
  >
    {{ text }}
  </p>
</template>
