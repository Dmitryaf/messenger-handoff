<script setup lang="ts">
import { ref } from 'vue';

import { useManagementSession } from '@manage/features/authenticate/model/use-management-session';
import LoginForm from '@manage/features/authenticate/ui/LoginForm.vue';
import AsyncMessage from '@manage/shared/ui/AsyncMessage.vue';
import ContentWorkspace from '@manage/widgets/content-workspace/ui/ContentWorkspace.vue';

const session = useManagementSession();
const hasUnsavedChanges = ref(false);

async function logOut(): Promise<void> {
  if (
    hasUnsavedChanges.value &&
    !window.confirm('Выйти без сохранения изменений?')
  ) {
    return;
  }
  await session.endSession();
}
</script>

<template>
  <div class="shell">
    <header class="hero">
      <div>
        <p class="eyebrow">Messenger Handoff</p>
        <h1>Информация для клиентов</h1>
        <p>Обновите ответы, которые клиенты видят в Telegram и VK.</p>
      </div>
      <button
        v-if="session.authenticated.value"
        class="quiet"
        type="button"
        @click="logOut"
      >
        Выйти
      </button>
    </header>

    <p v-if="session.booting.value" class="state-card" role="status">
      Открываем редактор…
    </p>
    <main v-else>
      <AsyncMessage kind="error" :text="session.error.value" />
      <LoginForm
        v-if="!session.authenticated.value"
        :pending="session.pending.value"
        @submit="session.authenticate"
      />
      <ContentWorkspace
        v-else
        @dirty-change="hasUnsavedChanges = $event"
        @unauthorized="session.expireSession"
      />
    </main>
  </div>
</template>
