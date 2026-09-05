<script setup lang="ts">
import { onBeforeUnmount, watch } from 'vue';

import { useOperationsSession } from '@frontend/features/operations-auth/model/use-operations-session';
import OperationsLoginForm from '@frontend/features/operations-auth/ui/OperationsLoginForm.vue';
import ClientIntakeControl from '@frontend/features/control-client-intake/ui/ClientIntakeControl.vue';
import { useOperationsStatus } from '@frontend/features/refresh-status/model/use-operations-status';
import OperationsOverview from '@frontend/widgets/operations-overview/ui/OperationsOverview.vue';

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
  <main class="ops-shell">
    <header class="ops-header">
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

    <section v-if="session.booting.value" class="card loading-card">
      <p>Проверяем доступ…</p>
    </section>

    <section v-else-if="!session.authenticated.value" class="auth-panel">
      <div class="auth-stack">
        <p
          v-if="session.error.value"
          class="message message--error"
          role="alert"
        >
          {{ session.error.value }}
        </p>
        <OperationsLoginForm
          :pending="session.pending.value"
          @submit="authenticate"
        />
      </div>
    </section>

    <section v-else class="ops-workspace">
      <p v-if="session.error.value" class="message message--error" role="alert">
        {{ session.error.value }}
      </p>
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

      <ClientIntakeControl
        scope="ops"
        @changed="operations.refresh"
        @unauthorized="session.expireSession"
      />

      <OperationsOverview
        v-if="operations.status.value"
        :status="operations.status.value"
      />
      <section v-else class="card loading-card">
        <p>Получаем состояние сервиса…</p>
      </section>
    </section>
  </main>
</template>
