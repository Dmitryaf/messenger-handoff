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
            <li>В управлении сообществом откройте «Работа с API» и включите Long Poll API.</li>
            <li>В событиях Long Poll отметьте «Входящие сообщения».</li>
            <li>Создайте ключ доступа сообщества с правом работы с сообщениями.</li>
          </ol>
          <label>Ссылка на сообщество <input id='vk-community' type='text' placeholder='https://vk.com/your_community'></label>
          <label>Ключ доступа сообщества <input id='vk-token' type='password'></label>
          <button id='vk-connect'>Подключить VK</button>
        </div>
        <p id='vk-status'>Проверяем состояние…</p>
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
  window.setInterval(refreshDeliveries, 10000);
})();`;
