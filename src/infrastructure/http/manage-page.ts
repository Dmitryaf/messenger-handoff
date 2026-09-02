export const managePageHtml = `<!doctype html>
<html lang='ru'>
  <head>
    <meta charset='utf-8'>
    <meta name='viewport' content='width=device-width,initial-scale=1'>
    <title>Информация для клиентов</title>
    <link rel='stylesheet' href='/manage/style.css'>
  </head>
  <body>
    <main>
      <section id='login-section' hidden>
        <h1>Вход</h1>
        <p>Введите пароль, который выдал администратор сервиса.</p>
        <form id='login-form'>
          <label for='password'>Пароль</label>
          <input id='password' type='password' autocomplete='current-password' required>
          <button type='submit'>Войти</button>
        </form>
        <p id='login-status' class='status' role='status' aria-live='polite'></p>
      </section>

      <div id='editor' hidden>
        <header>
          <div>
            <h1>Информация для клиентов</h1>
            <p>Изменения сразу появятся в Telegram и VK.</p>
          </div>
          <button id='logout' class='secondary' type='button'>Выйти</button>
        </header>

        <form id='content-form'>
          <section>
            <h2>Основная информация</h2>
            <label for='schedule'>Расписание</label>
            <p class='hint'>Каждое занятие указывайте с новой строки.</p>
            <textarea id='schedule' rows='6' maxlength='4000' placeholder='Пн, пт — начинающая группа в 19:00&#10;Вт, чт — старшая группа в 20:00'></textarea>

            <label for='prices'>Цены</label>
            <p class='hint'>Каждый вариант оплаты указывайте с новой строки.</p>
            <textarea id='prices' rows='6' maxlength='4000' placeholder='Разовое занятие — 500 ₽&#10;Абонемент на 4 занятия — 3200 ₽'></textarea>

            <label for='address'>Адрес</label>
            <textarea id='address' rows='3' maxlength='4000' placeholder='Улица, дом, ориентир'></textarea>
          </section>

          <section>
            <h2>Дополнительные кнопки</h2>
            <p>Добавьте до шести разделов. Для FAQ выберите формат «Вопросы и ответы».</p>
            <div id='custom-sections'></div>
            <button id='add-section' class='secondary' type='button'>Добавить кнопку</button>
          </section>

          <section>
            <h2>Предпросмотр</h2>
            <p class='hint'>Так текст будет выглядеть у клиента. Пустые разделы не показываются.</p>
            <div id='preview'></div>
          </section>

          <div class='save-bar'>
            <button id='save' type='submit'>Сохранить изменения</button>
            <p id='save-status' class='status' role='status' aria-live='polite'></p>
          </div>
        </form>

        <section>
          <h2>Последние изменения</h2>
          <ul id='history'></ul>
          <p id='history-empty' class='hint'>Изменений пока нет.</p>
        </section>
      </div>

      <script src='/manage/app.js' defer></script>
    </main>
  </body>
</html>`;

export const managePageStyles = `
:root {
  color-scheme: light;
  font-family: system-ui, sans-serif;
  color: #172033;
  background: #f4f6f9;
}
* {
  box-sizing: border-box;
}
body {
  margin: 0;
}
main {
  width: min(100%, 760px);
  margin: 0 auto;
  padding: 16px;
}
header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}
section {
  margin: 16px 0;
  padding: 20px;
  border-radius: 14px;
  background: white;
  box-shadow: 0 1px 5px #00000012;
}
h1, h2, h3, p {
  margin-top: 0;
}
label {
  display: block;
  margin-top: 18px;
  font-weight: 650;
}
input, select, textarea, button {
  width: 100%;
  min-height: 46px;
  margin-top: 8px;
  border: 1px solid #c7cfdb;
  border-radius: 9px;
  font: inherit;
}
input, select, textarea {
  padding: 11px 12px;
  color: inherit;
  background: white;
}
textarea {
  resize: vertical;
}
button {
  padding: 10px 16px;
  border-color: #1769e0;
  color: white;
  background: #1769e0;
  cursor: pointer;
  font-weight: 650;
}
button:disabled {
  cursor: wait;
  opacity: 0.65;
}
button.secondary {
  border-color: #c7cfdb;
  color: #172033;
  background: white;
}
header button {
  width: auto;
  min-width: 90px;
  margin-top: 0;
}
.hint {
  margin: 4px 0 0;
  color: #5f6877;
  font-size: 0.92rem;
}
.status {
  min-height: 24px;
  margin: 10px 0 0;
}
.custom-section {
  margin: 14px 0;
  padding: 14px;
  border: 1px solid #d9dee7;
  border-radius: 10px;
}
.custom-section h3 {
  margin-bottom: 0;
}
.custom-section .remove {
  border-color: #d2a5a5;
  color: #8b2020;
  background: #fff8f8;
}
.preview-card {
  margin-top: 12px;
  padding: 14px;
  border-radius: 10px;
  background: #f1f4f8;
}
.preview-card h3 {
  margin-bottom: 8px;
}
.preview-text {
  margin: 0;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
.save-bar {
  position: sticky;
  bottom: 0;
  z-index: 2;
  padding: 12px 0;
  background: linear-gradient(#f4f6f900, #f4f6f9 18%);
}
#history {
  padding-left: 20px;
}
#history li {
  margin: 8px 0;
}
@media (max-width: 520px) {
  main {
    padding: 10px;
  }
  section {
    padding: 16px;
  }
  header {
    display: block;
  }
  header button {
    width: 100%;
    margin-bottom: 4px;
  }
}
`;

export const managePageScript = `(() => {
  const query = (selector, root = document) => root.querySelector(selector);
  const loginSection = query('#login-section');
  const loginForm = query('#login-form');
  const loginStatus = query('#login-status');
  const password = query('#password');
  const editor = query('#editor');
  const form = query('#content-form');
  const schedule = query('#schedule');
  const prices = query('#prices');
  const address = query('#address');
  const customSections = query('#custom-sections');
  const addSection = query('#add-section');
  const preview = query('#preview');
  const saveStatus = query('#save-status');
  const history = query('#history');
  const historyEmpty = query('#history-empty');

  const request = async (url, data) => {
    const response = await fetch(url, {
      method: data === undefined ? 'GET' : 'POST',
      credentials: 'same-origin',
      headers: data === undefined ? {} : { 'content-type': 'application/json' },
      body: data === undefined ? undefined : JSON.stringify(data),
    });
    const body = await response.json();
    if (!response.ok) {
      const error = new Error(body.message ?? 'Не удалось выполнить действие.');
      error.status = response.status;
      throw error;
    }
    return body;
  };

  const showLogin = (message = '') => {
    editor.hidden = true;
    loginSection.hidden = false;
    loginStatus.textContent = message;
    password.focus();
  };

  const createCustomSection = (section = {}) => {
    const container = document.createElement('div');
    container.className = 'custom-section';

    const title = document.createElement('h3');
    title.textContent = 'Дополнительная кнопка';

    const nameLabel = document.createElement('label');
    nameLabel.textContent = 'Название кнопки';
    const name = document.createElement('input');
    name.type = 'text';
    name.maxLength = 40;
    name.required = true;
    name.value = section.label ?? '';
    nameLabel.append(name);

    const formatLabel = document.createElement('label');
    formatLabel.textContent = 'Формат ответа';
    const format = document.createElement('select');
    const plain = new Option('Обычный текст', 'plain');
    const faq = new Option('Вопросы и ответы', 'faq');
    format.append(plain, faq);
    format.value = section.format === 'faq' ? 'faq' : 'plain';
    formatLabel.append(format);

    const textLabel = document.createElement('label');
    textLabel.textContent = 'Ответ';
    const help = document.createElement('p');
    help.className = 'hint';
    const text = document.createElement('textarea');
    text.rows = 6;
    text.maxLength = 4000;
    text.required = true;
    text.value = section.text ?? '';
    textLabel.append(text);

    const updateHelp = () => {
      help.textContent =
        format.value === 'faq'
          ? 'Сначала вопрос, со следующей строки ответ. Между парами оставляйте пустую строку.'
          : 'Свободный текст без обязательного шаблона.';
      renderPreview();
    };
    format.onchange = updateHelp;
    name.oninput = renderPreview;
    text.oninput = renderPreview;

    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'remove';
    remove.textContent = 'Удалить кнопку';
    remove.onclick = () => {
      container.remove();
      addSection.disabled = false;
      renderPreview();
    };

    container.append(title, nameLabel, formatLabel, textLabel, help, remove);
    updateHelp();
    return container;
  };

  const readCustomSections = () =>
    [...customSections.children].map((container) => {
      const fields = container.querySelectorAll('input, select, textarea');
      const [name, format, text] = fields;
      return {
        ...(format.value === 'faq' ? { format: 'faq' } : {}),
        label: name.value,
        text: text.value,
      };
    });

  const listText = (label, value) => {
    const items = value
      .split(/\\r?\\n/)
      .map((item) => item.trim().replace(/^[-•]\\s*/, ''))
      .filter(Boolean);
    return items.length
      ? label + '\\n\\n' + items.map((item) => '• ' + item).join('\\n')
      : '';
  };

  const faqText = (label, value) => {
    const items = value
      .trim()
      .split(/\\r?\\n\\s*\\r?\\n/)
      .map((block) => {
        const [question = '', ...answerLines] = block
          .split(/\\r?\\n/)
          .map((line) => line.trim());
        return {
          answer: answerLines.filter(Boolean).join('\\n'),
          question,
        };
      })
      .filter((item) => item.question);
    return items.length
      ? label +
          '\\n\\n' +
          items
            .map((item) => '❓ ' + item.question + '\\n' + item.answer)
            .join('\\n\\n────────\\n\\n')
      : '';
  };

  const addPreviewCard = (label, text) => {
    if (!text) return;
    const card = document.createElement('article');
    card.className = 'preview-card';
    const title = document.createElement('h3');
    title.textContent = label;
    const body = document.createElement('p');
    body.className = 'preview-text';
    body.textContent = text;
    card.append(title, body);
    preview.append(card);
  };

  function renderPreview() {
    preview.replaceChildren();
    addPreviewCard('Расписание', listText('Расписание', schedule.value));
    addPreviewCard('Цены', listText('Цены', prices.value));
    addPreviewCard(
      'Адрес',
      address.value.trim() ? 'Адрес\\n\\n' + address.value.trim() : '',
    );
    for (const section of readCustomSections()) {
      const text =
        section.format === 'faq'
          ? faqText(section.label.trim(), section.text)
          : section.text.trim();
      addPreviewCard(section.label.trim() || 'Новая кнопка', text);
    }
  }

  const loadHistory = async () => {
    const data = await request('/api/manage/content/history');
    const labels = {
      address: 'адрес',
      customSections: 'дополнительные кнопки',
      prices: 'цены',
      schedule: 'расписание',
    };
    history.replaceChildren(
      ...data.history.map((entry) => {
        const item = document.createElement('li');
        const date = new Date(entry.changedAt);
        item.textContent =
          date.toLocaleString('ru-RU') +
          ': ' +
          entry.sections.map((section) => labels[section]).join(', ');
        return item;
      }),
    );
    historyEmpty.hidden = data.history.length > 0;
  };

  const loadContent = async () => {
    const content = await request('/api/manage/content');
    schedule.value = content.schedule ?? '';
    prices.value = content.prices ?? '';
    address.value = content.address ?? '';
    customSections.replaceChildren(
      ...(content.customSections ?? []).map(createCustomSection),
    );
    addSection.disabled = customSections.children.length >= 6;
    renderPreview();
    await loadHistory();
  };

  const showEditor = async () => {
    loginSection.hidden = true;
    editor.hidden = false;
    try {
      await loadContent();
      saveStatus.textContent = 'Информация загружена.';
    } catch (error) {
      if (error.status === 401) showLogin('Сессия завершилась. Войдите снова.');
      else saveStatus.textContent = error.message;
    }
  };

  addSection.onclick = () => {
    if (customSections.children.length >= 6) return;
    customSections.append(createCustomSection());
    addSection.disabled = customSections.children.length >= 6;
    renderPreview();
  };
  schedule.oninput = renderPreview;
  prices.oninput = renderPreview;
  address.oninput = renderPreview;

  loginForm.onsubmit = async (event) => {
    event.preventDefault();
    const button = query('button[type=submit]', loginForm);
    button.disabled = true;
    loginStatus.textContent = 'Проверяем пароль…';
    try {
      await request('/api/manage/login', { password: password.value });
      password.value = '';
      await showEditor();
    } catch (error) {
      loginStatus.textContent = error.message;
    } finally {
      button.disabled = false;
    }
  };

  form.onsubmit = async (event) => {
    event.preventDefault();
    const button = query('#save');
    button.disabled = true;
    saveStatus.textContent = 'Сохраняем…';
    try {
      await request('/api/manage/content', {
        address: address.value,
        customSections: readCustomSections(),
        prices: prices.value,
        schedule: schedule.value,
      });
      saveStatus.textContent =
        'Сохранено. Новые ответы уже доступны в Telegram и VK.';
      await loadHistory();
      renderPreview();
    } catch (error) {
      if (error.status === 401) showLogin('Сессия завершилась. Войдите снова.');
      else saveStatus.textContent = error.message;
    } finally {
      button.disabled = false;
    }
  };

  query('#logout').onclick = async () => {
    try {
      await request('/api/manage/logout', {});
    } finally {
      showLogin('Вы вышли.');
    }
  };

  request('/api/manage/session')
    .then((session) =>
      session.authenticated ? showEditor() : showLogin(),
    )
    .catch((error) => showLogin(error.message));
})();`;
