Вот полный комплексный план тестирования главной страницы SQA Days 39:

# SQA Days 39 — Комплексный план тестирования главной страницы

## Обзор приложения

Главная страница конференции SQA Days 39 — международная конференция по тестированию и качеству ПО. Страница содержит:
- Cookie banner
- Header с логотипом, навигацией и кнопкой "Войти"
- Главный баннер с информацией о конференции (даты 30-31 октября 2026, Москва)
- Быстрые ссылки (Место проведения, Программа, Контакты, Стоимость, Проживание, Партнеры)
- Кнопка "Купить билет"
- Секция анонсов других конференций (Analyst Days, TechWriter Days)
- Секция "О конференции" с видео, темами, списком преимуществ
- Секция спикеров
- Секция партнёров
- Секция новостей
- Ссылки на социальные сети (VK, Telegram)
- Обратный отсчёт до начала конференции
- Footer с навигацией, всеми конференциями, политиками и копирайтом

---

## 1. Cookie Banner (4 теста)

### 1.1. Cookie banner appears on page load
**Файл:** `tests/cookie-banner/cookie-banner-appears.spec.ts`
**Шаги:**
1. Перейти на https://sqadays.com/ru/index
   - Ожидание: Страница загрузилась успешно
2. Проверить что banner содержит текст "Продолжая работу с сайтом"
   - Ожидание: Текст отображается
3. Проверить что кнопка "Принять" видна
   - Ожидание: Кнопка кликабельна
4. Нажать "Принять"
   - Ожидание: Banner исчезает

### 1.2. Cookie info link works
**Файл:** `tests/cookie-banner/cookie-info-link.spec.ts`
**Шаги:**
1. Перейти на https://sqadays.com/ru/index
   - Ожидание: Banner виден
2. Нажать "Больше информации..."
   - Ожидание: Навигация на /ru/article/cookies

### 1.3. Accept button functionality
**Файл:** `tests/cookie-banner/accept-button.spec.ts`
**Шаги:**
1. Перейти на https://sqadays.com/ru/index
   - Ожидание: Banner виден
2. Нажать "Принять"
   - Ожидание: Banner исчезает
3. Проверить что banner больше нет в DOM
   - Ожидание: Элемент удалён

### 1.4. Cookie banner text content
**Файл:** `tests/cookie-banner/banner-text-content.spec.ts`
**Шаги:**
1. Перейти на https://sqadays.com/ru/index
   - Ожидание: Страница загрузилась
2. Проверить полный текст cookie banner
   - Ожидание: Содержит информацию о cookies и конфиденциальности

---

## 2. Header Navigation (5 тестов)

### 2.1. Logo link works
**Файл:** `tests/header/logo-link.spec.ts`
**Шаги:**
1. Перейти на https://sqadays.com/ru/index
   - Ожидание: Страница загрузилась
2. Нажать на логотип "SQA Days / 39"
   - Ожидание: Остаёмся на главной странице (или редирект на /ru/index)

### 2.2. Login button visible and functional
**Файл:** `tests/header/login-button.spec.ts`
**Шаги:**
1. Перейти на https://sqadays.com/ru/index
   - Ожидание: Страница загрузилась
2. Проверить что кнопка "Войти" видна
   - Ожидание: Кнопка отображается
3. Нажать "Войти"
   - Ожидание: Навигация на /ru/Auth2Login

### 2.3. Header navigation items
**Файл:** `tests/header/navigation-items.spec.ts`
**Шаги:**
1. Перейти на https://sqadays.com/ru/index
   - Ожидание: Страница загрузилась
2. Проверить что все пункты меню видны
   - Ожидание: Логотип и кнопка "Войти" отображаются

### 2.4. Header scroll behavior
**Файл:** `tests/header/scroll-behavior.spec.ts`
**Шаги:**
1. Перейти на https://sqadays.com/ru/index
   - Ожидание: Страница загрузилась
2. Прокрутить страницу вниз
   - Ожидание: Header остаётся видимым или меняется стиль

### 2.5. Header responsive menu
**Файл:** `tests/header/responsive-menu.spec.ts`
**Шаги:**
1. Перейти на https://sqadays.com/ru/index
   - Ожидание: Страница загрузилась
2. Изменить размер окна до мобильного
   - Ожидание: Появляется hamburger menu

---

## 3. Main Banner (4 теста)

### 3.1. Conference title displays correctly
**Файл:** `tests/main-banner/conference-title.spec.ts`
**Шаги:**
1. Перейти на https://sqadays.com/ru/index
   - Ожидание: Страница загрузилась
2. Проверить заголовок "SQA Days / 39"
   - Ожидание: Отображается XXXIX Международная конференция

### 3.2. Conference dates and location
**Файл:** `tests/main-banner/dates-location.spec.ts`
**Шаги:**
1. Перейти на https://sqadays.com/ru/index
   - Ожидание: Страница загрузилась
2. Проверить что даты "30-31 Октября 2026" видны
   - Ожидание: Даты отображаются
3. Проверить что локация "Москва" видна
   - Ожидание: Локация отображается

### 3.3. Conference format
**Файл:** `tests/main-banner/conference-format.spec.ts`
**Шаги:**
1. Перейти на https://sqadays.com/ru/index
   - Ожидание: Страница загрузилась
2. Проверить что формат "OFFLINE&ONLINE" виден
   - Ожидание: Формат отображается

### 3.4. Quick links in banner
**Файл:** `tests/main-banner/quick-links.spec.ts`
**Шаги:**
1. Перейти на https://sqadays.com/ru/index
   - Ожидание: Страница загрузилась
2. Проверить что все быстрые ссылки видны
   - Ожидание: Место проведения, Программа, Контакты, Стоимость, Проживание, Партнеры

---

## 4. Quick Links Section (9 тестов)

### 4.1. Место проведения link
**Файл:** `tests/quick-links/place-link.spec.ts`
**Шаги:**
1. Перейти на https://sqadays.com/ru/index
   - Ожидание: Страница загрузилась
2. Нажать "Место проведения"
   - Ожидание: Навигация на /ru/place?eventId=149374

### 4.2. Программа link
**Файл:** `tests/quick-links/program-link.spec.ts`
**Шаги:**
1. Перейти на https://sqadays.com/ru/index
   - Ожидание: Страница загрузилась
2. Нажать "Программа"
   - Ожидание: Навигация на /ru/program/149374

### 4.3. Контакты link
**Файл:** `tests/quick-links/contacts-link.spec.ts`
**Шаги:**
1. Перейти на https://sqadays.com/ru/index
   - Ожидание: Страница загрузилась
2. Нажать "Контакты"
   - Ожидание: Навигация на /ru/contacts?eventId=149374

### 4.4. Стоимость link
**Файл:** `tests/quick-links/cost-link.spec.ts`
**Шаги:**
1. Перейти на https://sqadays.com/ru/index
   - Ожидание: Страница загрузилась
2. Нажать "Стоимость"
   - Ожидание: Навигация на /ru/conferenceCost?eventId=149374

### 4.5. Проживание link
**Файл:** `tests/quick-links/accommodation-link.spec.ts`
**Шаги:**
1. Перейти на https://sqadays.com/ru/index
   - Ожидание: Страница загрузилась
2. Нажать "Проживание"
   - Ожидание: Навигация на страницу проживания

### 4.6. Партнеры link
**Файл:** `tests/quick-links/partners-link.spec.ts`
**Шаги:**
1. Перейти на https://sqadays.com/ru/index
   - Ожидание: Страница загрузилась
2. Нажать "Партнеры"
   - Ожидание: Прокрутка к секции партнёров

### 4.7. Участникам link
**Файл:** `tests/quick-links/participants-link.spec.ts`
**Шаги:**
1. Перейти на https://sqadays.com/ru/index
   - Ожидание: Страница загрузилась
2. Нажать "Участникам"
   - Ожидание: Навигация на страницу для участников

### 4.8. Докладчикам link
**Файл:** `tests/quick-links/speakers-link.spec.ts`
**Шаги:**
1. Перейти на https://sqadays.com/ru/index
   - Ожидание: Страница загрузилась
2. Нажать "Докладчикам"
   - Ожидание: Навигация на /ru/for_speakers

### 4.9. Партнерам link
**Файл:** `tests/quick-links/company-link.spec.ts`
**Шаги:**
1. Перейти на https://sqadays.com/ru/index
   - Ожидание: Страница загрузилась
2. Нажать "Партнерам"
   - Ожидание: Прокрутка к секции для компаний

---

## 5. Buy Ticket Button (2 теста)

### 5.1. Buy ticket button visible
**Файл:** `tests/buy-ticket/button-visible.spec.ts`
**Шаги:**
1. Перейти на https://sqadays.com/ru/index
   - Ожидание: Страница загрузилась
2. Проверить что кнопка "Купить билет" видна
   - Ожидание: Кнопка отображается

### 5.2. Buy ticket button navigation
**Файл:** `tests/buy-ticket/button-navigation.spec.ts`
**Шаги:**
1. Перейти на https://sqadays.com/ru/index
   - Ожидание: Страница загрузилась
2. Нажать "Купить билет"
   - Ожидание: Навигация на страницу стоимости

---

## 6. Announcements Section (3 теста)

### 6.1. Analyst Days announcement
**Файл:** `tests/announcements/analyst-days.spec.ts`
**Шаги:**
1. Перейти на https://sqadays.com/ru/index
   - Ожидание: Страница загрузилась
2. Проверить что анонс "Analyst Days - 23" виден
   - Ожидание: Отображается с датами 20-21 ноября 2026
3. Нажать на ссылку Analyst Days
   - Ожидание: Навигация на analystdays.com

### 6.2. TechWriter Days announcement
**Файл:** `tests/announcements/techwriter-days.spec.ts`
**Шаги:**
1. Перейти на https://sqadays.com/ru/index
   - Ожидание: Страница загрузилась
2. Проверить что анонс "TechWriter Days - 4" виден
   - Ожидание: Отображается с датами 26-27 марта 2027
3. Нажать на ссылку TechWriter Days
   - Ожидание: Навигация на techwriterdays.ru

### 6.3. Announcements section header
**Файл:** `tests/announcements/section-header.spec.ts`
**Шаги:**
1. Перейти на https://sqadays.com/ru/index
   - Ожидание: Страница загрузилась
2. Проверить заголовок "Анонсы"
   - Ожидание: Заголовок отображается

---

## 7. About Conference Section (5 тестов)

### 7.1. Section header
**Файл:** `tests/about-conference/section-header.spec.ts`
**Шаги:**
1. Перейти на https://sqadays.com/ru/index
   - Ожидание: Страница загрузилась
2. Проверить заголовок "О конференции"
   - Ожидание: Заголовок отображается

### 7.2. Conference description
**Файл:** `tests/about-conference/description.spec.ts`
**Шаги:**
1. Перейти на https://sqadays.com/ru/index
   - Ожидание: Страница загрузилась
2. Проверить что описание конференции видно
   - Ожидание: Содержит информацию о 39-й конференции

### 7.3. Video player button
**Файл:** `tests/about-conference/video-button.spec.ts`
**Шаги:**
1. Перейти на https://sqadays.com/ru/index
   - Ожидание: Страница загрузилась
2. Проверить что кнопка "Смотреть" видна
   - Ожидание: Кнопка отображается

### 7.4. Conference topics list
**Файл:** `tests/about-conference/topics-list.spec.ts`
**Шаги:**
1. Перейти на https://sqadays.com/ru/index
   - Ожидание: Страница загрузилась
2. Проверить что список тем виден
   - Ожидание: Содержит минимум 6 тем (тестирование, автоматизация и т.д.)

### 7.5. Letter template link
**Файл:** `tests/about-conference/letter-template.spec.ts`
**Шаги:**
1. Перейти на https://sqadays.com/ru/index
   - Ожидание: Страница загрузилась
2. Нажать "ШАБЛОН ПИСЬМА (Word)"
   - Ожидание: Скачивание или переход на документ

---

## 8. Speakers Section (3 теста)

### 8.1. Section header
**Файл:** `tests/speakers/section-header.spec.ts`
**Шаги:**
1. Перейти на https://sqadays.com/ru/index
   - Ожидание: Страница загрузилась
2. Проверить заголовок "Спикеры SQA Days / 39"
   - Ожидание: Заголовок отображается

### 8.2. Speakers grid display
**Файл:** `tests/speakers/grid-display.spec.ts`
**Шаги:**
1. Перейти на https://sqadays.com/ru/index
   - Ожидание: Страница загрузилась
2. Проверить что карточки спикеров видны
   - Ожидание: Отображается минимум 10 карточек

### 8.3. All speakers link
**Файл:** `tests/speakers/all-speakers-link.spec.ts`
**Шаги:**
1. Перейти на https://sqadays.com/ru/index
   - Ожидание: Страница загрузилась
2. Нажать "Все спикеры"
   - Ожидание: Навигация на /ru/participants/149374?roleValue=speaker

---

## 9. Partners Section (5 тестов)

### 9.1. Section header
**Файл:** `tests/partners/section-header.spec.ts`
**Шаги:**
1. Перейти на https://sqadays.com/ru/index
   - Ожидание: Страница загрузилась
2. Проверить заголовок "Партнёры конференции"
   - Ожидание: Заголовок отображается

### 9.2. Silver partners
**Файл:** `tests/partners/silver-partners.spec.ts`
**Шаги:**
1. Перейти на https://sqadays.com/ru/index
   - Ожидание: Страница за
   Продолжаю план тестирования:

---

## 9. Partners Section (5 тестов) - продолжение

### 9.2. Silver partners
**Файл:** `tests/partners/silver-partners.spec.ts`
**Шаги:**
1. Перейти на https://sqadays.com/ru/index
   - Ожидание: Страница загрузилась
2. Проверить что секция "Серебряный партнёр" видна
   - Ожидание: Отображаются логотипы партнёров (centicore.ru, save-test.ru)

### 9.3. Information partners
**Файл:** `tests/partners/information-partners.spec.ts`
**Шаги:**
1. Перейти на https://sqadays.com/ru/index
   - Ожидание: Страница загрузилась
2. Проверить что секция "Информационные партнёры" видна
   - Ожидание: Отображаются минимум 5 ссылок партнёров

### 9.4. Become a partner link
**Файл:** `tests/partners/become-partner-link.spec.ts`
**Шаги:**
1. Перейти на https://sqadays.com/ru/index
   - Ожидание: Страница загрузилась
2. Нажать "Стать партнёром"
   - Ожидание: Навигация на partners?eventId=149374

### 9.5. Partner links work
**Файл:** `tests/partners/partner-links-work.spec.ts`
**Шаги:**
1. Перейти на https://sqadays.com/ru/index
   - Ожидание: Страница загрузилась
2. Нажать на ссылку партнёра (например, centicore.ru)
   - Ожидание: Открытие внешней ссылки

### 9.6. Partner section completeness
**Файл:** `tests/partners/section-completeness.spec.ts`
**Шаги:**
1. Перейти на https://sqadays.com/ru/index
   - Ожидание: Страница загрузилась
2. Проверить что все категории партнёров видны
   - Ожидание: Серебряные и информационные партнёры отображаются

---

## 10. News Section (4 теста)

### 10.1. Section header
**Файл:** `tests/news/section-header.spec.ts`
**Шаги:**
1. Перейти на https://sqadays.com/ru/index
   - Ожидание: Страница загрузилась
2. Проверить заголовок "Новости"
   - Ожидание: Заголовок отображается

### 10.2. First news item
**Файл:** `tests/news/first-news-item.spec.ts`
**Шаги:**
1. Перейти на https://sqadays.com/ru/index
   - Ожидание: Страница загрузилась
2. Проверить что первая новость видна
   - Ожидание: Дата "15.09.2026" и заголовок "Программа SQA Days 39 готова"

### 10.3. Second news item
**Файл:** `tests/news/second-news-item.spec.ts`
**Шаги:**
1. Перейти на https://sqadays.com/ru/index
   - Ожидание: Страница загрузилась
2. Проверить что вторая новость видна
   - Ожидание: Дата "01.09.2026" и заголовок "Масштабное обновление программы"

### 10.4. Third news item
**Файл:** `tests/news/third-news-item.spec.ts`
**Шаги:**
1. Перейти на https://sqadays.com/ru/index
   - Ожидание: Страница загрузилась
2. Проверить что третья новость видна
   - Ожидание: Дата "14.08.2026" и заголовок "Первые принятые доклады"

### 10.5. All news button
**Файл:** `tests/news/all-news-button.spec.ts`
**Шаги:**
1. Перейти на https://sqadays.com/ru/index
   - Ожидание: Страница загрузилась
2. Нажать "Все новости"
   - Ожидание: Навигация на /ru/news?eventId=149374

### 10.6. News links work
**Файл:** `tests/news/news-links-work.spec.ts`
**Шаги:**
1. Перейти на https://sqadays.com/ru/index
   - Ожидание: Страница загрузилась
2. Нажать на первую новость
   - Ожидание: Навигация на страницу статьи

---

## 11. Social Media (3 теста)

### 11.1. Social media section header
**Файл:** `tests/social-media/section-header.spec.ts`
**Шаги:**
1. Перейти на https://sqadays.com/ru/index
   - Ожидание: Страница загрузилась
2. Проверить заголовок "Общайся там, где тебе удобно"
   - Ожидание: Заголовок отображается

### 11.2. VKontakte link
**Файл:** `tests/social-media/vkontakte-link.spec.ts`
**Шаги:**
1. Перейти на https://sqadays.com/ru/index
   - Ожидание: Страница загрузилась
2. Нажать "Vkontakte"
   - Ожидание: Открытие ссылки https://vk.com/sqadaysconf

### 11.3. Telegram link
**Файл:** `tests/social-media/telegram-link.spec.ts`
**Шаги:**
1. Перейти на https://sqadays.com/ru/index
   - Ожидание: Страница загрузилась
2. Нажать "Telegram"
   - Ожидание: Открытие ссылки https://t.me/sqadays

---

## 12. Countdown Timer (2 теста)

### 12.1. Countdown display
**Файл:** `tests/countdown-timer/countdown-display.spec.ts`
**Шаги:**
1. Перейти на https://sqadays.com/ru/index
   - Ожидание: Страница загрузилась
2. Проверить что обратный отсчёт виден
   - Ожидание: Отображается "X дней до начала конференции"

### 12.2. Countdown buy ticket button
**Файл:** `tests/countdown-timer/buy-ticket-button.spec.ts`
**Шаги:**
1. Перейти на https://sqadays.com/ru/index
   - Ожидание: Страница загрузилась
2. Проверить что кнопка "Купить билет" рядом с таймером видна
   - Ожидание: Кнопка отображается и кликабельна

---

## 13. Footer Navigation (7 тестов)

### 13.1. Footer logo and title
**Файл:** `tests/footer/footer-logo.spec.ts`
**Шаги:**
1. Перейти на https://sqadays.com/ru/index
   - Ожидание: Страница загрузилась
2. Проверить что логотип "SQA Days / 39" в футере виден
   - Ожидание: Логотип отображается

### 13.2. Program link in footer
**Файл:** `tests/footer/program-link.spec.ts`
**Шаги:**
1. Перейти на https://sqadays.com/ru/index
   - Ожидание: Страница загрузилась
2. Нажать "Программа" в футере
   - Ожидание: Навигация на /ru/program/149374

### 13.3. Talks link in footer
**Файл:** `tests/footer/talks-link.spec.ts`
**Шаги:**
1. Перейти на https://sqadays.com/ru/index
   - Ожидание: Страница загрузилась
2. Нажать "Доклады" в футере
   - Ожидание: Навигация на /ru/talks/149374

### 13.4. Participants link in footer
**Файл:** `tests/footer/participants-link.spec.ts`
**Шаги:**
1. Перейти на https://sqadays.com/ru/index
   - Ожидание: Страница загрузилась
2. Нажать "Участники" в футере
   - Ожидание: Навигация на /ru/participants/149374

### 13.5. Organizers link in footer
**Файл:** `tests/footer/organizers-link.spec.ts`
**Шаги:**
1. Перейти на https://sqadays.com/ru/index
   - Ожидание: Страница загрузилась
2. Нажать "Организаторы" в футере
   - Ожидание: Навигация на /ru/organizers/149374

### 13.6. Speakers info link in footer
**Файл:** `tests/footer/speakers-info-link.spec.ts`
**Шаги:**
1. Перейти на https://sqadays.com/ru/index
   - Ожидание: Страница загрузилась
2. Нажать "Информация для докладчиков" в футере
   - Ожидание: Навигация на страницу для докладчиков

### 13.7. All conferences menu
**Файл:** `tests/footer/all-conferences-menu.spec.ts`
**Шаги:**
1. Перейти на https://sqadays.com/ru/index
   - Ожидание: Страница загрузилась
2. Проверить что меню "Все конференции" видно
   - Ожидание: Analyst Days, SQA Days EA, Analyst Days EA, TechWriter Days

---

## 14. Footer Policies and Social (5 тестов)

### 14.1. Copyright text
**Файл:** `tests/footer-policies/copyright.spec.ts`
**Шаги:**
1. Перейти на https://sqadays.com/ru/index
   - Ожидание: Страница загрузилась
2. Проверить что копирайт "SQA Days® 2007 - 2026" виден
   - Ожидание: Копирайт отображается

### 14.2. Privacy policy link
**Файл:** `tests/footer-policies/privacy-policy.spec.ts`
**Шаги:**
1. Перейти на https://sqadays.com/ru/index
   - Ожидание: Страница загрузилась
2. Нажать "Политика Конфиденциальности"
   - Ожидание: Открытие PDF файла /DataProcessingPolicy_ru.pdf

### 14.3. Content policy link
**Файл:** `tests/footer-policies/content-policy.spec.ts`
**Шаги:**
1. Перейти на https://sqadays.com/ru/index
   - Ожидание: Страница загрузилась
2. Нажать "Контентная политика"
   - Ожидание: Навигация на /ru/article/contentPolicy

### 14.4. Code of conduct link
**Файл:** `tests/footer-policies/code-of-conduct.spec.ts`
**Шаги:**
1. Перейти на https://sqadays.com/ru/index
   - Ожидание: Страница загрузилась
2. Нажать "Кодекс поведения на конференциях"
   - Ожидание: Навигация на /ru/article/codeofconduct

### 14.5. Sitemap link
**Файл:** `tests/footer-policies/sitemap.spec.ts`
**Шаги:**
1. Перейти на https://sqadays.com/ru/index
   - Ожидание: Страница загрузилась
2. Нажать "Карта сайта"
   - Ожидание: Открытие /sitemap.xml

### 14.6. Footer social links
**Файл:** `tests/footer-policies/footer-social.spec.ts`
**Шаги:**
1. Перейти на https://sqadays.com/ru/index
   - Ожидание: Страница загрузилась
2. Проверить что соцсети в футере видны
   - Ожидание: VK и Telegram отображаются

### 14.7. Footer design credit
**Файл:** `tests/footer-policies/design-credit.spec.ts`
**Шаги:**
1. Перейти на https://sqadays.com/ru/index
   - Ожидание: Страница загрузилась
2. Проверить что ссылка "69pixels" видна
   - Ожидание: Ссылка на дизайн студию отображается

---

## ИТОГО: 14 тест-сьютов, 60+ тестов

| # | Тест-сют | Кол-во тестов |
|---|----------|---------------|
| 1 | Cookie Banner | 4 |
| 2 | Header Navigation | 5 |
| 3 | Main Banner | 4 |
| 4 | Quick Links Section | 9 |
| 5 | Buy Ticket Button | 2 |
| 6 | Announcements Section | 3 |
| 7 | About Conference Section | 5 |
| 8 | Speakers Section | 3 |
| 9 | Partners Section | 6 |
| 10 | News Section | 6 |
| 11 | Social Media | 3 |
| 12 | Countdown Timer | 2 |
| 13 | Footer Navigation | 7 |
| 14 | Footer Policies and Social | 7 |
| **ВСЕГО** | | **66 тестов** |

---

**Генерирую тесты по этому плану?**