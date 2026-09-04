<script setup lang="ts">
defineProps<{ dirty: boolean; saving: boolean }>();
defineEmits<{ save: [] }>();
</script>

<template>
  <div class="save-bar">
    <p :class="{ changed: dirty }" role="status">
      {{ dirty ? 'Есть несохранённые изменения' : 'Все изменения сохранены' }}
    </p>
    <button :disabled="saving || !dirty" type="button" @click="$emit('save')">
      {{ saving ? 'Сохраняем…' : 'Сохранить' }}
    </button>
  </div>
</template>
