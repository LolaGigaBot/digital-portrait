# Сайт-резюме Дмитрия

React + TypeScript + Vite, физика — Matter.js. Серверной части нет.

## Запуск
```
npm install
npm run dev      # разработка (заполнители видны)
npm run build    # публичная сборка в dist/ (заполнители ссылок/проектов скрыты)
npm test         # тесты возраста, стажа, склонений, возрастных стилей
```
Проверка дат без ожидания: `http://localhost:5173/?now=2029-10-30` (также 2026-10-30, 2049-10-30).

## Где менять данные
| Что | Файл |
|---|---|
| дата рождения, версия сайта в подвале | `src/config/site.ts` |
| фотографии карусели (3 светлых, 3 тёмных) | `public/photos/light-1..3.webp`, `dark-1..3.webp`, подписи и ники под портретами — `src/data/photos.ts`; вырезка белого фона: `node scripts/cutout.mjs <вход> <выход.webp>` |
| компании и логотипы | `src/data/experience.ts` (логотипы — в `public/`) |
| навыки (шарики и список) | `src/data/skills.ts`; иконки по теме — `public/skills/<id>-light.webp` и `-dark.webp`; конвертация: `node scripts/skills.mjs <папка_архива>` |
| «Мой путь» (6 карточек, по теме) | `src/data/roadmap.ts`; картинки — `public/road/step-NN-light.webp` и `-dark.webp`; размеры — `src/data/roadmapSizes.json`; конвертация: `node scripts/roadmap.mjs <папка>` |
| контакты (почта, Telegram, GitHub — отдельно для светлой и тёмной темы), проекты | `src/data/links.ts`; обложки проектов по теме — `public/projects/<проект>-light.webp` и `-dark.webp`, конвертация: `node scripts/projects.mjs <папка>` |
| цвета, темы, возрастные стили | `src/styles/tokens.css` |
| логотипы компаний (по теме) | `public/logos/co/<имя>-light.webp` и `-dark.webp`; данные — `src/data/experience.ts`; из JPG: `node scripts/logos.mjs <папка>` |
| мета-комментарии и цитаты | `src/data/copy.ts` |
| иллюстрации карточек опыта (по теме) | `public/scenes/<компания>-light.webp` и `-dark.webp`; подписи — `src/data/experience.ts`; конвертация: `node scripts/scenes.mjs <папка>` |

## Публикация на GitHub Pages
1. На github.com создайте пустой репозиторий (без README и `.gitignore`).
2. В папке проекта: `git init -b main`, затем один раз `git config user.name "Имя"` и `git config user.email "<ID>+<логин>@users.noreply.github.com"` (адрес из GitHub → Settings → Emails, чтобы настоящая почта не попала в историю коммитов).
3. `git add .`, `git commit -m "Первая версия сайта"`, `git remote add origin https://github.com/<логин>/<репозиторий>.git`, `git push -u origin main`.
4. В репозитории: Settings → Pages → Source: **GitHub Actions**. После первого запуска workflow (`.github/workflows/deploy.yml`) сайт будет по адресу `https://<логин>.github.io/<репозиторий>/`.
5. Пока сайт на оценке, в `index.html` стоит `noindex` (поисковики его не покажут). Для публикации «насовсем» удалите эту строку.

Промты: `docs/PROMPT.md` (основной) и `docs/PROMPT-v2.md` (итерация 2: арт-комикс, логотипы, портреты, аудит ECC).

