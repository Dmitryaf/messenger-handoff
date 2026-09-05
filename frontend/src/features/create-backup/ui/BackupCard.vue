<script setup lang="ts">
import { ref } from 'vue';

import { createBackup } from '@frontend/entities/setup/api/setup-api';
import { errorMessage } from '@frontend/shared/lib/error-message';

const pending = ref(false);
const message = ref('Токены Telegram и VK в копию не входят.');

async function create(): Promise<void> {
  pending.value = true;
  message.value = 'Создаём и проверяем копию…';
  try {
    const result = await createBackup();
    message.value = `Резервная копия создана: ${result.fileName}.`;
  } catch (cause: unknown) {
    message.value = errorMessage(cause);
  } finally {
    pending.value = false;
  }
}
</script>

<template>
  <section class="setup-card card" aria-labelledby="backup-title">
    <p class="step">Данные</p>
    <h2 id="backup-title">Резервная копия</h2>
    <p class="setup-lead">
      Сохраните обращения и очередь доставки перед обновлением или переносом
      сервиса.
    </p>
    <button :disabled="pending" type="button" @click="create">
      {{ pending ? 'Создаём…' : 'Создать резервную копию' }}
    </button>
    <p class="setup-note" role="status">{{ message }}</p>
  </section>
</template>
