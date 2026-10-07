---
name: playwright-test-pipeline
description: Полный пайплайн тестирования Playwright с использованием агентов planner, generator и healer
allowed-tools: Bash(npx:*) Bash(npm:*)
---

# Playwright Test Pipeline

## Обзор пайплайна

Пайплайн состоит из 3 этапов с агентами GigaCode:

```
[PLANNER] → [GENERATOR] → [HEALER] → (цикл)
```

## Этап 1: Planner — Создание плана тестирования

**Когда использовать:** Начало тестирования нового функционала или всего приложения.

**Агент:** `playwright-test-planner`

**Workflow:**

1. Агент исследует веб-приложение через браузер
2. Анализирует user flows и критические пути
3. Создаёт детальный план тестирования
4. Сохраняет план как markdown файл в `specs/`

**Результат:** Файл `specs/<app-name>-test-plan.md`

**Пример:**
```
Создай план тестирования для https://example.com
```

Агент создаст:
- Обозрение приложения
- Набор тест-сценариев (happy path, edge cases, error handling)
- Детальные шаги для каждого сценария
- Ожидаемые результаты

## Этап 2: Generator — Генерация тестов

**Когда использовать:** После создания плана или когда нужен тест без плана.

**Агент:** `playwright-test-generator`

**Workflow:**

1. Получает план тестирования (или описание функционала)
2. Настраивает страницу через `generator_setup_page`
3. Вручную выполняет каждый шаг сценария в браузере
4. Генерирует Playwright код на основе выполненных действий
5. Сохраняет тест в `tests/<scenario-name>.spec.ts`

**Результат:** Файл `tests/<scenario-name>.spec.ts` с рабочим тестом

**Пример:**
```
Сгенерируй тесты по плану specs/todomvc-test-plan.md
```

Агент создаст:
- Тесты с правильными локаторами
- Комментарии с шагами из плана
- Ожидания (expect) для каждой проверки
- Группировку в test.describe

## Этап 3: Healer — Отладка и исправление тестов

**Когда использовать:** После запуска тестов, если какие-то упали.

**Агент:** `playwright-test-healer`

**Workflow:**

1. Запускает все тесты через `test_run`
2. Для каждого упавшего теста:
   - Запускает `test_debug` для паузы на ошибке
   - Анализирует snapshot страницы в момент ошибки
   - Определяет корневую причину (селектор, тайминг, данные)
   - Исправляет код теста
   - Перезапускает для проверки

**Результат:** Все тесты проходят успешно

**Пример:**
```
Исправь падающие тесты
```

Агент:
- Найдёт все failing тесты
- Определит причину (элемент не найден, таймаут, неверный селектор)
- Исправит код
- Повторит запуск до полного прохождения

## Цикл тестирования

```
┌─────────────────────────────────────────────┐
│  1. PLANNER: Создай план тестирования       │
│     → specs/app-test-plan.md               │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│  2. GENERATOR: Сгенерируй тесты по плану    │
│     → tests/*.spec.ts                      │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│  3. Запусти тесты: npx playwright test      │
└──────────────────┬──────────────────────────┘
                   │
          ┌────────┴────────┐
          │  Все прошли?    │
          └────────┬────────┘
             YES   │   NO
          ┌────────┴────────┐
          │  ✅ Готово      │
          └─────────────────┘
          ┌─────────────────┐
          │  ❌ HEALER      │
          │  Исправь падающие│
          │  тесты          │
          └────────┬────────┘
                   │
                   ▼
          ┌─────────────────┐
          │  Вернуться к    │
          │  запуску тестов │
          └─────────────────┘
```

## Команды для запуска

### Запуск всех тестов
```bash
npx playwright test
```

### Запуск конкретного проекта
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Запуск конкретного файла
```bash
npx playwright test tests/todomvc.spec.ts
```

### Запуск с HTML отчётом
```bash
npx playwright test
# Отчёт откроется в playwright-report/index.html
```

### Запуск с отключённым открытием отчёта
```bash
PLAYWRIGHT_HTML_OPEN=never npx playwright test
```

## Структура проекта

```
project/
├── specs/                    # Планы тестирования
│   └── app-test-plan.md
├── tests/                    # Тесты Playwright
│   ├── seed.spec.ts          # Seed для настройки страницы
│   ├── add-todo.spec.ts
│   ├── complete-todo.spec.ts
│   └── filter-todo.spec.ts
├── playwright.config.ts      # Конфигурация
├── playwright-report/        # HTML отчёты (генерируется)
└── test-results/             # Результаты выполнения (генерируется)
```

## Best Practices

### 1. Используйте уникальные префиксы для тестовых данных
```ts
function getRandomPrefix() {
  return `test-${Math.random().toString(36).substring(2, 10)}`;
}
```

### 2. Используйте role-based locators
```ts
// ✅ Хорошо
page.getByRole('textbox', { name: 'What needs to be done?' })

// ❌ Плохо
page.locator('input[type="text"]')
```

### 3. Проверяйте HTTP статусы через response listeners
```ts
let response: Response | undefined;
page.on('response', (r) => {
  if (r.url().includes('api.example.com')) {
    response = r;
  }
});
await page.goto('https://example.com');
expect(response?.status()).toBe(200);
```

### 4. Используйте beforeEach для общей настройки
```ts
test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://example.com');
  });
  
  test('test 1', async ({ page }) => { ... });
  test('test 2', async ({ page }) => { ... });
});
```

### 5. Избегайте waitForTimeout
```ts
// ❌ Плохо
await page.waitForTimeout(1000);

// ✅ Хорошо
await page.waitForResponse(resp => resp.url().includes('api/data'));
await expect(page.getByText('Loaded')).toBeVisible();
```

## Troubleshooting

### Тест падает с "locator resolved to 0 elements"
- Проверьте snapshot страницы в момент ошибки
- Убедитесь, что элемент действительно существует
- Проверьте, не нужно ли ждать загрузки элемента

### Тест падает с Timeout
- Добавьте явные ожидания: `await expect(locator).toBeVisible()`
- Проверьте, не блокируется ли элемент анимацией
- Увеличьте таймаут: `test.setTimeout(60000)`

### Тест flaky (проходит не всегда)
- Добавьте retry в конфиге: `retries: 2`
- Используйте стабильные локаторы (role, test-id)
- Добавьте явные ожидания вместо sleep

## Работа с несколькими браузерами

В `playwright.config.ts` можно настроить несколько браузеров:

```ts
projects: [
  { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
  { name: 'webkit', use: { ...devices['Desktop Safari'] } },
]
```

Запуск на всех:
```bash
npx playwright test
```

Запуск на одном:
```bash
npx playwright test --project=chromium
```

## CI/CD интеграция

### GitHub Actions
```yaml
name: Playwright Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: lts/*
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```
