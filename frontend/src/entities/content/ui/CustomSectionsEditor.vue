<script setup lang="ts">
import type { CustomSection } from '@frontend/entities/content/model/types';

const sections = defineModel<CustomSection[]>({ required: true });

function add(): void {
  if (sections.value.length < 6) {
    sections.value.push({ label: '', text: '' });
  }
}
</script>

<template>
  <section class="card">
    <div class="section-heading">
      <div>
        <p class="step">Свои кнопки</p>
        <h2>Дополнительные разделы</h2>
      </div>
      <span>{{ sections.length }} / 6</span>
    </div>
    <p v-if="sections.length === 0" class="empty">
      Дополнительных разделов пока нет.
    </p>
    <fieldset
      v-for="(section, index) in sections"
      :key="index"
      class="item-card"
    >
      <legend>Раздел {{ index + 1 }}</legend>
      <label :for="`section-label-${index}`">Название кнопки</label>
      <input
        :id="`section-label-${index}`"
        v-model="section.label"
        maxlength="40"
        required
      />
      <label :for="`section-text-${index}`">Текст для клиента</label>
      <textarea
        :id="`section-text-${index}`"
        v-model="section.text"
        maxlength="4000"
        required
        rows="4"
      />
      <div class="item-actions">
        <button class="danger" type="button" @click="sections.splice(index, 1)">
          Удалить раздел
        </button>
      </div>
    </fieldset>
    <button :disabled="sections.length >= 6" type="button" @click="add">
      Добавить раздел
    </button>
  </section>
</template>
