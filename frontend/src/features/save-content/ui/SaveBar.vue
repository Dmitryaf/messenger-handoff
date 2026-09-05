<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  dirty: boolean;
  saving: boolean;
  validationMessage: string;
  valid: boolean;
}>();
defineEmits<{ save: [] }>();

const statusMessage = computed(() => {
  if (props.validationMessage) {
    return props.validationMessage;
  }
  if (props.dirty) {
    return 'Есть несохранённые изменения';
  }
  return 'Все изменения сохранены';
});
</script>

<template>
  <div class="save-bar">
    <div>
      <span class="save-bar-label">Публикация</span>
      <p :class="{ changed: dirty }" role="status">
        {{ statusMessage }}
      </p>
    </div>
    <button
      :disabled="saving || !dirty || !valid"
      type="button"
      @click="$emit('save')"
    >
      {{ saving ? 'Сохраняем…' : 'Сохранить' }}
    </button>
  </div>
</template>
