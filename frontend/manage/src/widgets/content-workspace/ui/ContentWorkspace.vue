<script setup lang="ts">
import { onMounted, watch } from 'vue';

import SaveBar from '@manage/features/save-content/ui/SaveBar.vue';
import AsyncMessage from '@manage/shared/ui/AsyncMessage.vue';
import ChangeHistory from '@manage/widgets/change-history/ui/ChangeHistory.vue';
import ContentEditor from '@manage/widgets/content-editor/ui/ContentEditor.vue';
import ContentPreview from '@manage/widgets/content-preview/ui/ContentPreview.vue';
import { useContentWorkspace } from '../model/use-content-workspace';

const emit = defineEmits<{
  dirtyChange: [dirty: boolean];
  unauthorized: [];
}>();
const workspace = useContentWorkspace({
  onUnauthorized: () => emit('unauthorized'),
});

onMounted(() => void workspace.load());
watch(workspace.dirty, (dirty) => emit('dirtyChange', dirty), {
  immediate: true,
});
</script>

<template>
  <AsyncMessage kind="error" :text="workspace.error.value" />
  <AsyncMessage kind="success" :text="workspace.notice.value" />
  <p v-if="workspace.loading.value" class="state-card" role="status">
    Загружаем информацию…
  </p>
  <div v-else class="workspace">
    <div>
      <ContentEditor v-model="workspace.draft" />
      <SaveBar
        :dirty="workspace.dirty.value"
        :saving="workspace.saving.value"
        @save="workspace.save"
      />
    </div>
    <aside class="side-column">
      <ContentPreview :content="workspace.draft" />
      <ChangeHistory
        :changes="workspace.history.value"
        :restoring="workspace.restoring.value"
        @restore="workspace.restore"
      />
    </aside>
  </div>
</template>
