<script setup lang="ts">
import type { ContentDraft } from '@manage/entities/content/model/types';

const draft = defineModel<ContentDraft>({ required: true });
</script>

<template>
  <section class="card">
    <p class="step">Основные разделы</p>
    <h2>Расписание, цены и адрес</h2>
    <label for="schedule">Расписание</label>
    <textarea
      id="schedule"
      v-model="draft.schedule"
      maxlength="4000"
      rows="5"
    />
    <p class="counter">{{ draft.schedule.length }} / 4000</p>
    <label for="prices">Цены</label>
    <textarea id="prices" v-model="draft.prices" maxlength="4000" rows="5" />
    <p class="counter">{{ draft.prices.length }} / 4000</p>
    <label for="address">Адрес</label>
    <textarea id="address" v-model="draft.address" maxlength="4000" rows="4" />
    <p class="counter">{{ draft.address.length }} / 4000</p>
  </section>
</template>
