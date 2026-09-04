<script setup lang="ts">
import type { ContentDraft } from '@frontend/entities/content/model/types';
import CoreSectionsFields from '@frontend/entities/content/ui/CoreSectionsFields.vue';
import CustomSectionsEditor from '@frontend/entities/content/ui/CustomSectionsEditor.vue';
import FaqEditor from '@frontend/entities/content/ui/FaqEditor.vue';
import type { EditorSection } from '@frontend/widgets/content-workspace/model/navigation';

const draft = defineModel<ContentDraft>({ required: true });
defineProps<{ activeSection: EditorSection }>();
</script>

<template>
  <div class="editor">
    <CoreSectionsFields v-if="activeSection === 'core'" v-model="draft" />
    <FaqEditor v-else-if="activeSection === 'faq'" v-model="draft.faq" />
    <CustomSectionsEditor v-else v-model="draft.customSections" />
  </div>
</template>
