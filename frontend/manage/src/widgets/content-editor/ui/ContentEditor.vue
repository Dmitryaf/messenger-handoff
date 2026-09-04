<script setup lang="ts">
import type { ContentDraft } from '@manage/entities/content/model/types';
import CoreSectionsFields from '@manage/entities/content/ui/CoreSectionsFields.vue';
import CustomSectionsEditor from '@manage/entities/content/ui/CustomSectionsEditor.vue';
import FaqEditor from '@manage/entities/content/ui/FaqEditor.vue';

const draft = defineModel<ContentDraft>({ required: true });
</script>

<template>
  <div class="editor">
    <CoreSectionsFields v-model="draft" />
    <FaqEditor v-model="draft.faq" />
    <CustomSectionsEditor v-model="draft.customSections" />
  </div>
</template>
