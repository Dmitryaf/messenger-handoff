<script setup lang="ts">
import { computed } from 'vue';

import {
  formatFaqResponse,
  normalizeFaqItems,
} from '@frontend/entities/content/lib/client-response-preview';
import type { ContentDraft } from '@frontend/entities/content/model/types';
import SectionVisibilityControl from './SectionVisibilityControl.vue';

const draft = defineModel<ContentDraft>({ required: true });
const responseLength = computed(() =>
  draft.value.faq.length > 0
    ? formatFaqResponse(normalizeFaqItems(draft.value.faq)).length
    : 0,
);

function add(): void {
  if (draft.value.faq.length < 20) {
    draft.value.faq.push({ answer: '', question: '' });
  }
}
</script>

<template>
  <section class="card">
    <div class="section-heading">
      <div>
        <p class="step">Готовый раздел меню</p>
        <h2>Частые вопросы</h2>
      </div>
      <span>{{ draft.faq.length }} / 20</span>
    </div>
    <p>Вопросы показываются клиенту в этом порядке.</p>
    <p
      class="counter"
      :class="{ 'counter--error': responseLength > 4000 }"
      aria-live="polite"
    >
      Итоговый ответ: {{ responseLength }} / 4000
    </p>
    <SectionVisibilityControl
      v-model="draft.visibleSections"
      :content-present="draft.faq.length > 0"
      section="faq"
    />
    <p v-if="draft.faq.length === 0" class="empty">
      Вопросов пока нет. Клиенту предложат написать преподавателю.
    </p>
    <fieldset v-for="(item, index) in draft.faq" :key="index" class="item-card">
      <legend>Вопрос {{ index + 1 }}</legend>
      <label :for="`faq-question-${index}`">Вопрос</label>
      <input
        :id="`faq-question-${index}`"
        v-model="item.question"
        maxlength="300"
        required
      />
      <p class="counter">{{ item.question.length }} / 300</p>
      <label :for="`faq-answer-${index}`">Ответ</label>
      <textarea
        :id="`faq-answer-${index}`"
        v-model="item.answer"
        maxlength="3000"
        required
        rows="4"
      />
      <p class="counter">{{ item.answer.length }} / 3000</p>
      <div class="item-actions">
        <button
          class="danger"
          type="button"
          @click="draft.faq.splice(index, 1)"
        >
          Удалить
        </button>
      </div>
    </fieldset>
    <button :disabled="draft.faq.length >= 20" type="button" @click="add">
      Добавить вопрос
    </button>
  </section>
</template>
