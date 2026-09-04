<script setup lang="ts">
import { computed } from 'vue';

import { hasContent } from '@frontend/entities/content/model/content-draft';
import type { ContentDraft } from '@frontend/entities/content/model/types';

const props = defineProps<{ content: ContentDraft }>();
const visible = computed(() => hasContent(props.content));
</script>

<template>
  <section class="card preview" aria-labelledby="preview-title">
    <p class="step">Предпросмотр</p>
    <h2 id="preview-title">Что увидит клиент</h2>
    <p v-if="!visible" class="empty">
      Заполните разделы — здесь появится будущий ответ.
    </p>
    <template v-else>
      <div v-if="content.schedule.trim()">
        <h3>Расписание</h3>
        <p class="preserve">
          {{ content.schedule }}
        </p>
      </div>
      <div v-if="content.prices.trim()">
        <h3>Цены</h3>
        <p class="preserve">
          {{ content.prices }}
        </p>
      </div>
      <div v-if="content.address.trim()">
        <h3>Адрес</h3>
        <p class="preserve">
          {{ content.address }}
        </p>
      </div>
      <div v-if="content.faq.length">
        <h3>Частые вопросы</h3>
        <dl>
          <template v-for="(item, index) in content.faq" :key="index">
            <dt>{{ item.question || 'Вопрос без названия' }}</dt>
            <dd>{{ item.answer || 'Ответ ещё не заполнен' }}</dd>
          </template>
        </dl>
      </div>
      <div v-for="(section, index) in content.customSections" :key="index">
        <h3>{{ section.label || 'Раздел без названия' }}</h3>
        <p class="preserve">
          {{ section.text || 'Текст ещё не заполнен' }}
        </p>
      </div>
    </template>
  </section>
</template>
