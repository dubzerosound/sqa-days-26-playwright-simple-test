# Техника сбора фактов для каждого раздела отчёта

Этот файл — приложение к SKILL.md и `report-template.md`. Здесь — **как искать** каждый
тип фактов, независимо от фреймворка, и какие команды/grep использовать. Команды даны в
стиле Bash; допустимы PowerShell-эквиваленты (`dir`, `findstr`, `Select-String`).

## Общие разведочные команды

```
# Конфиги проекта (без node_modules)
Glob: package.json, *.config.ts, *.config.js, *.config.json, tsconfig.json
Glob (исключая node_modules/**): **/playwright.config.*, **/cypress.config.*, **/jest.config.*, **/vitest.config.*

# Где лежат тесты
Glob: **/*.spec.ts, **/*.test.ts, **/*.cy.ts   (исключая node_modules)

# Setup и support
Glob: **/*.setup.ts, cypress/support/**, **/setup.ts

# Утилиты/страницы/фикстуры — посмотреть топ-уровневые папки:
ListDirectory: tests/, test/, e2e/, cypress/, src/, __tests__/  (что реально есть)
```

## Запуск и скрипты (раздел 4)

```
Read: package.json → поле "scripts" (привести таблицей)
Grep: test|e2e|spec|cypress|vitest|jest  в "scripts"
```

## Правила именования (раздел 5)

```
# Паттерны тест-файлов — сгруппировать расширения:
Glob: **/*.spec.ts → basename()  → собрать в kebab-case/имена
Glob: **/*.test.ts → basename()
Glob: **/*.setup.ts → basename()
Glob: **/utils/**/*.ts → basename()
Glob: **/*.cy.ts → basename()

# Классы
Grep: "\bclass\s+\w+"  → PascalCase
# Заголовки тестов / describe
Grep: test\('|it\(|describe\('  → извлечь первый текстовый аргумент
# Теги
Grep: "tag:\s*\["  → собрать теги
```

## Стиль и линт (раздел 6)

```
Read: .eslintrc.* / eslint.config.* / tsconfig.json  → extends, rules, strict
Read: 1-2 случайных .spec.ts → порядок импортов (что идёт первым: фреймворк, библиотеки, утилиты)
Grep: "^import " в выборке тестов → порядок, типы импортов
```

## Локаторы (раздел 7)

Подсчёт использований по типам в выборке тестов (не во всём проекте, чтобы не гадать по
глобальному count — достаточно репрезентативной выборки из разных доменов):

```
Grep: getByRole        → count
Grep: getByText        → count
Grep: getByTestId      → count
Grep: getByLabel       → count
Grep: getByPlaceholder → count
Grep: getByTitle       → count
Grep: data-testid      → count
Grep: page\.locator\('\) → count  (CSS)
Grep: page\.locator\('//' → count  (XPath)
```

Вывод — таблица `Тип | count` + 1–2 цитаты с путём.

## POM и фикстуры (разделы 8–9)

```
Grep: "class\s+\w*Page\b"          (*.ts)             → наличие POM
Grep: "base\.extend\("             (*.ts)             → кастомные фикстуры (Playwright)
Grep: "test\.use\("                (*.spec.ts)        → применение фикстур
Grep: "Cypress\.Commands\.add\("   (cypress/**)       → кастомные команды Cypress
Grep: "page\.|context\.|browser\.|request\."          → встроенные фикстуры
```

## Ассерты и ожидания (раздел 10)

```
Grep: "\.toBeVisible\("   → count
Grep: "\.toHaveText\("    → count
Grep: "\.toContainText\(" → count
Grep: "\.toEqual\("       → count
Grep: "\.toHaveURL\("     → count
Grep: "\.toHaveCount\("   → count
Grep: "\.toHaveValue\("   → count
Grep: "\.should\("        → count (Cypress)
Grep: "expect\.soft\(|soft\(" → есть ли мягкие проверки
Grep: "expect\([^\)]*,\s*['\"]" → есть ли кастомные сообщения ассертов (как факт, не правило)
```

## Таймауты и ожидания (раздел 11)

```
Grep: "waitForResponse"  → паттерн/url
Grep: "waitForRequest"   → паттерн
Grep: "waitForSelector"  → селектор
Grep: "waitForTimeout"   → count (возможный анти-паттерн)
Grep: "DEFAULT_EXPECT_TIMEOUT|waitForTimeout|BACKEND|TIMEOUT" в утилитах-константах → значения
```

## Данные и хуки (разделы 12–13)

```
Grep: "faker"            → импорт/использование
Grep: "generate\w+\(" или "function \w*generate|const \w*generate" → генераторы
Grep: "test\.beforeEach|beforeEach\(" → count
Grep: "test\.beforeAll|beforeAll\("   → count
Grep: "afterEach\("      → count
Grep: "afterAll\("       → count
Grep: "storageState"     → какие сессии/роли
```

## Setup, теги, CI, артефакты (разделы 14–17)

```
Glob: **/*.setup.ts, **/.auth/*, cypress/support/**  → setup/аутентификация
Grep: "SKIP_SETUP|process\.env\.CI|process\.env\.[A-Z_]+" → env-флаги
Glob: **/.github/workflows/*, **/.gitlab-ci.yml, **/.circleci/*, **/azure-pipelines.yml → CI
Read: playwright.config.ts / cypress.config.ts / jest.config.ts  → reporter, screenshot, video, trace, outputDir
Grep: "tag:\s*\[" , "describe\.only|test\.only|\[tag|\.skip\(" → теги и маркировка
```

## Эталонный тест (раздел 18)

1. Найти самые большие тестовые файлы: `Glob: **/*.spec.ts, **/*.test.ts, **/*.cy.ts` →
   отсортировать по размеру, выбрать 1–2 самых больших из **разных доменов** (папок).
2. `Read` целиком (или порциями при большом размере).
3. Зафиксировать: импорты, `test.use`, хуки, шаги/`allure.step`, паттерн
   «настройка → действие → проверка», тип ассертов. Привести ключевые цитаты с путём/строкой.

## Важно

- Каждый факт обязан опираться на реальный файл (путь). Без подтверждения — «Не обнаружено».
- Числа «count» приводятся по репрезентативной выборке (из разных доменов), а не как
  точная статистика — в отчёте это оговаривается.
- Никаких жёстких правил про «второй аргумент expect обязан быть на русском» — наличие
  кастомных сообщений фиксируется как факт с частотой, но не как требование.