<script setup lang="ts">
import { computed } from 'vue';

import {
  formatAddressResponse,
  formatListResponse,
} from '@frontend/entities/content/lib/client-response-preview';
import type { ContentDraft } from '@frontend/entities/content/model/types';
import SectionVisibilityControl from '@frontend/entities/content/ui/SectionVisibilityControl.vue';

const draft = defineModel<ContentDraft>({ required: true });
const scheduleLength = computed(() =>
  draft.value.schedule.trim()
    ? formatListResponse('Расписание', draft.value.schedule).length
    : 0,
);
const pricesLength = computed(() =>
  draft.value.prices.trim()
    ? formatListResponse('Цены', draft.value.prices).length
    : 0,
);
const addressLength = computed(() =>
  draft.value.address.trim()
    ? formatAddressResponse(draft.value.address).length
    : 0,
);
</script>

<template>
  <section class="card">
    <p class="step">Основные разделы</p>
    <h2>Расписание, цены и адрес</h2>

    <details class="field-group" open>
      <summary>
        <span class="summary-copy">
          <strong>Расписание</strong>
          <span class="summary-action summary-action--open">
            Открыть настройки раздела
          </span>
          <span class="summary-action summary-action--close">
            Скрыть настройки раздела
          </span>
        </span>
        <span class="summary-meta">
          <small>{{
            draft.schedule.trim() ? 'Заполнено' : 'Не заполнено'
          }}</small>
          <span class="disclosure-chevron" aria-hidden="true" />
        </span>
      </summary>
      <label for="schedule">Текст для клиента</label>
      <textarea
        id="schedule"
        v-model="draft.schedule"
        maxlength="4000"
        rows="5"
      />
      <p class="counter" :class="{ 'counter--error': scheduleLength > 4000 }">
        Итоговый ответ: {{ scheduleLength }} / 4000
      </p>
      <SectionVisibilityControl
        v-model="draft.visibleSections"
        :content-present="Boolean(draft.schedule.trim())"
        section="schedule"
      />
    </details>

    <details class="field-group">
      <summary>
        <span class="summary-copy">
          <strong>Цены</strong>
          <span class="summary-action summary-action--open">
            Открыть настройки раздела
          </span>
          <span class="summary-action summary-action--close">
            Скрыть настройки раздела
          </span>
        </span>
        <span class="summary-meta">
          <small>{{
            draft.prices.trim() ? 'Заполнено' : 'Не заполнено'
          }}</small>
          <span class="disclosure-chevron" aria-hidden="true" />
        </span>
      </summary>
      <label for="prices">Текст для клиента</label>
      <textarea id="prices" v-model="draft.prices" maxlength="4000" rows="5" />
      <p class="counter" :class="{ 'counter--error': pricesLength > 4000 }">
        Итоговый ответ: {{ pricesLength }} / 4000
      </p>
      <SectionVisibilityControl
        v-model="draft.visibleSections"
        :content-present="Boolean(draft.prices.trim())"
        section="prices"
      />
    </details>

    <details class="field-group">
      <summary>
        <span class="summary-copy">
          <strong>Адрес</strong>
          <span class="summary-action summary-action--open">
            Открыть настройки раздела
          </span>
          <span class="summary-action summary-action--close">
            Скрыть настройки раздела
          </span>
        </span>
        <span class="summary-meta">
          <small>{{
            draft.address.trim() ? 'Заполнено' : 'Не заполнено'
          }}</small>
          <span class="disclosure-chevron" aria-hidden="true" />
        </span>
      </summary>
      <label for="address">Текст для клиента</label>
      <textarea
        id="address"
        v-model="draft.address"
        maxlength="4000"
        rows="4"
      />
      <p class="counter" :class="{ 'counter--error': addressLength > 4000 }">
        Итоговый ответ: {{ addressLength }} / 4000
      </p>
      <SectionVisibilityControl
        v-model="draft.visibleSections"
        :content-present="Boolean(draft.address.trim())"
        section="address"
      />
    </details>
  </section>
</template>
