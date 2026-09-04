<script setup lang="ts">
import { onBeforeUnmount, watch } from 'vue';

import { useOperationsSession } from '@ops/features/authenticate/model/use-operations-session';
import OperationsLoginForm from '@ops/features/authenticate/ui/OperationsLoginForm.vue';
import { useOperationsStatus } from '@ops/features/refresh-status/model/use-operations-status';
import OperationsOverview from '@ops/widgets/operations-overview/ui/OperationsOverview.vue';

const refreshIntervalMs = 30_000;
const session = useOperationsSession();
const operations = useOperationsStatus(session.expireSession);
let refreshTimer: ReturnType<typeof setInterval> | undefined;

watch(session.authenticated, (authenticated) => {
  stopAutomaticRefresh();
  if (!authenticated) {
    operations.clear();
    return;
  }

  void operations.refresh();
  refreshTimer = setInterval(() => {
    void operations.refresh();
  }, refreshIntervalMs);
});

onBeforeUnmount(stopAutomaticRefresh);

async function authenticate(password: string): Promise<void> {
  await session.authenticate(password);
}

async function logout(): Promise<void> {
  await session.endSession();
}

function stopAutomaticRefresh(): void {
  if (refreshTimer) {
    clearInterval(refreshTimer);
    refreshTimer = undefined;
  }
}
</script>

<template>
  <main class="page-shell">
    <header class="page-header">
      <div>
        <p class="brand">MESSENGER HANDOFF</p>
        <h1>Состояние сервиса</h1>
        <p class="page-intro">
          Проверяйте подключения и доставку ответов школы.
        </p>
      </div>
      <button
        v-if="session.authenticated.value"
        class="secondary-button"
        type="button"
        @click="logout"
      >
        Выйти
      </button>
    </header>

    <p v-if="session.error.value" class="message message--error" role="alert">
      {{ session.error.value }}
    </p>

    <section v-if="session.booting.value" class="card loading-card">
      <p>Проверяем доступ…</p>
    </section>

    <OperationsLoginForm
      v-else-if="!session.authenticated.value"
      :pending="session.pending.value"
      @submit="authenticate"
    />

    <template v-else>
      <div class="toolbar">
        <p>Состояние обновляется автоматически каждые 30 секунд.</p>
        <button
          class="secondary-button"
          :disabled="operations.loading.value"
          type="button"
          @click="operations.refresh"
        >
          {{ operations.loading.value ? 'Обновляем…' : 'Обновить' }}
        </button>
      </div>

      <p
        v-if="operations.error.value"
        class="message message--error"
        role="alert"
      >
        {{ operations.error.value }}
      </p>

      <OperationsOverview
        v-if="operations.status.value"
        :status="operations.status.value"
      />
      <section v-else class="card loading-card">
        <p>Получаем состояние сервиса…</p>
      </section>
    </template>
  </main>
</template>
