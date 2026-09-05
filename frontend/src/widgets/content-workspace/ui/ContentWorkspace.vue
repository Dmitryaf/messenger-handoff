<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';

import SaveBar from '@frontend/features/save-content/ui/SaveBar.vue';
import ContentSummary from '@frontend/entities/content/ui/ContentSummary.vue';
import AsyncMessage from '@frontend/shared/ui/AsyncMessage.vue';
import AppIcon from '@frontend/shared/ui/AppIcon.vue';
import ChangeHistory from '@frontend/widgets/change-history/ui/ChangeHistory.vue';
import ContentEditor from '@frontend/widgets/content-editor/ui/ContentEditor.vue';
import ContentPreview from '@frontend/widgets/content-preview/ui/ContentPreview.vue';
import type { EditorSection, WorkspaceView } from '../model/navigation';
import { useContentWorkspace } from '../model/use-content-workspace';
import WorkspaceNavigation from './WorkspaceNavigation.vue';

const emit = defineEmits<{
  dirtyChange: [dirty: boolean];
  unauthorized: [];
}>();
const workspace = useContentWorkspace({
  onUnauthorized: () => emit('unauthorized'),
});
const activeView = ref<WorkspaceView>('edit');
const activeSection = ref<EditorSection>('core');

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
  <div
    v-else
    class="workspace"
    :class="{ 'workspace--editing': activeView === 'edit' }"
  >
    <header class="workspace-topbar">
      <div class="workspace-identity">
        <span class="workspace-mark"><AppIcon name="channel" /></span>
        <div>
          <strong>Messenger Handoff</strong>
          <small>Информация для клиентов</small>
        </div>
      </div>
      <span class="channel-badge">
        <span aria-hidden="true" />
        Telegram и VK
      </span>
    </header>

    <WorkspaceNavigation
      :active-section="activeSection"
      :active-view="activeView"
      @section-change="activeSection = $event"
      @view-change="activeView = $event"
    />

    <main class="workspace-panel">
      <ContentEditor
        v-if="activeView === 'edit'"
        v-model="workspace.draft"
        :active-section="activeSection"
      />
      <ContentPreview
        v-else-if="activeView === 'preview'"
        :content="workspace.draft"
      />
      <ChangeHistory
        v-else
        :changes="workspace.history.value"
        :has-unsaved-changes="workspace.dirty.value"
        :restoring="workspace.restoring.value"
        @restore="workspace.restore"
      />
    </main>

    <aside class="workspace-rail">
      <SaveBar
        :dirty="workspace.dirty.value"
        :saving="workspace.saving.value"
        @save="workspace.save"
      />
      <ContentSummary :content="workspace.draft" />
    </aside>
  </div>
</template>
