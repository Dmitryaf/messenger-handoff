import { createApp } from 'vue';

import App from '@frontend/App.vue';
import '@frontend/app/styles/global.css';

document.title = window.location.pathname.startsWith('/ops')
  ? 'Состояние сервиса'
  : 'Информация для клиентов';

createApp(App).mount('#app');
