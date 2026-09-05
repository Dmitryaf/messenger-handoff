<script setup lang="ts">
import { computed } from 'vue';

import { formatUptime } from '@frontend/entities/operations/lib/status-format';
import type { OperationsStatus } from '@frontend/entities/operations/model/types';

const props = defineProps<{ deliveries: OperationsStatus['deliveries'] }>();

const state = computed(() => {
  if (props.deliveries.state === 'failed') {
    return { label: 'Есть ошибки', tone: 'attention' };
  }
  if (props.deliveries.state === 'stalled') {
    return { label: 'Обработчик остановлен', tone: 'attention' };
  }
  if (props.deliveries.state === 'backlog') {
    return { label: 'Очередь задерживается', tone: 'attention' };
  }
  return { label: 'Работает', tone: 'healthy' };
});
</script>

<template>
  <article class="status-card delivery-card">
    <div class="status-card-heading">
      <h3>Доставка ответов</h3>
      <span class="status-pill" :class="`status-pill--${state.tone}`">
        {{ state.label }}
      </span>
    </div>
    <dl class="delivery-facts">
      <div>
        <dt>Ожидают отправки</dt>
        <dd>{{ deliveries.pending }}</dd>
      </div>
      <div>
        <dt>Не доставлены</dt>
        <dd>{{ deliveries.failed }}</dd>
      </div>
      <div>
        <dt>Обработчик очереди</dt>
        <dd>{{ deliveries.worker.running ? 'Запущен' : 'Остановлен' }}</dd>
      </div>
      <div v-if="deliveries.oldestPendingAgeSeconds !== undefined">
        <dt>Самое старое ожидание</dt>
        <dd>{{ formatUptime(deliveries.oldestPendingAgeSeconds) }}</dd>
      </div>
    </dl>
  </article>
</template>
