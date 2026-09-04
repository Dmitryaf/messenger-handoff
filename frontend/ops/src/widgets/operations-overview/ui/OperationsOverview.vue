<script setup lang="ts">
import { computed } from 'vue';

import { formatUptime } from '@ops/entities/operations/lib/status-format';
import type { OperationsStatus } from '@ops/entities/operations/model/types';
import ChannelStatusCard from './ChannelStatusCard.vue';

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
      <article class="status-card delivery-card">
        <div class="status-card-heading">
          <h3>Доставка ответов</h3>
          <span
            class="status-pill"
            :class="
              status.deliveries.failed > 0
                ? 'status-pill--attention'
                : 'status-pill--healthy'
            "
          >
            {{ status.deliveries.failed > 0 ? 'Есть ошибки' : 'Без ошибок' }}
          </span>
        </div>
        <dl class="delivery-facts">
          <div>
            <dt>Ожидают отправки</dt>
            <dd>{{ status.deliveries.pending }}</dd>
          </div>
          <div>
            <dt>Не доставлены</dt>
            <dd>{{ status.deliveries.failed }}</dd>
          </div>
        </dl>
      </article>
    </div>
  </section>
</template>
