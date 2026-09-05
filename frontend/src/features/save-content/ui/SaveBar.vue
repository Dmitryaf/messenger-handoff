<script setup lang="ts">
defineProps<{ dirty: boolean; saving: boolean }>();
defineEmits<{ save: [] }>();
</script>

<template>
  <div class="save-bar">
    <div>
      <span class="save-bar-label">Публикация</span>
      <p :class="{ changed: dirty }" role="status">
        {{ dirty ? 'Есть несохранённые изменения' : 'Все изменения сохранены' }}
      </p>
    </div>
    <button :disabled="saving || !dirty" type="button" @click="$emit('save')">
      {{ saving ? 'Сохраняем…' : 'Сохранить' }}
    </button>
  </div>
</template>
