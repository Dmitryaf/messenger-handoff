<script setup lang="ts">
import type { ContentDraft } from '@frontend/entities/content/model/types';
import SectionVisibilityControl from '@frontend/entities/content/ui/SectionVisibilityControl.vue';

const draft = defineModel<ContentDraft>({ required: true });
</script>

<template>
  <section class="card">
    <p class="step">Основные разделы</p>
    <h2>Расписание, цены и адрес</h2>

    <details class="field-group" open>
      <summary>
        <strong>Расписание</strong>
        <small>{{
          draft.schedule.trim() ? 'Заполнено' : 'Не заполнено'
        }}</small>
      </summary>
      <label for="schedule">Текст для клиента</label>
      <textarea
        id="schedule"
        v-model="draft.schedule"
        maxlength="4000"
        rows="5"
      />
      <p class="counter">{{ draft.schedule.length }} / 4000</p>
      <SectionVisibilityControl
        v-model="draft.visibleSections"
        :content-present="Boolean(draft.schedule.trim())"
        section="schedule"
      />
    </details>

    <details class="field-group">
      <summary>
        <strong>Цены</strong>
        <small>{{ draft.prices.trim() ? 'Заполнено' : 'Не заполнено' }}</small>
      </summary>
      <label for="prices">Текст для клиента</label>
      <textarea id="prices" v-model="draft.prices" maxlength="4000" rows="5" />
      <p class="counter">{{ draft.prices.length }} / 4000</p>
      <SectionVisibilityControl
        v-model="draft.visibleSections"
        :content-present="Boolean(draft.prices.trim())"
        section="prices"
      />
    </details>

    <details class="field-group">
      <summary>
        <strong>Адрес</strong>
        <small>{{ draft.address.trim() ? 'Заполнено' : 'Не заполнено' }}</small>
      </summary>
      <label for="address">Текст для клиента</label>
      <textarea
        id="address"
        v-model="draft.address"
        maxlength="4000"
        rows="4"
      />
      <p class="counter">{{ draft.address.length }} / 4000</p>
      <SectionVisibilityControl
        v-model="draft.visibleSections"
        :content-present="Boolean(draft.address.trim())"
        section="address"
      />
    </details>
  </section>
</template>
