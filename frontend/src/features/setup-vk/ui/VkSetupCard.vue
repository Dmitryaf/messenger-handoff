<script setup lang="ts">
import { ref } from 'vue';

import { connectVk } from '@frontend/entities/setup/api/setup-api';
import type { ChannelSetupStatus } from '@frontend/entities/setup/model/types';
import { errorMessage } from '@frontend/shared/lib/error-message';

const props = defineProps<{
  status: ChannelSetupStatus;
  telegramConnected: boolean;
}>();
const emit = defineEmits<{ connected: [] }>();
const community = ref('');
const accessToken = ref('');
const message = ref('Выполните шаги и подключите сообщество.');
const pending = ref(false);

async function connect(): Promise<void> {
  pending.value = true;
  try {
    await connectVk(accessToken.value.trim(), community.value.trim());
    accessToken.value = '';
    message.value = 'VK подключён. Настройка сохранена.';
    emit('connected');
  } catch (cause: unknown) {
    message.value = errorMessage(cause);
  } finally {
    pending.value = false;
  }
}
</script>

<template>
  <section class="setup-card card" aria-labelledby="vk-setup-title">
    <p class="step">Шаг 2</p>
    <h2 id="vk-setup-title">Подключение VK</h2>
    <p v-if="status.connected" class="setup-status setup-status--success">
      VK подключён.
    </p>
    <template v-else>
      <ol class="setup-steps">
        <li>Включите «Возможности ботов» в настройках сообщений.</li>
        <li>В разделе «Работа с API» включите Long Poll API.</li>
        <li>Отметьте событие «Входящие сообщения».</li>
        <li>Создайте ключ сообщества с правом работы с сообщениями.</li>
      </ol>
      <p v-if="!telegramConnected" class="setup-status">
        Сначала подключите Telegram для операторов.
      </p>
      <p v-else-if="status.locked" class="setup-status">
        Подключение управляется настройками сервера.
      </p>
      <form v-else class="setup-form" @submit.prevent="connect">
        <label for="vk-community">Ссылка на сообщество</label>
        <input
          id="vk-community"
          v-model="community"
          placeholder="https://vk.com/your_community"
          required
          type="text"
        />
        <label for="vk-token">Ключ доступа сообщества</label>
        <input
          id="vk-token"
          v-model="accessToken"
          autocomplete="off"
          required
          type="password"
        />
        <button
          :disabled="pending || accessToken.trim().length < 20"
          type="submit"
        >
          {{ pending ? 'Подключаем…' : 'Подключить VK' }}
        </button>
        <p class="setup-status" role="status">{{ message }}</p>
      </form>
    </template>
  </section>
</template>
