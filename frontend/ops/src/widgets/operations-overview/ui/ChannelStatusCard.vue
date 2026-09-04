<script setup lang="ts">
import { computed } from 'vue';

import { connectionSourceLabel } from '@ops/entities/operations/lib/status-format';
import type { ChannelOperationsStatus } from '@ops/entities/operations/model/types';

const props = defineProps<{
  channel: ChannelOperationsStatus;
  name: string;
}>();

const state = computed(() => {
  if (!props.channel.configured) {
    return { label: 'Не настроен', tone: 'neutral' };
  }
  if (props.channel.running) {
    return { label: 'Запущен', tone: 'healthy' };
  }
  return { label: 'Остановлен', tone: 'attention' };
});
</script>

<template>
  <article class="status-card">
    <div class="status-card-heading">
      <h3>{{ name }}</h3>
      <span class="status-pill" :class="`status-pill--${state.tone}`">
        {{ state.label }}
      </span>
    </div>
    <p>{{ connectionSourceLabel(channel.source) }}</p>
  </article>
</template>
