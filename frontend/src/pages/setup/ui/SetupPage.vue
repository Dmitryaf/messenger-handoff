<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { readSetupStatus } from '@frontend/entities/setup/api/setup-api';
import type { SetupStatus } from '@frontend/entities/setup/model/types';
import BackupCard from '@frontend/features/create-backup/ui/BackupCard.vue';
import DeliveryStatusCard from '@frontend/features/manage-deliveries/ui/DeliveryStatusCard.vue';
import TelegramSetupCard from '@frontend/features/setup-telegram/ui/TelegramSetupCard.vue';
import VkSetupCard from '@frontend/features/setup-vk/ui/VkSetupCard.vue';
import { errorMessage } from '@frontend/shared/lib/error-message';

const status = ref<SetupStatus>();
const error = ref('');

onMounted(async () => {
  try {
    status.value = await readSetupStatus();
  } catch (cause: unknown) {
    error.value = errorMessage(cause);
  }
});

function markTelegramConnected(): void {
  if (status.value) {
    status.value.connected = true;
    status.value.locked = true;
    status.value.source = 'local';
  }
}

function markVkConnected(): void {
  if (status.value) {
    status.value.vk.connected = true;
    status.value.vk.locked = true;
    status.value.vk.source = 'local';
  }
}
</script>

<template>
  <main class="setup-shell">
    <header class="setup-header">
      <p class="eyebrow">Messenger Handoff</p>
      <h1>Настройка сервиса</h1>
      <p class="page-intro">
        Подключите каналы и проверьте техническое состояние локального сервиса.
      </p>
    </header>

    <p v-if="error" class="message message--error" role="alert">
      {{ error }}
    </p>
    <p v-else-if="!status" class="state-card" role="status">
      Проверяем подключения…
    </p>
    <div v-else class="setup-workspace">
      <div class="setup-channel-grid">
        <TelegramSetupCard
          :status="status"
          @connected="markTelegramConnected"
        />
        <VkSetupCard
          :status="status.vk"
          :telegram-connected="status.connected"
          @connected="markVkConnected"
        />
      </div>
      <div class="setup-service-grid">
        <DeliveryStatusCard />
        <BackupCard />
      </div>
    </div>
  </main>
</template>
