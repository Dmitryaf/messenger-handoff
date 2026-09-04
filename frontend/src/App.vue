<script setup lang="ts">
import { computed } from 'vue';

import ContentManagementPage from '@frontend/pages/content-management/ui/ContentManagementPage.vue';
import OperationsDashboardPage from '@frontend/pages/operations-dashboard/ui/OperationsDashboardPage.vue';

const currentPage = computed(() => {
  if (window.location.pathname.startsWith('/ops')) {
    return OperationsDashboardPage;
  }
  return ContentManagementPage;
});
</script>

<template>
  <component :is="currentPage" />
</template>
