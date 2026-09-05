import { onBeforeUnmount, onMounted, type Ref } from 'vue';

export function useUnsavedExitGuard(dirty: Readonly<Ref<boolean>>): void {
  const preventUnsavedExit = (event: BeforeUnloadEvent): void => {
    if (dirty.value) {
      event.preventDefault();
    }
  };

  onMounted(() => window.addEventListener('beforeunload', preventUnsavedExit));
  onBeforeUnmount(() =>
    window.removeEventListener('beforeunload', preventUnsavedExit),
  );
}
