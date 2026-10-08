# Автоопределение тестового фреймворка

Этот файл — справочник для SKILL.md. Он описывает, как скилл определяет, какой тестовый
фреймворк используется в проекте, и какие конфиги/глобы искать для каждого фреймворка.

## Приоритет определения

Определение идёт **по первому совпадению в указанном порядке**, и предпочтение отдаётся
**наличию конфиг-файла**, а не упоминанию пакета в `package.json`:

```
1. наличие конфиг-файла фреймворка  →  фреймворк определён
2. пакет в dependencies/devDependencies → фреймворк определён (но слабее)
3. ничего из перечисленного         →  «Фреймворк не определён»
```

Если по нескольким фреймворкам есть совпадения — берём **основной** (первый по приоритету
в таблице ниже), а остальные помечаем в отчёте строкой «Также присутствуют: …».

## Матрица «фреймворк → что искать»

### Playwright

| Признак | Как проверять |
|---|---|
| Конфиг | `playwright.config.ts / .js / .mjs / .cjs` (может быть `playwright.base.config.ts`, соединяемый файлами проектов) |
| Пакеты | `@playwright/test`, `playwright` в `package.json` |
| Тест-глобы | `**/*.spec.ts`, `**/*.spec.js`, `**/*.test.ts`, `**/e2e/*.ts` |
| Раскладка | `testDir` (по умолчанию `tests/`), часто `e2e/`, `src/tests/`, `tests/e2e/` |
| Особое | события: `projects`, `dependencies`, `use.storageState`, `reporter`, `outputDir`, `workers` |

Ключевые настройки конфига для отчёта: `baseURL`, `timeout`, `use`, `retries`, `projects`,
`dependencies`, `reporter`, `outputDir`, `expect.timeout`.

### Cypress

| Признак | Как проверять |
|---|---|
| Конфиг | `cypress.config.ts / .js / .mjs` |
| Пакеты | `cypress` в `package.json` |
| Тест-глобы | `**/*.cy.ts`, `**/*.spec.ts` (в `cypress/e2e/` или `cypress/integration/`) |
| Раскладка | `cypress/e2e/**`, `cypress/integration/**`, `cypress/support/**` |
| Особое | команды `cy.*`, ассерты `cy.get().should(...)` / `expect().to...`, `Cypress.Commands.add`, `beforeEach` в support |

Ключевые настройки: `e2e.baseUrl`, `e2e.retries`, `video`, `screenshotOnRunFailure`,
`viewportWidth/Height`, `experimentalSessionAndOrigin`. Специфичные ассерты — через
`cy.get(...).should(...)`.

### Jest

| Признак | Как проверять |
|---|---|
| Конфиг | `jest.config.ts / .js / .mjs / .json`, либо секция `"jest"` в `package.json` |
| Пакеты | `jest`, `@types/jest`, `ts-jest` в `package.json` |
| Тест-глобы | `__tests__/**`, `**/*.test.ts/tsx/js/jsx`, `**/*.spec.ts` |
| Раскладка | тесты рядом с исходниками или в `__tests__/` |
| Особое | `testEnvironment`, `setupFilesAfterEnv`, `transform`, `collectCoverageFrom`, `testMatch`/`testRegex`, репортеры (jest-junit, jest-html-reporter), `test.concurrent`, `.only`, `.skip` |

### Vitest

| Признак | Как проверять |
|---|---|
| Конфиг | `vitest.config.ts / .js / .mjs`, либо секция `"test"` / расширение от vite-конфига |
| Пакеты | `vitest` в `package.json` |
| Тест-глобы | аналогично Jest: `__tests__/**`, `**/*.test.ts`, `**/*.spec.ts` |
| Особое | `test.include`, `test.exclude`, `test.environment`, `test.setupFiles`, `test.coverage`, `test.concurrent`, `.todo`, `.skip` |

### Если ничего не совпало

- В отчёте пишем «Фреймворк не определён».
- Делаем «слепую пробу»: смотрим тест-скрипты в `package.json` и топ-уровневые тест-каталоги
  (`tests/`, `e2e/`, `spec/`, `test/`, `__tests__/`), фиксируем то, что реально видно, и не выдумываем.

## Список путей/глобов для ленивого probe (особенно для монорепо/Nx)

Конфиги могут лежать не в корне, а в каждой под-папке. Обходим лениво:

```
Glob: **/playwright.config.*, **/cypress.config.*, **/jest.config.*, **/vitest.config.*
  (исключая node_modules, dist, build, .git)

Glob тестов: **/*.spec.ts, **/*.test.ts, **/*.cy.ts
  (исключая node_modules)
```

Если проект монорепо (Nx, Turborepo) с `package.json` в корне и тестами по `apps/*`/`packages/*` —
ищем конфиги из корня и из обнаруженных тест-каталогов, не предполагая один единственный конфиг.

## Замечания по оболочке

- Примеры команд в этом скилле могут быть даны в стиле Bash, но при необходимости допустимы
  PowerShell-эквиваленты (`dir /s /b`, `findstr`, `Select-String`). Жестко не привязываемся
  к одной оболочке; главное — корректно обнаружить файлы.