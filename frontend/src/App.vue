<script setup lang="ts">
import { computed } from 'vue';

import ContentManagementPage from '@frontend/pages/content-management/ui/ContentManagementPage.vue';
import OperationsDashboardPage from '@frontend/pages/operations-dashboard/ui/OperationsDashboardPage.vue';
import SetupPage from '@frontend/pages/setup/ui/SetupPage.vue';

const currentPage = computed(() => {
  if (window.location.pathname.startsWith('/ops')) {
    return OperationsDashboardPage;
  }
  if (window.location.pathname.startsWith('/setup')) {
    return SetupPage;
  }
  return ContentManagementPage;
});
</script>

<template>
  <component :is="currentPage" />
</template>
