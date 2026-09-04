<script setup lang="ts">
import type { FaqItem } from '@manage/entities/content/model/types';
import { moveItem } from '@manage/shared/lib/move-item';

const items = defineModel<FaqItem[]>({ required: true });

function add(): void {
  if (items.value.length < 20) {
    items.value.push({ answer: '', question: '' });
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
      <span>{{ items.length }} / 20</span>
    </div>
    <p>Вопросы показываются клиенту в этом порядке.</p>
    <p v-if="items.length === 0" class="empty">
      Вопросов пока нет. Клиенту предложат написать преподавателю.
    </p>
    <fieldset v-for="(item, index) in items" :key="index" class="item-card">
      <legend>Вопрос {{ index + 1 }}</legend>
      <label :for="`faq-question-${index}`">Вопрос</label>
      <input
        :id="`faq-question-${index}`"
        v-model="item.question"
        maxlength="300"
        required
      />
      <label :for="`faq-answer-${index}`">Ответ</label>
      <textarea
        :id="`faq-answer-${index}`"
        v-model="item.answer"
        maxlength="3000"
        required
        rows="4"
      />
      <div class="item-actions">
        <button
          :disabled="index === 0"
          type="button"
          @click="moveItem(items, index, -1)"
        >
          Выше
        </button>
        <button
          :disabled="index === items.length - 1"
          type="button"
          @click="moveItem(items, index, 1)"
        >
          Ниже
        </button>
        <button class="danger" type="button" @click="items.splice(index, 1)">
          Удалить
        </button>
      </div>
    </fieldset>
    <button :disabled="items.length >= 20" type="button" @click="add">
      Добавить вопрос
    </button>
  </section>
</template>
