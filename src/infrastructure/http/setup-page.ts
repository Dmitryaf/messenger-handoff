export const setupPageHtml = `<!doctype html>
<html lang='ru'>
  <head>
    <meta charset='utf-8'>
    <meta name='viewport' content='width=device-width,initial-scale=1'>
    <title>Messenger Handoff</title>
    <link rel='stylesheet' href='/setup/style.css'>
  </head>
  <body>
    <main>
      <h1>Messenger Handoff</h1>
      <section>
        <h2>Подключение Telegram</h2>
        <div id='wizard' hidden>
          <ol>
            <li>Создайте закрытую группу и включите темы.</li>
            <li>Добавьте бота администратором с правом управлять темами.</li>
            <li>Напишите в группе любое сообщение.</li>
          </ol>
          <label>Токен от @BotFather <input id='token' type='password'></label>
          <button id='discover'>Найти группы</button>
          <div id='chats'></div>
          <button id='connect' hidden>Подключить</button>
        </div>
        <p id='status'>Проверяем состояние…</p>
      </section>
      <section aria-labelledby='vk-title'>
        <h2 id='vk-title'>Подключение VK</h2>
        <div id='vk-wizard' hidden>
          <ol>
            <li>Откройте «Сообщения → Настройки для бота» и включите «Возможности ботов».</li>
            <li>В разделе «Работа с API» включите Long Poll API.</li>
            <li>В событиях Long Poll отметьте «Входящие сообщения».</li>
            <li>Создайте ключ доступа сообщества с правом работы с сообщениями.</li>
          </ol>
          <label>Ссылка на сообщество <input id='vk-community' type='text' placeholder='https://vk.com/your_community'></label>
          <label>Ключ доступа сообщества <input id='vk-token' type='password'></label>
          <button id='vk-connect'>Подключить VK</button>
        </div>
        <p id='vk-status'>Проверяем состояние…</p>
      </section>
      <section aria-labelledby='content-title'>
        <h2 id='content-title'>Информация для клиентов</h2>
        <p>Эти ответы одинаково отображаются в Telegram и VK. Пустой раздел будет отмечен как не заполненный.</p>
        <label>Расписание <textarea id='content-schedule' rows='5'></textarea></label>
        <label>Цены <textarea id='content-prices' rows='5'></textarea></label>
        <label>Адрес <textarea id='content-address' rows='3'></textarea></label>
        <h3>Дополнительные кнопки</h3>
        <p class='muted'>Можно добавить до шести собственных разделов, например «Первое занятие» или «Что взять с собой».</p>
        <div id='custom-sections'></div>
        <button id='add-custom-section' type='button'>Добавить кнопку</button>
        <button id='save-content'>Сохранить информацию</button>
        <p id='content-status' class='muted'>Загружаем сохранённые значения…</p>
      </section>
      <section aria-labelledby='delivery-title'>
        <h2 id='delivery-title'>Доставка ответов</h2>
        <p id='delivery-summary'>Проверяем состояние…</p>
        <ul id='delivery-failures'></ul>
        <button id='refresh-deliveries'>Обновить</button>
        <p class='muted'>Тексты сообщений и данные клиентов здесь не отображаются.</p>
      </section>
      <section aria-labelledby='backup-title'>
        <h2 id='backup-title'>Резервная копия</h2>
        <p>Сохраните обращения и очередь доставки перед обновлением или переносом сервиса.</p>
        <button id='create-backup'>Создать резервную копию</button>
        <p id='backup-status' class='muted'>Токен Telegram в копию не входит.</p>
      </section>
      <script src='/setup/app.js' defer></script>
    </main>
  </body>
</html>`;

export const setupPageStyles = `
body {
  font: 16px/1.5 system-ui, sans-serif;
  margin: 0;
  color: #172033;
  background: #f5f7fa;
}
main {
  box-sizing: border-box;
  max-width: 720px;
  margin: 0 auto;
  padding: 24px;
}
section {
  margin: 20px 0;
  padding: 20px;
  border-radius: 12px;
  background: white;
  box-shadow: 0 1px 4px #0001;
}
label {
  display: block;
  margin: 12px 0;
}
input[type='password'], input[type='text'] {
  box-sizing: border-box;
  width: 100%;
  padding: 10px;
}
textarea {
  box-sizing: border-box;
  width: 100%;
  padding: 10px;
  resize: vertical;
}
button {
  padding: 10px 14px;
  cursor: pointer;
}
#chats label {
  padding: 8px 0;
}
#delivery-failures {
  padding-left: 20px;
}
#delivery-failures li {
  margin: 10px 0;
}
#delivery-failures button {
  margin-left: 8px;
}
.custom-section {
  margin: 12px 0;
  padding: 12px;
  border: 1px solid #d9dee7;
  border-radius: 8px;
}
.custom-section button {
  margin-bottom: 8px;
}
.muted {
  color: #5f6877;
}
`;

export const setupPageScript = `(() => {
  const query = (selector) => document.querySelector(selector);
  const wizard = query('#wizard');
  const status = query('#status');
  const token = query('#token');
  const chats = query('#chats');
  const connect = query('#connect');
  const deliverySummary = query('#delivery-summary');
  const deliveryFailures = query('#delivery-failures');
  const backupStatus = query('#backup-status');
  const vkWizard = query('#vk-wizard');
  const vkStatus = query('#vk-status');
  const vkToken = query('#vk-token');
  const vkCommunity = query('#vk-community');
  const contentSchedule = query('#content-schedule');
  const contentPrices = query('#content-prices');
  const contentAddress = query('#content-address');
  const contentStatus = query('#content-status');
  const customSections = query('#custom-sections');
  const addCustomSection = query('#add-custom-section');

  const request = async (url, data) => {
    const response = await fetch(url, {
      method: data ? 'POST' : 'GET',
      headers: data ? { 'content-type': 'application/json' } : {},
      body: data ? JSON.stringify(data) : undefined,
    });
    const body = await response.json();
    if (!response.ok) throw new Error(body.message);
    return body;
  };

  const showStatus = (message) => {
    status.textContent = message;
  };

  const createCustomSection = (section = {}) => {
    const container = document.createElement('div');
    container.className = 'custom-section';
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.textContent = 'Удалить кнопку';
    const label = document.createElement('label');
    label.textContent = 'Название кнопки';
    const labelInput = document.createElement('input');
    labelInput.type = 'text';
    labelInput.maxLength = 40;
    labelInput.value = section.label ?? '';
    label.append(labelInput);
    const textLabel = document.createElement('label');
    textLabel.textContent = 'Ответ';
    const textInput = document.createElement('textarea');
    textInput.rows = 4;
    textInput.maxLength = 4000;
    textInput.value = section.text ?? '';
    textLabel.append(textInput);
    remove.onclick = () => {
      container.remove();
      addCustomSection.disabled = false;
    };
    container.append(remove, label, textLabel);
    return container;
  };

  addCustomSection.onclick = () => {
    if (customSections.children.length >= 6) return;
    customSections.append(createCustomSection());
    addCustomSection.disabled = customSections.children.length >= 6;
  };

  query('#discover').onclick = async () => {
    try {
      showStatus('Ищем группы…');
      const data = await request('/api/setup/telegram/discover', {
        botToken: token.value.trim(),
      });
      const labels = data.chats.map((chat) => {
        const label = document.createElement('label');
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = 'chat';
        input.value = String(chat.id);
        label.append(input, ' ' + chat.title + (chat.isForum ? '' : ' — включите темы'));
        return label;
      });
      chats.replaceChildren(...labels);
      connect.hidden = data.chats.length === 0;
      showStatus(
        data.chats.length
          ? 'Выберите группу.'
          : 'Напишите в группе сообщение и повторите поиск.',
      );
    } catch (error) {
      showStatus(error.message);
    }
  };

  connect.onclick = async () => {
    const selected = query('input[name=chat]:checked');
    if (!selected) {
      showStatus('Выберите группу.');
      return;
    }
    try {
      showStatus('Подключаем…');
      await request('/api/setup/telegram/connect', {
        botToken: token.value.trim(),
        operatorChatId: Number(selected.value),
      });
      wizard.hidden = true;
      token.value = '';
      showStatus('Telegram подключён. Настройка сохранена.');
    } catch (error) {
      showStatus(error.message);
    }
  };

  query('#vk-connect').onclick = async (event) => {
    const button = event.currentTarget;
    button.disabled = true;
    vkStatus.textContent = 'Подключаем VK…';
    try {
      await request('/api/setup/vk/connect', {
        accessToken: vkToken.value.trim(),
        community: vkCommunity.value.trim(),
      });
      vkWizard.hidden = true;
      vkToken.value = '';
      vkStatus.textContent = 'VK подключён. Настройка сохранена.';
    } catch (error) {
      vkStatus.textContent = error.message;
    } finally {
      button.disabled = false;
    }
  };

  const refreshDeliveries = async () => {
    try {
      const data = await request('/api/setup/deliveries');
      const { failed, pending } = data.summary;
      if (failed === 0 && pending === 0) {
        deliverySummary.textContent = 'Все ответы доставлены.';
      } else {
        deliverySummary.textContent =
          'Ожидают отправки: ' + pending + '. Не доставлено: ' + failed + '.';
      }
      deliveryFailures.replaceChildren(
        ...data.failures.map((failure) => {
          const item = document.createElement('li');
          const description =
            failure.channel +
            ': ' +
            failure.reason +
            ' Попыток: ' +
            failure.attempts +
            '.';
          const retry = document.createElement('button');
          retry.type = 'button';
          retry.textContent = 'Повторить отправку';
          retry.onclick = async () => {
            retry.disabled = true;
            deliverySummary.textContent = 'Возвращаем ответ в очередь…';
            try {
              await request('/api/setup/deliveries/retry', {
                deliveryId: failure.id,
              });
              await refreshDeliveries();
            } catch (error) {
              deliverySummary.textContent = error.message;
              retry.disabled = false;
            }
          };
          item.append(description, retry);
          return item;
        }),
      );
    } catch {
      deliverySummary.textContent =
        'Не удалось проверить доставку. Обновите страницу.';
      deliveryFailures.replaceChildren();
    }
  };

  query('#refresh-deliveries').onclick = refreshDeliveries;
  query('#save-content').onclick = async (event) => {
    const button = event.currentTarget;
    button.disabled = true;
    contentStatus.textContent = 'Сохраняем…';
    try {
      await request('/api/setup/content', {
        address: contentAddress.value,
        customSections: [...customSections.children].map((container) => ({
          label: container.querySelector('input').value,
          text: container.querySelector('textarea').value,
        })),
        prices: contentPrices.value,
        schedule: contentSchedule.value,
      });
      contentStatus.textContent =
        'Сохранено. Новые ответы уже доступны в Telegram и VK.';
    } catch (error) {
      contentStatus.textContent = error.message;
    } finally {
      button.disabled = false;
    }
  };
  query('#create-backup').onclick = async (event) => {
    const button = event.currentTarget;
    button.disabled = true;
    backupStatus.textContent = 'Создаём и проверяем копию…';
    try {
      const created = await request('/api/setup/backups', {});
      backupStatus.textContent =
        'Резервная копия создана: ' + created.fileName + '.';
    } catch (error) {
      backupStatus.textContent = error.message;
    } finally {
      button.disabled = false;
    }
  };
  request('/api/setup/status')
    .then((data) => {
      if (data.connected) showStatus('Telegram подключён.');
      else {
        wizard.hidden = false;
        showStatus('Выполните три шага выше.');
      }
      if (data.vk.connected) vkStatus.textContent = 'VK подключён.';
      else {
        vkWizard.hidden = false;
        vkStatus.textContent = data.connected
          ? 'Выполните три шага выше.'
          : 'Сначала подключите Telegram для преподавателей.';
      }
    })
    .catch((error) => showStatus(error.message));
  void refreshDeliveries();
  request('/api/setup/content')
    .then((content) => {
      contentSchedule.value = content.schedule ?? '';
      contentPrices.value = content.prices ?? '';
      contentAddress.value = content.address ?? '';
      customSections.replaceChildren(
        ...(content.customSections ?? []).map(createCustomSection),
      );
      addCustomSection.disabled = customSections.children.length >= 6;
      contentStatus.textContent = 'Изменения применяются без перезапуска.';
    })
    .catch(() => {
      contentStatus.textContent =
        'Не удалось загрузить информацию. Обновите страницу.';
    });
  window.setInterval(refreshDeliveries, 10000);
})();`;
