<script setup lang="ts">
import { computed } from 'vue';

import { formatUptime } from '@frontend/entities/operations/lib/status-format';
import type { OperationsStatus } from '@frontend/entities/operations/model/types';
import ChannelStatusCard from './ChannelStatusCard.vue';
import DeliveryStatusCard from './DeliveryStatusCard.vue';

const props = defineProps<{ status: OperationsStatus }>();

const observedAt = computed(() =>
  new Intl.DateTimeFormat('ru-RU', {
    dateStyle: 'short',
    timeStyle: 'medium',
  }).format(new Date(props.status.observedAt)),
);
</script>

<template>
  <section class="overview" aria-labelledby="overview-title">
    <article
      class="summary-card card"
      :class="{ 'summary-card--attention': status.state === 'attention' }"
    >
      <div>
        <p class="eyebrow">Общее состояние</p>
        <h2 id="overview-title">
          {{
            status.state === 'healthy' ? 'Сервис работает' : 'Нужно проверить'
          }}
        </h2>
      </div>
      <dl class="summary-facts">
        <div>
          <dt>Работает без перезапуска</dt>
          <dd>{{ formatUptime(status.uptimeSeconds) }}</dd>
        </div>
        <div>
          <dt>Данные обновлены</dt>
          <dd>{{ observedAt }}</dd>
        </div>
      </dl>
    </article>

    <div class="status-grid">
      <ChannelStatusCard name="Telegram" :channel="status.channels.telegram" />
      <ChannelStatusCard name="VK" :channel="status.channels.vk" />
      <DeliveryStatusCard :deliveries="status.deliveries" />
    </div>
  </section>
</template>
