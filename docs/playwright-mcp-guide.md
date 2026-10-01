# Playwright Test Agents MCP Server — Полное руководство

## 1. Настройка MCP сервера

### 1.1 Для VS Code

Файл: `.vscode/mcp.json`

```json
{
  "servers": {
    "playwright-test": {
      "type": "stdio",
      "command": "npx",
      "args": [
        "playwright",
        "run-test-mcp-server"
      ]
    }
  },
  "inputs": []
}
```

### 1.2 Для GigaCode

Файл: `.gigacode_vsc/gigacode.json`

```json
{
  "mcpServers": {
    "playwright-test": {
      "command": "npx",
      "args": ["playwright", "run-test-mcp-server"],
      "disabled": false
    }
  }
}
```

### 1.3 Для Roo Code

Файл: `.roo/mcp.json`

```json
{
  "servers": {
    "playwright-test": {
      "type": "stdio",
      "command": "npx",
      "args": ["playwright", "run-test-mcp-server"]
    }
  },
  "inputs": []
}
```

## 2. Playwright Test Agents MCP

Этот MCP-сервер (`playwright run-test-mcp-server`) — **специализированный сервер для работы с Playwright Test Agents**. Он предоставляет 89 тулов, разделённых на две группы:

- **Browser Tools (80 тулов)** — базовые инструменты для взаимодействия с браузером: навигация, клики, ввод текста, управление cookies/storage, скриншоты, сеть и т.д. Используются всеми тремя агентами как фундаментальный слой.
- **Test Backend Tools (9 тулов)** — специализированные инструменты для агентов: Planner (планирование), Generator (генерация тестов), Test Runner (запуск и отладка).

Агенты работают независимо, последовательно или в цикле (agentic loop), и каждый тул доступен через MCP-протокол.

### 2.1 Инициализация агентов

Добавьте определения агентов в проект командой:

```bash
npx playwright init-agents --loop=vscode
```

Доступные значения `--loop`:

| Значение | Описание |
|----------|----------|
| `vscode` | Инициализация для VS Code (нужна версия 1.105+) |
| `claude` | Инициализация для Claude Code |
| `codex` | Инициализация для OpenAI Codex |
| `copilot` | Инициализация для GitHub Copilot |
| `opencode` | Инициализация для OpenCode |

Агенты следует регенерировать при каждом обновлении Playwright, чтобы получить новые инструменты и инструкции.

### 2.2 Агенты

#### 🎭 Planner — Планировщик

Исследует приложение и формирует Markdown-план тестов для сценариев и пользовательских потоков.

- **Вход:** запрос (например, «Сгенерируй план для гостевого чекаута»), `seed.spec.ts` для настройки окружения, опционально PRD
- **Выход:** человекочитаемый Markdown-план в `specs/`, описывающий шаги и ожидаемые результаты

#### 🎭 Generator — Генератор

Преобразует Markdown-план в исполняемые Playwright Test-файлы. Проверяет селекторы и ассерты «на лету» при проходе по сценарию.

- **Вход:** Markdown-план из `specs/`
- **Выход:** набор тестов в `tests/`, сгенерированные в формате Playwright Test

#### 🎭 Healer — Целитель

Когда тест падает, healer воспроизводит упавшие шаги, находит эквивалентные элементы в текущем UI и предлагает патч (обновление локатора, коррекцию wait, исправление данных). Повторяет запуск до прохождения теста.

- **Вход:** имя падающего теста
- **Выход:** проходящий тест или пропущенный тест, если функциональность сломана

### 2.3 Структура артефактов

```
repo/
  .github/agents/          # исходные агенты (Claude Code формат)
  specs/                   # человекочитаемые планы тестов
    basic-operations.md
  tests/                   # сгенерированные Playwright-тесты
    seed.spec.ts           # seed-тест для настройки окружения
    tests/create/add-valid-todo.spec.ts
  playwright.config.ts
```

### 2.4 Конвертация агентов для GigaCode

Исходные агенты Playwright (`npx playwright init-agents --loop=claude`) генерируют файлы в `.github/agents/` с форматом Claude Code. Чтобы использовать их в GigaCode (или любом другом AI-инструменте), нужно конвертировать YAML-frontmatter.

#### Как работает

Playwright Test Agents — это MCP-сервер с 89 тулами. Агент — это Markdown-файл с YAML-frontmatter, который описывает:

- **Frontmatter** — метаданные: имя, описание, модель, инструменты, MCP-серверы
- **Body** — системный промт (instructions), который остаётся **без изменений** при конвертации

При конвертации меняется **только frontmatter**. Системный промт берётся из исходного файла как есть.

#### Разница форматов

**Claude Code (исходный формат Playwright):**

```yaml
---
name: playwright-test-planner
description: Use this agent when you need to create comprehensive test plan
tools:
  - search
  - playwright-test/browser_click
  - playwright-test/browser_close
  - playwright-test/planner_setup_page
  - playwright-test/planner_save_plan
model: Claude Sonnet 4.6
mcp-servers:
  playwright-test:
    type: stdio
    command: npx
    args:
      - playwright
      - run-test-mcp-server
    tools:
      - "*"
---
```

**GigaCode (адаптированный формат):**

```yaml
---
description: Использовать этого агента для создания комплексного плана тестирования
mode: subagent
model: gigacode/vllm/CodeAgent
steps: 25
hidden: false
color: "#4CAF50"
permission:
  bash: allow
  edit:
    "specs/**": allow
    "*": ask
  read: allow
---
```

#### Промт для конвертации

Скопируйте этот промт в AI-ассистент вместе с содержимым файла из `.github/agents/*.agent.md`:

```
Конвертируй агент Playwright из формата Claude Code в формат GigaCode.

Правила конвертации:

1. **Убрать из frontmatter:**
   - `name` — GigaCode использует имя файла
   - `tools` — инструменты определяются через MCP-сервер в gigacode.json
   - `mcp-servers` — MCP настроен отдельно в gigacode.json

2. **Заменить:**
   - `model: Claude Sonnet 4.6` → `model: gigacode/vllm/CodeAgent` (или нужную модель)
   - `description` — перевести на русский, оставить кратким (до 80 символов)

3. **Добавить:**
   - `mode: subagent` — чтобы агент загружался как подзадача
   - `steps: 25` — максимальное число итераций
   - `hidden: false` — показывать в списке агентов
   - `color: "#4CAF50"` — цвет карточки агента (зелёный для Planner, синий для Generator, оранжевый для Healer)
   - `permission` — разрешения:
     ```yaml
     permission:
       bash: allow
       edit:
         "specs/**": allow
         "tests/**": allow
         "*": ask
       read: allow
     ```

4. **Body (после ---) — НЕ ТРОГАТЬ.** Системный промт берётся из исходного файла без изменений.

5. **Сохранить файл в:** `.gigacode_vsc/agents/<имя>.md` (без префикса `playwright-test-` и суффикса `.agent`).

Пример: `playwright-test-planner.agent.md` → `.gigacode_vsc/agents/planner.md`
```

#### Как использовать

1. **Сгенерировать исходных агентов:**
   ```bash
   npx playwright init-agents --loop=claude
   ```

2. **Конвертировать** — взять файл из `.github/agents/`, прогнать через промт выше

3. **Настроить MCP-сервер** в `.gigacode_vsc/gigacode.json` (см. раздел 1.2)

4. **Использовать:**
   - В диалоге: `@<имя-файла>` (например `@planner`)
   - Через Ctrl+P → выберите агента

#### Структура

```
repo/
  .github/agents/              # исходные агенты (Claude Code формат)
    playwright-test-planner.agent.md
    playwright-test-generator.agent.md
    playwright-test-healer.agent.md
  .gigacode_vsc/
    gigacode.json              # MCP-сервер playwright-test
    agents/                    # адаптированные агенты (GigaCode формат)
      planner.md
      generator.md
      healer.md
  specs/                       # планы тестов
  tests/                       # сгенерированные тесты
```

---

## 3. Описание всех 89 тулов

### 3.1 Browser Tools (80 тулов)

#### Core / Navigation

| # | Тул | Описание |
|---|-----|----------|
| 1 | `browser_close` | Закрыть браузер/страницу |
| 2 | `browser_resize` | Изменить размер окна браузера (`width`, `height`) |
| 3 | `browser_get_config` | Получить resolved конфигурацию после объединения CLI-опций, переменных окружения и конфига |
| 4 | `browser_navigate` | Перейти по URL (`url`) |
| 5 | `browser_navigate_back` | Вернуться на предыдущую страницу |
| 6 | `browser_navigate_forward` | Перейти на следующую страницу |
| 7 | `browser_reload` | Перезагрузить текущую страницу |
| 8 | `browser_snapshot` | Получить accessibility snapshot страницы для получения референсов элементов |
| 9 | `browser_click` | Кликнуть на элемент (`target`, `button`, `modifiers`, `doubleClick`) |
| 10 | `browser_drag` | Drag and drop между двумя элементами (`startTarget`, `endTarget`) |
| 11 | `browser_hover` | Навести курсор на элемент (`target`) |
| 12 | `browser_select_option` | Выбрать опцию в dropdown (`target`, `values`) |
| 13 | `browser_generate_locator` | Сгенерировать Playwright locator для элемента |
| 14 | `browser_check` | Отметить checkbox или radio button (`target`) |
| 15 | `browser_uncheck` | Снять отметку с checkbox или radio button (`target`) |
| 16 | `browser_file_upload` | Загрузить один или несколько файлов (`paths`) |
| 17 | `browser_drop` | Перетащить файлы или MIME-данные на элемент (`target`, `paths`, `data`) |

#### Console / Dialogs / Evaluate

| # | Тул | Описание |
|---|-----|----------|
| 18 | `browser_console_messages` | Получить сообщения консоли (`level`, `all`, `filename`) |
| 19 | `browser_console_clear` | Очистить все сообщения консоли |
| 20 | `browser_handle_dialog` | Обработать dialog (alert/prompt/confirm) (`accept`, `promptText`) |
| 21 | `browser_evaluate` | Выполнить JavaScript выражение на странице (`function`, `target`, `filename`) |

#### Find / Form

| # | Тул | Описание |
|---|-----|----------|
| 22 | `browser_find` | Поиск текста или regex в accessibility snapshot страницы (`text`, `regex`) |
| 23 | `browser_fill_form` | Заполнить несколько полей формы одновременно (`fields`) |

#### Keyboard

| # | Тул | Описание |
|---|-----|----------|
| 24 | `browser_press_key` | Нажать клавишу на клавиатуре (`key`) |
| 25 | `browser_press_sequentially` | Ввести текст посимвольно (`text`, `submit`) |
| 26 | `browser_type` | Ввести текст в редактируемый элемент (`target`, `text`, `submit`, `slowly`) |
| 27 | `browser_keydown` | Нажать клавишу (keydown event) (`key`) |
| 28 | `browser_keyup` | Отпустить клавишу (keyup event) (`key`) |

#### Mouse

| # | Тул | Описание |
|---|-----|----------|
| 29 | `browser_mouse_move_xy` | Переместить мышь в координаты (`x`, `y`) |
| 30 | `browser_mouse_click_xy` | Кликнуть мышью в координаты (`x`, `y`, `button`, `clickCount`, `delay`) |
| 31 | `browser_mouse_drag_xy` | Перетащить мышью от координат к координатам (`startX`, `startY`, `endX`, `endY`) |
| 32 | `browser_mouse_down` | Нажать кнопку мыши (`button`) |
| 33 | `browser_mouse_up` | Отпустить кнопку мыши (`button`) |
| 34 | `browser_mouse_wheel` | Прокрутить колёсико мыши (`deltaX`, `deltaY`) |

#### Network

| # | Тул | Описание |
|---|-----|----------|
| 35 | `browser_network_requests` | Список сетевых запрослов с загрузки страницы (`static`, `filter`, `filename`) |
| 36 | `browser_network_request` | Детали сетевого запроса по индексу (`index`, `part`, `filename`) |
| 37 | `browser_network_clear` | Очистить список сетевых запросов |
| 38 | `browser_network_state_set` | Установить состояние сети (`online`/`offline`) |

#### PDF / Screenshot

| # | Тул | Описание |
|---|-----|----------|
| 39 | `browser_pdf_save` | Сохранить страницу как PDF (`filename`) |
| 40 | `browser_take_screenshot` | Сделать скриншот страницы или элемента (`target`, `type`, `filename`, `fullPage`, `scale`) |

#### Recorder / Route

| # | Тул | Описание |
|---|-----|----------|
| 41 | `browser_start_recording` | Начать запись действий пользователя |
| 42 | `browser_stop_recording` | Остановить запись и вернуть код Playwright |
| 43 | `browser_route` | Мокировать сетевые запросы по паттерну URL (`pattern`, `status`, `body`, `contentType`, `headers`, `removeHeaders`) |
| 44 | `browser_route_list` | Список всех активных route |
| 45 | `browser_unroute` | Удалить route по паттерну (`pattern`) |

#### DevTools

| # | Тул | Описание |
|---|-----|----------|
| 46 | `browser_run_code_unsafe` | Выполнить Playwright код (unsafe — RCE-эквивалент) (`code`, `filename`) |
| 47 | `browser_resume` | Возобновить выполнение после паузы (`step`, `location`) |
| 48 | `browser_highlight` | Подсветить элемент на странице (`target`, `style`) |
| 49 | `browser_hide_highlight` | Убрать подсветку элемента (`target`, `element`) |
| 50 | `browser_annotate` | Открыть Dashboard для аннотаций страницы |
| 51 | `browser_start_tracing` | Начать запись trace |
| 52 | `browser_stop_tracing` | Остановить запись trace |

#### Storage

| # | Тул | Описание |
|---|-----|----------|
| 53 | `browser_storage_state` | Сохранить состояние storage (cookies, localStorage) в файл (`filename`) |
| 54 | `browser_set_storage_state` | Загрузить состояние storage из файла (`filename`) |

#### Tabs

| # | Тул | Описание |
|---|-----|----------|
| 55 | `browser_tabs` | Управление вкладками (`action`: list/new/close/select, `index`, `url`) |

#### Cookies

| # | Тул | Описание |
|---|-----|----------|
| 56 | `browser_cookie_list` | Список всех cookies (`domain`, `path`) |
| 57 | `browser_cookie_get` | Получить cookie по имени (`name`) |
| 58 | `browser_cookie_set` | Установить cookie (`name`, `value`, `domain`, `path`, `expires`, `httpOnly`, `secure`, `sameSite`) |
| 59 | `browser_cookie_delete` | Удалить cookie (`name`) |
| 60 | `browser_cookie_clear` | Очистить все cookies |

#### localStorage

| # | Тул | Описание |
|---|-----|----------|
| 61 | `browser_localstorage_list` | Список всех localStorage пар |
| 62 | `browser_localstorage_get` | Получить localStorage по ключу (`key`) |
| 63 | `browser_localstorage_set` | Установить localStorage (`key`, `value`) |
| 64 | `browser_localstorage_delete` | Удалить localStorage (`key`) |
| 65 | `browser_localstorage_clear` | Очистить localStorage |

#### sessionStorage

| # | Тул | Описание |
|---|-----|----------|
| 66 | `browser_sessionstorage_list` | Список всех sessionStorage пар |
| 67 | `browser_sessionstorage_get` | Получить sessionStorage по ключу (`key`) |
| 68 | `browser_sessionstorage_set` | Установить sessionStorage (`key`, `value`) |
| 69 | `browser_sessionstorage_delete` | Удалить sessionStorage (`key`) |
| 70 | `browser_sessionstorage_clear` | Очистить sessionStorage |

#### Verify

| # | Тул | Описание |
|---|-----|----------|
| 71 | `browser_verify_element_visible` | Проверить видимость элемента (`role`, `accessibleName`) |
| 72 | `browser_verify_text_visible` | Проверить видимость текста (`text`) |
| 73 | `browser_verify_list_visible` | Проверить видимость списка (`element`, `target`, `items`) |
| 74 | `browser_verify_value` | Проверить значение поля (`type`, `element`, `target`, `value`) |

#### Video

| # | Тул | Описание |
|---|-----|----------|
| 75 | `browser_start_video` | Начать запись видео (`filename`, `size`) |
| 76 | `browser_stop_video` | Остановить запись видео |
| 77 | `browser_video_chapter` | Добавить главу в видео (`title`, `description`, `duration`) |
| 78 | `browser_video_show_actions` | Показать аннотации действий (`duration`, `position`, `cursor`) |
| 79 | `browser_video_hide_actions` | Скрыть аннотации действий |

#### Wait

| # | Тул | Описание |
|---|-----|----------|
| 80 | `browser_wait_for` | Ждать появление/исчезновение текста или время (`time`, `text`, `textGone`) |

---

### 3.2 Test Backend Tools (9 тулов)

#### Planner Tools (3)

| # | Тул | Описание |
|---|-----|----------|
| 81 | `planner_setup_page` | Подготовить страницу для планирования тестов (`project`, `seedFile`) |
| 82 | `planner_submit_plan` | Отправить тестовый план (`overview`, `suites`) |
| 83 | `planner_save_plan` | Сохранить тестовый план как markdown-файл (`overview`, `suites`, `name`, `fileName`) |

#### Generator Tools (3)

| # | Тул | Описание |
|---|-----|----------|
| 84 | `generator_setup_page` | Подготовить страницу для генерации тестов (`plan`, `project`, `seedFile`) |
| 85 | `generator_read_log` | Получить журнал выполненных действий |
| 86 | `generator_write_test` | Записать сгенерированный тест в файл (`fileName`, `code`) |

#### Test Tools (3)

| # | Тул | Описание |
|---|-----|----------|
| 87 | `test_list` | Список всех тестов |
| 88 | `test_run` | Запустить тесты (`locations`, `projects`) |
| 89 | `test_debug` | Отладить отдельный тест (`test.id`, `test.title`) |
